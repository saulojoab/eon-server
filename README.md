# <samp>EON Server</samp>

<samp>EON Server is a backend API for the EON manga reading application. It provides endpoints for user management, manga tracking, analytics, and more. The server integrates with external manga providers using the [Consumet API](https://github.com/consumet/consumet.ts).</samp>

## <samp>Features</samp>

- <samp>**User Management**: Create, update, delete, and authenticate users.</samp>
- <samp>**Manga Integration**: Search for manga, fetch manga details, and retrieve chapters using external providers with the Consumet library.</samp>
- <samp>**User-Manga Interactions**: Track user-specific manga data, such as favorites and currently reading lists.</samp>
- <samp>**Analytics**: Track manga views and retrieve trending manga data.</samp>
- <samp>**RESTful API**: Built with Fastify for high performance.</samp>
- <samp>**MongoDB Integration**: Persistent storage for users, manga, and analytics.</samp>

## <samp>Table of Contents</samp>

- <samp>[Installation](#installation)</samp>
- <samp>[Environment Variables](#environment-variables)</samp>
- <samp>[Usage](#usage)</samp>
- <samp>[Contributing](#contributing)</samp>
- <samp>[License](#license)</samp>

## <samp>Installation</samp>

<samp>1. Clone the repository:</samp>

```bash
git clone https://github.com/saulojoab/eon-server.git
cd eon-server
```

<samp>2. Install dependencies:</samp>

```bash
yarn
```

<samp>3. Set up your .env file (see Environment Variables).</samp>

## <samp>Environment Variables</samp>

<samp>Create a .env file in the root directory with the following variables:</samp>

```
PORT=3000
CONNECTION_URL=mongodb://localhost:27017/eon // replace this with your MongoDB connection URL
NODE_ENV=development
```

## <samp>Usage</samp>

<samp>Run the project with Nodemon for hot reloading:</samp>

```bash
yarn dev
```

## <samp>Contributing</samp>

<samp>Contributions are welcome! Please follow these steps:</samp>

- <samp>Fork the repository.</samp>
- <samp>Create a new branch for your feature or bugfix.</samp>
- <samp>Commit your changes and push them to your fork.</samp>
- <samp>Submit a pull request.</samp>

## <samp>License</samp>

<samp>This project is licensed under the [GPLv3](https://github.com/saulojoab/eon-server/blob/master/LICENSE) license.</samp>
