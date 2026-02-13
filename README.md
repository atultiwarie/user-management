# User Management API

REST API built using Node.js, Express, and MongoDB with JWT authentication (stored in HTTP-only cookie).

## Setup

1. Install dependencies

npm install


2. Create `.env` file in root folder and add:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


3. Start the server

npm run dev
Server runs at: http://localhost:3000


## API Testing

Import the provided Postman collection.

Run **Register User API first** to create authentication token (cookie).  
After that, you can test all other protected APIs.

## Tech Stack

Node.js, Express.js, MongoDB, JWT



