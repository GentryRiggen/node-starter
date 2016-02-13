CREATE TABLE user
(
  id         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(64),
  last_name  VARCHAR(64),
  email      VARCHAR(128),
  username   VARCHAR(64)     NOT NULL,
  password   VARCHAR(256)    NOT NULL
);
ALTER TABLE user ADD CONSTRAINT unique_id UNIQUE (id);
ALTER TABLE user ADD CONSTRAINT unique_username UNIQUE (username);

INSERT INTO user SET
  first_name = 'Admin',
  last_name = 'Admin',
  email = 'admin@admin.com',
  username = 'admin',
  password = '$2a$10$FCx8lSrnUcdFymhayIgshujZAmPkpjOwxsfM7GfNTBNEH3MZ8MHFa';
