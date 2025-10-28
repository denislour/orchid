#!/bin/bash
set -e

wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until pg_isready -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER"; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    echo "PostgreSQL is up - executing command"
}

wait_for_postgres

DB_EXISTS=$(psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -lqt | cut -d \| -f 1 | grep -w "$DATABASE_NAME" | wc -l)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "Database $DATABASE_NAME does not exist. Creating..."
    createdb -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" "$DATABASE_NAME"
    echo "Database $DATABASE_NAME created successfully."
else
    echo "Database $DATABASE_NAME already exists."
fi

echo "PostgreSQL initialization completed."
