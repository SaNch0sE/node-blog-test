CREATE TABLE `users` (
  `id` int UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(30) NOT NULL,
  `login` varchar(20) UNIQUE NOT NULL,
  `password` varchar(30) NOT NULL
);

CREATE TABLE `articles` (
  `id` int UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(50) UNIQUE NOT NULL,
  `content` varchar(10000) NOT NULL,
  `likes` int NOT NULL DEFAULT 0,
  `created_at` timestamp
);

CREATE TABLE `comments` (
  `id` int UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `article_id` int NOT NULL,
  `user_id` int NOT NULL,
  `text` varchar(300) NOT NULL,
  `created_at` timestamp NOT NULL
);

ALTER TABLE `articles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`);
