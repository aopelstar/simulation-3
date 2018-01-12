create table if not exists users (
id serial primary key,
google_id varchar(40),
firstName varchar(15),
lastName varchar(15),
hairColor varchar(10),
eyeColor varchar(10),
hobby text,
age integer
)