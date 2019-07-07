#!/bin/bash
set -ex

echo "Entrypoint"

# the official postgres image uses 'postgres' as default user if not set explictly.
# if [ -z "$POSTGRES_USER" ]; then
#     export POSTGRES_USER=postgres
# fi

function postgres_ready(){
node << END
var postgres = require("pg");
var client = new postgres.Client({
  host: '$DB_CONTAINER_NAME',
  port: $POSTGRES_PORT,
  user: '$POSTGRES_USER',
  password: '$POSTGRES_PASSWORD',
  database: '$POSTGRES_DB',
});
client.connect(function(err) {
  if (err) {
    console.log('connection failed');
    console.error(err);
    process.exit(1);
  }
  console.log('connection successful');
  process.exit(0);
});
END
}

until postgres_ready; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - continuing..."

# Execute next Command
exec "$@"

# ./start.sh
