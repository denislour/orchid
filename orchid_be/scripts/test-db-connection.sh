#!/bin/bash
set -e

echo "Testing database connection..."

echo "Waiting for backend to be healthy..."
until curl -f http://localhost:8080/health > /dev/null 2>&1; do
    echo "Backend is not ready yet - sleeping"
    sleep 2
done

echo "Backend is healthy!"

echo "Testing database connection through API..."

if curl -f http://localhost:8080/api/users > /dev/null 2>&1; then
    echo "✅ Database connection test passed!"
    echo "✅ Backend is successfully connected to PostgreSQL!"
else
    echo "❌ Database connection test failed!"
    exit 1
fi

echo "All tests completed successfully!"
