-- Active: 1680407470978@@127.0.0.1@3306

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME('now', 'localtime'))
    );

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE
    posts(
        id TEXT NOT NULL UNIQUE,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        comments_count INTEGER DEFAULT (0),
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()),
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

SELECT * FROM posts;

DROP TABLE posts;

CREATE TABLE
    likesDislikes(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        has_like INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    drop TABLE "likesDislikes";

SELECT * FROM comments;

DROP TABLE comments;

CREATE TABLE
    comments(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        post_id TEXT NOT NULL,
         FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

DROP TABLE likes_dislikes_comment;
CREATE TABLE
    likes_dislikes_comment(
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        has_like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE
 
    );
SELECT *
FROM "likes_dislikes_comment";

DROP TABLE "likesDislikes";

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "u001",
        "Caio",
        "caio1801@gmail.com",
        "marleylindo20",
        "admin"
    ), (
        "u002",
        "Marley",
        "cachorro@hotmail.com",
        "biscoito123",
        "normal"
    );

INSERT INTO
    posts(
        id,
        creator_id,
        content,
        likes,
        dislikes
    )
VAlUES (
        "p001",
        "u001",
        "Tenho o cachorro mais lindo do mundo",
        2210,
        0
    ), (
        "p002",
        "u001",
        "Esporte Clube Vitoria",
        1,
        49254
    ), ("p003", "u002", "Auu", 942, 339);

INSERT INTO
    "likesDislikes"(user_id, post_id, has_like)
VALUES ("u001", "p002", 1), ("u001", "p001", 1), ("u002", "p001", 0);

INSERT INTO comments (id, post_id, creator_id, content)
VALUES
    ("c001", "p001", "u001", "Indo viajar agora!"),
    ("c002", "p001", "u002", "Au auuuuuu");

INSERT INTO likes_dislikes_comment (user_id, comment_id, has_like)
VALUES ("u002", "c001",  1),
        ("u001", "c002",  0);

SELECT
    posts.id AS post_id,
    posts.likes,
    posts.dislikes,
    comments.content,
    comments.id AS comment_id,
    comments.creator_id,
    users.name AS creator_name,
    likes_dislikes_comment.has_like
FROM posts
    INNER JOIN comments ON posts.id = comments.post_id
    INNER JOIN users ON comments.creator_id = users.id
    INNER JOIN likes_dislikes_comment ON comments.id = likes_dislikes_comment.comment_id;

    