# eon-server

Server API for handling EON user shenanigans

# ROUTES

I'll create a proper API documentation in the future. Currently, these are the routes available on the API.

## Users

<details>

<summary>See user routes</summary>

### Get all users

- Endpoint: `/users/`
- Method: `GET`
- Description: Retrieves all users from the database.
- Response:
  - Status Code: 200 (OK)
  - Body: Array of user objects

---

### Create a user

- Endpoint: `/users/`
- Method: `POST`
- Description: Creates a new user in the database.
- Request Body: `{ username: string, email: string, password: string, profilePicture: string }`
- Response:
  - Status Code: 201 (Created)
  - Body: Created user object (password excluded)
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Find a user by ID

- Endpoint: `/users/:id`
- Method: `GET`
- Description: Finds a user by ID.
- Parameters:
  - `id`: The ID of the user.
- Response:
  - Status Code: 200 (OK)
  - Body: Found user object (password excluded)
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`

---

### Update a user

- Endpoint: `/users/:id`
- Method: `PUT`
- Description: Updates a user by ID.
- Parameters:
  - `id`: The ID of the user.
- Request Body: `{ username?: string, email?: string, profilePicture?: string }`
- Response:
  - Status Code: 200 (OK)
  - Body: Updated user object (password excluded)
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Delete a user

- Endpoint: `/users/:id`
- Method: `DELETE`
- Description: Deletes a user by ID.
- Parameters:
  - `id`: The ID of the user.
- Response:
  - Status Code: 204 (No Content)
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Add a manga to user favorites

- Endpoint: `/users/favorites/:user_id/:manga_id`
- Method: `POST`
- Description: Adds a manga to the favorites of a user.
- Parameters:
  - `user_id`: The ID of the user.
  - `manga_id`: The ID of the manga.
- Response:
  - Status Code: 200 (OK)
  - Body: Updated user object (password excluded)
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Manga already in favorites" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### User Login

- Endpoint: `/users/login`
- Method: `POST`
- Description: Authenticates a user by email and password.
- Request Body: `{ email: string, password: string }`
- Response:
  - Status Code: 200 (OK)
  - Body: Authenticated user object (password excluded)
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Invalid password" }`

---

### Get user favorite mangas

- Endpoint: `/users/favorites/:user_id`
- Method: `GET`
- Description: Retrieves the favorite mangas of a user.
- Parameters:
  - `user_id`: The ID of the user.
- Response:
  - Status Code: 200 (OK)
  - Body: Array of manga objects
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "User not found" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

</details>

</br>

## Manga

<details>

<summary>See manga routes</summary>

### Get all mangas

- Endpoint: `/manga/`
- Method: `GET`
- Description: Retrieves all mangas registered in the database.
- Response:
  - Status Code: 200 (OK)
  - Body: Array of manga objects

---

### Get all views from a manga

- Endpoint: `/manga/views/:id`
- Method: `GET`
- Description: Retrieves all views from a specific manga.
- Parameters:
  - `id`: The ID of the manga.
- Response:
  - Status Code: 200 (OK)
  - Body: Number of views for the manga
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Manga not found" }`

---

### Add a manga

- Endpoint: `/manga/`
- Method: `POST`
- Description: Adds a manga to the database.
- Request Body: `{ title: string, author: string, description: string, genre: string[], coverImage: string }`
- Response:
  - Status Code: 201 (Created)
  - Body: Created manga object
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Find a specific manga by ID

- Endpoint: `/manga/:id`
- Method: `GET`
- Description: Finds a specific manga by ID.
- Parameters:
  - `id`: The ID of the manga.
- Response:
  - Status Code: 200 (OK)
  - Body: Found manga object
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Manga not found" }`

---

### Delete a manga

- Endpoint: `/manga/:id`
- Method: `DELETE`
- Description: Deletes a manga from the database.
- Parameters:
  - `id`: The ID of the manga.
- Response:
  - Status Code: 200 (OK)
  - Body: Deleted manga object
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Manga not found" }`

---

### Add a manga to the currently reading list of the user

- Endpoint: `/manga/currently-reading/`
- Method: `POST`
- Description: Adds a manga to the currently reading list of the user.
- Request Body: `{ user_id: string, manga_id: string, progress: number }`
- Response:
  - Status Code: 201 (Created)
  - Body: Created CurrentlyReading object
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Removes a manga from the currently reading list of the user

- Endpoint: `/manga/currently-reading/:user_id/:manga_id`
- Method: `DELETE`
- Description: Removes a manga from the currently reading list of the user.
- Parameters:
  - `user_id`: Id of the user.
  - `manga_id`: Id of the manga to be removed.
- Response:
  - Status Code: 200 (OK)
  - Body: Update CurrentlyReading object
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Currently reading not found", }`

---

### Update the currently reading manga of the user

- Endpoint: `/manga/currently-reading/:user_id/:manga_id`
- Method: `PUT`
- Description: Updates the currently reading manga of the user.
- Parameters:
  - `user_id`: The ID of the user.
  - `manga_id`: The ID of the manga.
- Request Body: `{ progress: number }`
- Response:
  - Status Code: 201 (Created)
  - Body: Updated CurrentlyReading object
- Error Responses:
  - Status Code: 400 (Bad Request)
  - Body: `{ "message": "Missing required fields" }`
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Currently reading not found" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Get the currently reading manga list of the user

- Endpoint: `/manga/currently-reading/:user_id`
- Method: `GET`
- Description: Retrieves the currently reading manga list of the user.
- Parameters:
  - `user_id`: The ID of the user.
- Response:
  - Status Code: 200 (OK)
  - Body: Array of CurrentlyReading objects
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Currently reading not found" }`

---

### Add a view to the manga

- Endpoint: `/manga/view/:id`
- Method: `PUT`
- Description: Adds a view to the manga.
- Parameters:
  - `id`: The ID of the manga.
- Response:
  - Status Code: 200 (OK)
  - Body: Updated manga object
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "Manga not found" }`
  - Status Code: 500 (Internal Server Error)
  - Body: `{ "message": "Something went wrong" }`

---

### Get the most viewed manga of the day

- Endpoint: `/manga/trending-today`
- Method: `GET`
- Description: Retrieves the most viewed manga of the day.
- Response:
  - Status Code: 200 (OK)
  - Body: Most viewed manga object
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "No mangas had any views today" }`

---

### Get the 10 most viewed mangas

- Endpoint: `/manga/trending`
- Method: `GET`
- Description: Retrieves the 10 most viewed mangas.
- Response:
  - Status Code: 200 (OK)
  - Body: Array of manga objects
- Error Responses:
  - Status Code: 404 (Not Found)
  - Body: `{ "message": "No mangas found" }`

</details>
