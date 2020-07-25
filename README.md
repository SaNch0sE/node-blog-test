## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Features required on first presentation:<br>
Authorization:<br>
		- User registration (email, name, password)
		- User password update
		- User login
Blog engine:<br>
		- Post (Should have title, body, likes and comments, creation time)
		- Comments (Should belong to post and are tied to users. Can have body and likes)
		- Create post 
		- Update post (Update title and body)
		- Like post (Post liking should not make page reload)
Blog view engine:<br>
		- Display list of posts from latest to oldest with pagination of 25 posts per screen (Displayed in list posts should have full title, creation time, author name, excerpt of body up to 70 characters, like count, like button and button to go to full post)
		- List of posts should be able to be filtered by: creation time (latest -> oldest, latest <- oldest, like count (higher -> lower),    specific author)
		- Display single post (Show full post info: title, author name, creation time (as a link on which you can press and go to list of posts created by this author), full body, likes, all comments with their authors)
DB:<br>
		- Seeds

Advanced tasks (Not required on initial presentation):<br>
- Use wysiwyg for post creation
- Flash messages
- Unit tests
- Caching
- Admin role
- JSON API
- Live comment section for posts

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

  Nest is [MIT licensed](LICENSE).
