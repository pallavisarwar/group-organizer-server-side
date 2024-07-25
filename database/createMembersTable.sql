CREATE TABLE Members (
MemberId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
NickName varchar(100) UNIQUE,
Bio varchar(500),
AvatarURL varchar(200),
Age int,
GroupId INTEGER,
FOREIGN KEY (GroupId) REFERENCES Groups (GroupId)
)