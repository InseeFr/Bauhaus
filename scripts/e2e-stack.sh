#!/usr/bin/env bash
#
# Monte la stack complète attendue par les tests de bout en bout, en une
# commande : GraphDB (ou Fuseki) + minio (et ses fichiers de test), charge les
# jeux de données de test, puis démarre le Back-Office (construit depuis le
# dépôt voisin). La stack est celle de docker-compose.yml (compose-fuseki.yaml
# avec Fuseki), surchargée par e2e/compose.e2e.yaml (back sans Keycloak).
#
# À lancer depuis la racine de `Bauhaus/` :
#     pnpm e2e:stack
#     RDF_BACKEND=fuseki pnpm e2e:stack
#
# L'IHM n'est PAS démarrée ici : Playwright s'en charge (`webServer` de
# playwright.config.ts). Une fois ce script sorti en 0 :
#     pnpm --dir e2e test
#
# ⚠️  Destructif sur les données : `init.sh` recrée les dépôts `bauhaus` et
#     `publication`. Voir son en-tête.
#
# Les deux stacks partagent le projet compose `bauhaus` : passer de l'une à
# l'autre recrée le back sur la nouvelle base, l'autre base reste lancée
# (compose la signale comme orpheline).
#
# Variables :
#   RDF_BACKEND       graphdb (défaut) ou fuseki
#   BACK_OFFICE_HOME  racine du dépôt Bauhaus-Back-Office
#                     (défaut ../Bauhaus-Back-Office, soit le dépôt cloné à
#                     côté de Bauhaus)
#   GRAPHDB_URL       défaut http://localhost:7200
#   FUSEKI_URL        défaut http://localhost:3030
#   API_URL           défaut http://localhost:8080/api
#   STACK_TIMEOUT     secondes d'attente par service (défaut 600 : le premier
#                     lancement construit toute l'image du Back-Office)
set -euo pipefail

BAUHAUS_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACK_OFFICE_HOME="${BACK_OFFICE_HOME:-${BAUHAUS_HOME}/../Bauhaus-Back-Office}"
RDF_BACKEND="${RDF_BACKEND:-graphdb}"
GRAPHDB_URL="${GRAPHDB_URL:-http://localhost:7200}"
FUSEKI_URL="${FUSEKI_URL:-http://localhost:3030}"
API_URL="${API_URL:-http://localhost:8080/api}"
STACK_TIMEOUT="${STACK_TIMEOUT:-600}"

case "${RDF_BACKEND}" in
graphdb)
	COMPOSE_FILE="docker-compose.yml"
	RDF_SERVICE=graphdb
	RDF_LABEL=GraphDB
	RDF_READY_URL="${GRAPHDB_URL}/rest/repositories"
	RDF_READY_CURL_OPTIONS=()
	;;
fuseki)
	COMPOSE_FILE="compose-fuseki.yaml"
	RDF_SERVICE=fuseki
	RDF_LABEL=Fuseki
	# L'API d'administration, qu'init.sh appelle : /$/ping répond avant elle.
	RDF_READY_URL="${FUSEKI_URL}/\$/datasets"
	RDF_READY_CURL_OPTIONS=(-u admin:admin)
	;;
*)
	echo "RDF_BACKEND inconnu : ${RDF_BACKEND} (graphdb ou fuseki)" >&2
	exit 1
	;;
esac

COMPOSE=(docker compose -f "${BAUHAUS_HOME}/${COMPOSE_FILE}" -f "${BAUHAUS_HOME}/e2e/compose.e2e.yaml")

# --- Vérifications préalables ------------------------------------------------

if [ ! -f "${BACK_OFFICE_HOME}/Dockerfile.bauhaus" ]; then
	echo "Back-Office introuvable : ${BACK_OFFICE_HOME}/Dockerfile.bauhaus" >&2
	echo "Cloner InseeFr/Bauhaus-Back-Office à côté de Bauhaus, ou renseigner" >&2
	echo "BACK_OFFICE_HOME vers la racine de ce dépôt." >&2
	exit 1
fi

# Chemin absolu, exporté : `init.sh` est lancé depuis e2e/ et les fichiers
# compose lisent un chemin relatif chacun depuis son propre répertoire.
BACK_OFFICE_HOME="$(cd "${BACK_OFFICE_HOME}" && pwd)"
export BACK_OFFICE_HOME

# --- Attente d'un service ----------------------------------------------------

wait_for() {
	# Arguments au-delà de l'URL : options curl en plus (identifiants…).
	local label="$1" url="$2" started elapsed
	shift 2
	started=${SECONDS}
	echo "Attente de ${label} (${url})…"
	until curl -sf -o /dev/null "$@" "${url}"; do
		elapsed=$((SECONDS - started))
		if [ "${elapsed}" -ge "${STACK_TIMEOUT}" ]; then
			echo "${label} n'a pas répondu en ${STACK_TIMEOUT} s : ${url}" >&2
			echo "Journaux : ${COMPOSE[*]} logs" >&2
			exit 1
		fi
		sleep 5
	done
	echo "  ${label} : prêt en $((SECONDS - started)) s"
}

# --- Démarrage ---------------------------------------------------------------

started_at=${SECONDS}

# Keycloak et l'IHM du compose ne servent pas en e2e : on nomme les services.
echo "Démarrage de ${RDF_LABEL} et minio"
"${COMPOSE[@]}" up -d "${RDF_SERVICE}" minio minio-init
compose_at=${SECONDS}

wait_for "${RDF_LABEL}" "${RDF_READY_URL}" "${RDF_READY_CURL_OPTIONS[@]}"
rdf_at=${SECONDS}

echo "Chargement des jeux de données de test"
RDF_BACKEND="${RDF_BACKEND}" GRAPHDB_URL="${GRAPHDB_URL}" FUSEKI_URL="${FUSEKI_URL}" bash -c "cd '${BAUHAUS_HOME}/e2e' && ./playwright/db/init.sh"
fixtures_at=${SECONDS}

# Le back démarre après les fixtures : ses vérifications de démarrage et le
# contrôle « base de données » du healthcheck échouent tant que les dépôts RDF
# n'existent pas.
# --build : sans lui, compose réutilise l'image déjà construite, et la suite
# tourne sur un back périmé. Le cache Docker rend la reconstruction quasi
# gratuite tant que le code du Back-Office n'a pas changé.
echo "Démarrage du Back-Office"
"${COMPOSE[@]}" up -d --build api
wait_for "Back-Office" "${API_URL}/healthcheck"
healthcheck_at=${SECONDS}

# --- Chronométrage -----------------------------------------------------------

cat <<TIMINGS

Stack ${RDF_LABEL} prête en $((healthcheck_at - started_at)) s :
  base RDF et minio lancés  $((compose_at - started_at)) s
  base RDF joignable        $((rdf_at - compose_at)) s
  chargement des fixtures   $((fixtures_at - rdf_at)) s
  Back-Office joignable     $((healthcheck_at - fixtures_at)) s

Les tests peuvent partir :  pnpm --dir e2e test
TIMINGS
