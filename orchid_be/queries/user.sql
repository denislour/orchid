-- name: GetUserByID :one
SELECT id, name, email, password_hash, created_at, updated_at
FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT id, name, email, password_hash, created_at, updated_at
FROM users
WHERE email = $1 LIMIT 1;

-- name: GetAllUsers :many
SELECT id, name, email, password_hash, created_at, updated_at
FROM users
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: CreateUser :one
INSERT INTO users (name, email, password_hash, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, email, password_hash, created_at, updated_at;

-- name: UpdateUser :one
UPDATE users
SET name = $2, email = $3, password_hash = $4, updated_at = $5
WHERE id = $1
RETURNING id, name, email, password_hash, created_at, updated_at;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: CountUsers :one
SELECT COUNT(*) FROM users;
