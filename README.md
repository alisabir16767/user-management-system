User Management API

A simple User Management System built with Node.js, Express, and MongoDB, featuring JWT authentication and a minimal frontend for testing API functionality.

🚀 Features

User Signup – Create an account with name, email, and password (hashed).

User Login – Authenticate with email & password, receive a JWT token.

Profile (Protected) – Fetch logged-in user details.

Update Profile (Protected) – Update name or password (with re-hash).

Delete User (Protected) – Remove logged-in user account.

Minimal Frontend – Simple forms for signup, login, profile management.

🛠 Tech Stack

Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: JWT (JSON Web Token), bcrypt

Frontend: React (or HTML + JavaScript) for testing APIs

📂 Project Structure
.
├── backend
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── controllers/   # Business logic
│   ├── middleware/    # JWT auth middleware
│   ├── server.js      # Entry point
│   └── .env           # Environment variables
│
├── frontend
│   ├── public/        # Static assets
│   ├── src/           # React components / JS files
│   └── package.json   # Frontend dependencies
│
└── README.md

⚙️ Setup Instructions
1. Clone Repository
git clone https://github.com/your-username/user-management-api.git
cd user-management-api

2. Backend Setup
cd backend
npm install


Create a .env file inside backend/ with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run the backend:

npm start

3. Frontend Setup
cd frontend
npm install
npm start

🔑 API Endpoints
1. Signup

POST /signup

Request:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}


Response (success):

{ "message": "User created successfully" }

2. Login

POST /login

Request:

{
  "email": "john@example.com",
  "password": "mypassword"
}


Response (success):

{
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}

3. Get Profile (Protected)

GET /profile

Headers:

Authorization: Bearer <JWT_TOKEN>


Response:

{
  "name": "John Doe",
  "email": "john@example.com"
}

4. Update Profile (Protected)

PUT /profile

Request (example):

{
  "name": "Updated Name",
  "password": "newpassword"
}


Response:

{ "message": "User updated successfully" }

5. Delete Profile (Protected)

DELETE /profile

Response:

{ "message": "User deleted successfully" }

🎯 Bonus Features (Optional)

Pagination in user listing → GET /users?page=1&limit=5

Role-based access control (admin vs. user)

📝 Evaluation Criteria

✅ Secure password hashing (bcrypt)

✅ JWT authentication & middleware

✅ CRUD operations on user profile

✅ Minimal but functional frontend

✅ Clear project documentation
