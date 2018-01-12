INSERT INTO users
(google_id)
values
($1)
returning *;