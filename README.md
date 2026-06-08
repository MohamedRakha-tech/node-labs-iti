# ITI Day 2 - Social Media API

A robust RESTful API built with Node.js and Express, following the Controller-Service architecture. This project provides a secure and scalable foundation for a social media or blog application, featuring user authentication, post management, and advanced security protections.

## 🚀 Features

- **Authentication & Authorization**: Secure signup and login using JWT (JSON Web Tokens) and password hashing with `bcryptjs`.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for `user` and `admin` roles.
- **Post Management**: Full CRUD operations for posts with ownership verification.
- **User Management**: Comprehensive user profiles and administrative controls.
- **Input Validation**: Rigorous request body and parameter validation using `Joi` and `express-validator`.
- **Global Error Handling**: Centralized error management with custom `APIError` classes.
- **Security First**: 
    - **Helmet**: Secure HTTP headers.
    - **HPP**: Protection against HTTP Parameter Pollution.
    - **NoSQL Injection Protection**: Sanitization of user input.
    - **Rate Limiting**: Protection against Brute-force and DoS attacks.
    - **CORS**: Cross-Origin Resource Sharing enabled.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.x)
- **Database**: MongoDB with Mongoose (ODM)
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi, express-validator
- **Security**: Helmet, HPP, express-mongo-sanitize, express-rate-limit

## 📦 Key Packages

| Package | Description |
| :--- | :--- |
| `express` | Fast, unopinionated, minimalist web framework. |
| `mongoose` | Elegant MongoDB object modeling. |
| `jsonwebtoken` | JWT implementation for secure authentication. |
| `bcryptjs` | Optimized bcrypt in JavaScript for password hashing. |
| `joi` | Schema description language and data validator. |
| `express-validator` | Middleware for string validation and sanitization. |
| `helmet` | Helps secure Express apps by setting various HTTP headers. |
| `hpp` | Middleware to protect against HTTP Parameter Pollution. |
| `express-rate-limit` | Basic rate-limiting middleware for Express. |
| `dotenv` | Loads environment variables from a `.env` file. |
| `cors` | Middleware for enabling CORS. |

## 🏗️ Architecture

The project follows a modular **Controller-Service** pattern:
- **Models**: Mongoose schemas defining the data structure.
- **Services**: Contain the core business logic and database interactions.
- **Controllers**: Handle HTTP requests, call services, and return responses.
- **Routes**: Map endpoints to their respective controllers.
- **Middlewares**: Reusable logic for authentication, validation, and error handling.

## ⚙️ Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Day2
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and configure the following:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/iti-blog
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the application**:
    - Development mode (with nodemon):
      ```bash
      pnpm dev
      ```
    - Production mode:
      ```bash
      pnpm start
      ```

## 📜 API Documentation (Simplified)

### Auth
- `POST /auth/signup` - Register a new user.
- `POST /auth/login` - Authenticate a user and receive a token.

### Posts
- `GET /posts` - Retrieve all posts.
- `POST /posts` - Create a new post (Auth required).
- `GET /posts/:id` - Get post details.
- `PATCH /posts/:id` - Update a post (Ownership required).
- `DELETE /posts/:id` - Delete a post (Ownership/Admin required).

### Users
- `GET /users` - List all users (Admin required).
- `GET /users/:id` - Get user profile.
- `DELETE /users/:id` - Delete a user (Admin required).

---
*Developed as part of the ITI Node.js course.*
