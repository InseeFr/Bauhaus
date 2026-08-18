#!/usr/bin/env bash
#
# (Re)crée les dépôts GraphDB `bauhaus` et `publication` et y charge les jeux
# de données de test du Back-Office.
#
# ⚠️  Destructif : les deux dépôts sont supprimés avant rechargement.
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

if [ ! -d "${FIXTURES}" ]; then
	echo "Jeux de données introuvables : ${FIXTURES}" >&2
	echo "Renseigner BACK_OFFICE_HOME vers la racine de Bauhaus-Back-Office." >&2
	exit 1
fi

curl -sf -X DELETE "${GRAPHDB_URL}/rest/repositories/bauhaus" || true
curl -sf -X DELETE "${GRAPHDB_URL}/rest/repositories/publication" || true

curl -sf -X POST "${GRAPHDB_URL}/rest/repositories" \
	-H 'Content-Type: multipart/form-data' \
	-F 'config=@./playwright/db/config.ttl'
curl -sf -X POST "${GRAPHDB_URL}/rest/repositories" \
	-H 'Content-Type: multipart/form-data' \
	-F 'config=@./playwright/db/config-diffusion.ttl'

for fixture in \
	all-operations-and-indicators \
	sims-all \
	sims-metadata \
	sims-codes \
	documents \
	organizations \
	jeuxDeDonnees-pour-tests \
	themes-jeu-de-donnees-dev; do
	echo "Chargement de ${fixture}.trig"
	curl -sf -X POST "${GRAPHDB_URL}/repositories/bauhaus/statements" \
		-H "Content-Type: application/trig" \
		--data-binary "@${FIXTURES}/${fixture}.trig"
done
