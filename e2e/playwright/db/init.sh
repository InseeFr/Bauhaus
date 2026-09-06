#!/usr/bin/env bash
#
# (Re)crée les dépôts GraphDB `bauhaus` et `publication` et y charge les jeux
# de données de test du Back-Office.
#
# ⚠️  Destructif : les deux dépôts sont supprimés avant rechargement. Tout ce qui
#     précède ces suppressions est donc une vérification : le script refuse de
#     détruire quoi que ce soit s'il ne peut pas ensuite tout recharger.
#
# À lancer depuis `e2e/` :
#     ./playwright/db/init.sh
#
# Variables :
#   GRAPHDB_URL       défaut http://localhost:7200
#   BACK_OFFICE_HOME  racine du dépôt Bauhaus-Back-Office
#                     (défaut ../../Bauhaus-Back-Office, soit le dépôt cloné
#                     à côté de Bauhaus ; en CI : ../bauhaus-back-office)
set -euo pipefail

GRAPHDB_URL="${GRAPHDB_URL:-http://localhost:7200}"
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

# Nombre de triplets attendu dans `bauhaus` une fois les fixtures chargées.
# Il fige le contenu des fixtures : un `.trig` tronqué, vidé ou remplacé côté
# Back-Office fait échouer le script au lieu de laisser passer des tests e2e qui
# s'exécutent sur des données partielles.
# Pour le régénérer après une modification volontaire des fixtures :
#     curl -sf "${GRAPHDB_URL}/repositories/bauhaus/size"
EXPECTED_TRIPLES=79287

CONFIGS=(
	./playwright/db/config.ttl
	./playwright/db/config-diffusion.ttl
)

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
for config in "${CONFIGS[@]}"; do
	[ -f "${config}" ] || missing+=("${config}")
done

if [ ${#missing[@]} -ne 0 ]; then
	echo "Fichiers manquants, aucun dépôt n'a été supprimé :" >&2
	printf '  - %s\n' "${missing[@]}" >&2
	echo "Les .trig vivent dans Bauhaus-Back-Office : un renommage là-bas casse ce script." >&2
	echo "Les .ttl sont relatifs au répertoire courant : lancer le script depuis e2e/." >&2
	exit 1
fi

# --- Rechargement ------------------------------------------------------------

curl -sf -X DELETE "${GRAPHDB_URL}/rest/repositories/bauhaus" || true
curl -sf -X DELETE "${GRAPHDB_URL}/rest/repositories/publication" || true

for config in "${CONFIGS[@]}"; do
	curl -sf -X POST "${GRAPHDB_URL}/rest/repositories" \
		-H 'Content-Type: multipart/form-data' \
		-F "config=@${config}"
done

for fixture in "${FIXTURE_NAMES[@]}"; do
	echo "Chargement de ${fixture}.trig"
	curl -sf -X POST "${GRAPHDB_URL}/repositories/bauhaus/statements" \
		-H "Content-Type: application/trig" \
		--data-binary "@${FIXTURES}/${fixture}.trig"
done

# --- Vérification du chargement ----------------------------------------------

loaded=$(curl -sf "${GRAPHDB_URL}/repositories/bauhaus/size")

if [ "${loaded}" -ne "${EXPECTED_TRIPLES}" ]; then
	echo "Dépôt bauhaus : ${loaded} triplets chargés, ${EXPECTED_TRIPLES} attendus." >&2
	echo "Si les fixtures ont changé volontairement, mettre à jour EXPECTED_TRIPLES." >&2
	exit 1
fi

echo "Dépôt bauhaus : ${loaded} triplets chargés."
