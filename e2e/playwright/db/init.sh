#!/usr/bin/env bash
#
# (Re)crée les dépôts `bauhaus` et `publication` et y charge les jeux de données
# de test du Back-Office. Sur GraphDB (défaut) ce sont des dépôts, sur Fuseki
# des datasets (compose-fuseki.yaml).
#
# ⚠️  Destructif : les deux dépôts sont supprimés avant rechargement. Tout ce qui
#     précède ces suppressions est donc une vérification : le script refuse de
#     détruire quoi que ce soit s'il ne peut pas ensuite tout recharger.
#
# À lancer depuis `e2e/` :
#     ./playwright/db/init.sh
#     RDF_BACKEND=fuseki ./playwright/db/init.sh
#
# Variables :
#   RDF_BACKEND       graphdb (défaut) ou fuseki
#   GRAPHDB_URL       défaut http://localhost:7200
#   FUSEKI_URL        défaut http://localhost:3030
#   FUSEKI_USER       défaut admin   (administration et écritures de Fuseki,
#   FUSEKI_PASSWORD   défaut admin    voir containers/fuseki.yml)
#   BACK_OFFICE_HOME  racine du dépôt Bauhaus-Back-Office
#                     (défaut ../../Bauhaus-Back-Office, soit le dépôt cloné
#                     à côté de Bauhaus ; en CI : le checkout
#                     bauhaus-back-office de .github/workflows/playwright.yml)
set -euo pipefail

RDF_BACKEND="${RDF_BACKEND:-graphdb}"
GRAPHDB_URL="${GRAPHDB_URL:-http://localhost:7200}"
FUSEKI_URL="${FUSEKI_URL:-http://localhost:3030}"
FUSEKI_USER="${FUSEKI_USER:-admin}"
FUSEKI_PASSWORD="${FUSEKI_PASSWORD:-admin}"
BACK_OFFICE_HOME="${BACK_OFFICE_HOME:-../../Bauhaus-Back-Office}"
FIXTURES="${BACK_OFFICE_HOME}/module-bauhaus-bo/src/test/resources/testcontainers"

# Les jeux de données chargés dans le dépôt `bauhaus`, dans l'ordre de chargement.
FIXTURE_NAMES=(
	all-operations-and-indicators
	sims-all
	sims-metadata
	sims-codes
	documents
	organizations
	jeuxDeDonnees-pour-tests
	themes-jeu-de-donnees-dev
)

# Les jeux de données que la suite e2e possède en propre, chargés après ceux du
# Back-Office. Chemins relatifs à `e2e/`, comme les configurations de dépôt.
LOCAL_FIXTURES=(
	./playwright/db/classifications.trig
)

# Nombre de triplets attendu dans `bauhaus` une fois les fixtures chargées.
# Il fige le contenu des fixtures : un `.trig` tronqué, vidé ou remplacé côté
# Back-Office fait échouer le script au lieu de laisser passer des tests e2e qui
# s'exécutent sur des données partielles.
# Le même nombre sur les deux bases : GraphDB compte ses triplets explicites,
# Fuseki ses quads (count_triples ci-dessous).
# Pour le régénérer après une modification volontaire des fixtures :
#     curl -sf "${GRAPHDB_URL}/repositories/bauhaus/size"
EXPECTED_TRIPLES=79324

DATASETS=(bauhaus publication)

case "${RDF_BACKEND}" in
graphdb)
	CONFIGS=(
		./playwright/db/config.ttl
		./playwright/db/config-diffusion.ttl
	)
	;;
fuseki)
	CONFIGS=(
		./playwright/db/fuseki/bauhaus.ttl
		./playwright/db/fuseki/publication.ttl
	)
	;;
*)
	echo "RDF_BACKEND inconnu : ${RDF_BACKEND} (graphdb ou fuseki)" >&2
	exit 1
	;;
esac

# --- Opérations propres à chaque base ----------------------------------------

recreate_repositories() {
	local dataset config
	if [ "${RDF_BACKEND}" = graphdb ]; then
		for dataset in "${DATASETS[@]}"; do
			curl -sf -X DELETE "${GRAPHDB_URL}/rest/repositories/${dataset}" || true
		done
		for config in "${CONFIGS[@]}"; do
			curl -sf -X POST "${GRAPHDB_URL}/rest/repositories" \
				-H 'Content-Type: multipart/form-data' \
				-F "config=@${config}"
		done
	else
		# Supprimer le dataset efface aussi sa base TDB2 : le recréer repart à vide.
		for dataset in "${DATASETS[@]}"; do
			curl -sf -u "${FUSEKI_USER}:${FUSEKI_PASSWORD}" \
				-X DELETE "${FUSEKI_URL}/\$/datasets/${dataset}" || true
		done
		for config in "${CONFIGS[@]}"; do
			curl -sf -o /dev/null -u "${FUSEKI_USER}:${FUSEKI_PASSWORD}" \
				-X POST "${FUSEKI_URL}/\$/datasets" \
				-H 'Content-Type: text/turtle' \
				--data-binary "@${config}"
		done
	fi
}

