-- @name selectUsersByNameOrAge
-- @param {value} userAge
-- @param {array} userNames
SELECT * FROM users where user_age = $userAge or user_name in $userNames;

-- @name insertComments
INSERT INTO users (name, age) VALUES $users RETURNING id


/**
Notes
Increase adoption:
* SQL file first, SQL-in-TS second on road to deprecated
* Focus on writing simpler queries as efficient and easy as possible
** Heuristics for param inference
** CLI tool/plugin that generates SQL files for you (user can customize later)
**/
