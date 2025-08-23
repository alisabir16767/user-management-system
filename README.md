

# User Management API

A simple **User Management System** built with **Node.js, Express, and MongoDB**, featuring JWT authentication and a minimal frontend for testing API functionality.

---

## 🚀 Features

* **User Signup** – Create an account with name, email, and password (hashed).
* **User Login** – Authenticate with email & password, receive a JWT token.
* **Profile (Protected)** – Fetch logged-in user details.
* **Update Profile (Protected)** – Update name or password (with re-hash).
* **Delete User (Protected)** – Remove logged-in user account.
* **Minimal Frontend** – Simple forms for signup, login, profile management.

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Token), bcrypt
* **Frontend:** Next.js for testing APIs

---

## 📂 Project Structure

```
.
├── backend
│   ├── models/        
│   ├── routes/        
│   ├── controllers/   
│   ├── middleware/    
│   ├── server.js      
│   └── .env          
│
├── frontend
│   ├── public/        
│   ├── src/           
│   └── package.json  
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/user-management-api.git
cd user-management-api
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_CODE=supersecretadmincode
```

Run the backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔑 API Endpoints

### 1. **Signup**

`POST /signup`

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}
```

Response (success):

```json
{ "message": "User created successfully" }
```

---

### 2. **Login**

`POST /login`

Request:

```json
{
  "email": "john@example.com",
  "password": "mypassword"
}
```

Response (success):

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

---

### 3. **Get Profile (Protected)**

`GET /profile`

Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

Response:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 4. **Update Profile (Protected)**

`PUT /profile`

Request (example):

```json
{
  "name": "Updated Name",
  "password": "newpassword"
}
```

Response:

```json
{ "message": "User updated successfully" }
```

---

### 5. **Delete Profile (Protected)**

`DELETE /profile`

Response:

```json
{ "message": "User deleted successfully" }
```

---

## 🎯 Bonus Features (Optional)

* Pagination in user listing → `GET /users?page=1&limit=5`
* Role-based access control (admin vs. user)

---

## 📝 Evaluation Criteria

* ✅ Secure password hashing (bcrypt)
* ✅ JWT authentication & middleware
* ✅ CRUD operations on user profile
* ✅ Minimal but functional frontend
* ✅ Clear project documentation