# Charge un .trig dans `bauhaus`. Fuseki passe par le Graph Store Protocol
# (/data), qui répartit les quads dans leurs graphes nommés.
load_trig() {
	local file="$1"
	if [ "${RDF_BACKEND}" = graphdb ]; then
		curl -sf -X POST "${GRAPHDB_URL}/repositories/bauhaus/statements" \
			-H "Content-Type: application/trig" \
			--data-binary "@${file}"
	else
		# Pas de -f : Fuseki explique un refus dans le corps (préfixe non déclaré…).
		local response status
		response=$(mktemp)
		status=$(curl -s -o "${response}" -w '%{http_code}' \
			-u "${FUSEKI_USER}:${FUSEKI_PASSWORD}" \
			-X POST "${FUSEKI_URL}/bauhaus/data" \
			-H "Content-Type: application/trig" \
			--data-binary "@${file}")
		if [ "${status}" -ge 300 ]; then
			echo "Fuseki refuse ${file} (HTTP ${status}) : $(cat "${response}")" >&2
			rm -f "${response}"
			exit 1
		fi
		rm -f "${response}"
	fi
}

count_triples() {
	if [ "${RDF_BACKEND}" = graphdb ]; then
		curl -sf "${GRAPHDB_URL}/repositories/bauhaus/size"
	else
		# Graphe par défaut réel compris : avec unionDefaultGraph, `?s ?p ?o` seul
		# ne verrait que l'union des graphes nommés, dédoublonnée.
		curl -sf "${FUSEKI_URL}/bauhaus/sparql" \
			-H 'Accept: text/csv' \
			--data-urlencode 'query=SELECT (COUNT(*) AS ?n) WHERE { { GRAPH ?g { ?s ?p ?o } } UNION { GRAPH <urn:x-arq:DefaultGraph> { ?s ?p ?o } } }' |
			tail -n 1 | tr -d '\r'
	fi
}

# --- Vérifications préalables ------------------------------------------------
# Elles précèdent toutes les suppressions de dépôt : un fixture renommé côté
# Back-Office doit faire échouer le script *avant* qu'il ait détruit la base.

if [ ! -d "${FIXTURES}" ]; then
	echo "Jeux de données introuvables : ${FIXTURES}" >&2
	echo "Renseigner BACK_OFFICE_HOME vers la racine de Bauhaus-Back-Office." >&2
	exit 1
fi

missing=()
for fixture in "${FIXTURE_NAMES[@]}"; do
	[ -f "${FIXTURES}/${fixture}.trig" ] || missing+=("${FIXTURES}/${fixture}.trig")
done
for fixture in "${LOCAL_FIXTURES[@]}" "${CONFIGS[@]}"; do
	[ -f "${fixture}" ] || missing+=("${fixture}")
done

if [ ${#missing[@]} -ne 0 ]; then
	echo "Fichiers manquants, aucun dépôt n'a été supprimé :" >&2
	printf '  - %s\n' "${missing[@]}" >&2
	echo "Les .trig vivent dans Bauhaus-Back-Office : un renommage là-bas casse ce script." >&2
	echo "Les .ttl sont relatifs au répertoire courant : lancer le script depuis e2e/." >&2
	exit 1
fi

# --- Rechargement ------------------------------------------------------------

recreate_repositories

for fixture in "${FIXTURE_NAMES[@]}"; do
	echo "Chargement de ${fixture}.trig"
	load_trig "${FIXTURES}/${fixture}.trig"
done

for fixture in "${LOCAL_FIXTURES[@]}"; do
	echo "Chargement de ${fixture}"
	load_trig "${fixture}"
done

# --- Vérification du chargement ----------------------------------------------

loaded=$(count_triples)

if [ "${loaded}" -ne "${EXPECTED_TRIPLES}" ]; then
	echo "Dépôt bauhaus : ${loaded} triplets chargés, ${EXPECTED_TRIPLES} attendus." >&2
	echo "Si les fixtures ont changé volontairement, mettre à jour EXPECTED_TRIPLES." >&2
	exit 1
fi

echo "Dépôt bauhaus : ${loaded} triplets chargés."
