#!/usr/bin/env bash
#
# Monte la stack complète attendue par les tests de bout en bout, en une
# commande : GraphDB + minio (et ses fichiers de test), charge les jeux de
# données de test, puis démarre le Back-Office (construit depuis le dépôt
# voisin). La stack est celle de docker-compose.yml, surchargée par
# e2e/compose.e2e.yaml (back sans Keycloak).
#
# À lancer depuis la racine de `Bauhaus/` :
#     pnpm e2e:stack
#
# L'IHM n'est PAS démarrée ici : Playwright s'en charge (`webServer` de
# playwright.config.ts). Une fois ce script sorti en 0 :
#     pnpm --dir e2e test
#
# ⚠️  Destructif sur les données : `init.sh` recrée les dépôts `bauhaus` et
#     `publication`. Voir son en-tête.
#
# Variables :
#   BACK_OFFICE_HOME  racine du dépôt Bauhaus-Back-Office
#                     (défaut ../Bauhaus-Back-Office, soit le dépôt cloné à
#                     côté de Bauhaus)
#   GRAPHDB_URL       défaut http://localhost:7200
#   API_URL           défaut http://localhost:8080/api
#   STACK_TIMEOUT     secondes d'attente par service (défaut 600 : le premier
#                     lancement construit toute l'image du Back-Office)
set -euo pipefail

BAUHAUS_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACK_OFFICE_HOME="${BACK_OFFICE_HOME:-${BAUHAUS_HOME}/../Bauhaus-Back-Office}"
GRAPHDB_URL="${GRAPHDB_URL:-http://localhost:7200}"
API_URL="${API_URL:-http://localhost:8080/api}"
STACK_TIMEOUT="${STACK_TIMEOUT:-600}"

COMPOSE=(docker compose -f "${BAUHAUS_HOME}/docker-compose.yml" -f "${BAUHAUS_HOME}/e2e/compose.e2e.yaml")

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
	local label="$1" url="$2" started elapsed
	started=${SECONDS}
	echo "Attente de ${label} (${url})…"
	until curl -sf -o /dev/null "${url}"; do
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
echo "Démarrage de GraphDB et minio"
"${COMPOSE[@]}" up -d graphdb minio minio-init
compose_at=${SECONDS}

wait_for "GraphDB" "${GRAPHDB_URL}/rest/repositories"
graphdb_at=${SECONDS}

echo "Chargement des jeux de données de test"
GRAPHDB_URL="${GRAPHDB_URL}" bash -c "cd '${BAUHAUS_HOME}/e2e' && ./playwright/db/init.sh"
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

Stack prête en $((healthcheck_at - started_at)) s :
  GraphDB et minio lancés   $((compose_at - started_at)) s
  GraphDB joignable         $((graphdb_at - compose_at)) s
  chargement des fixtures   $((fixtures_at - graphdb_at)) s
  Back-Office joignable     $((healthcheck_at - fixtures_at)) s

Les tests peuvent partir :  pnpm --dir e2e test
TIMINGS
