# Social API

A full-featured REST API built with Node.js and Express for a social media/blog platform. Features real-time chat, dual payment gateway support, role-based access control, and social interactions.

## Features

- **Authentication & Authorization**: Secure signup, login, and password reset using JWT. Role-based access for `user` and `admin`.
- **Cooking Photos (Posts)**: Create, read, update, and delete blog posts.
- **Social Interactions**: Like, follow, and comment on posts. Real-time chat system using WebSockets.
- **Dual Payments**: Supports both Stripe and Kashier payment gateways with secure webhooks.
- **Admin Controls**: Manage users, posts, and view all platform donations.

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (v5.x)
- **Database**: MongoDB with Mongoose (ODM)
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi
- **Real-time Communication**: Socket.io
- **Payments**: Stripe, Kashier
- **Testing**: Jest, Supertest, mongodb-memory-server

## Prerequisites

- Node.js 20.x or higher
- MongoDB (local or remote)
- pnpm (or npm / yarn)

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Day2
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory. See `.env.example` for the required variables.

4.  **Start the server**:
    - Development mode (with nodemon):
      ```bash
      pnpm dev
      ```
    - Production mode:
      ```bash
      pnpm start
      ```

## Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB - Connection string for your database
MONGODB_URI=mongodb://localhost:27017/your-db-name

# JWT - Generate a strong secret using: openssl rand -hex 32
JWT_SECRET=your-secret-key

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Kashier Payment Gateway
PAYMENT_GATEWAY_KEY=your-kashier-api-key
PAYMENT_GATEWAY_SECRET=your-kashier-secret-key
KASHIER_MERCHANT_ID=your xxxx
KASHIER_WEBHOOK_URL=https://your-ngrok-url.ngrok-free.app/donations/webhook

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_x'xxxxx
```

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | — | Register a new user |
| `POST` | `/auth/login` | — | Authenticate a user and receive a token |
| `POST` | `/auth/forgot-password` | — | Request password reset link |
| `POST` | `/auth/reset-password/:token` | — | Reset password  |
| `GET` | `/auth/csrf-token` | — | Get a new CSRF token |

### Posts

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Yes | Retrieve all posts |
| `GET` | `/posts/:id` | — | Get post details |
| `POST` | `/posts` | Yes | Create a new post |
| `PUT` | `/posts/:id` | Yes | Update a post |
| `DELETE` | `/posts/:id` | Yes | Delete a post |
| `POST` | `/posts/:id/like` | Yes | Toggle like on a post |

### Comments

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts/:postId/comments` | — | Retrieve all comments on a post |
| `POST` | `/posts/:postId/comments` | Yes | Add a comment to a post |
| `DELETE` | `/comments/:commentId` | Yes | Delete a comment |

### Users

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Admin | List all users |
| `GET` | `/users/:userId` | Admin | Get user profile |
| `POST` | `/users` | Admin | Create a user |
| `PUT` | `/users/:userId` | Admin | Update a user |
| `DELETE` | `/users/:userId` | Admin | Delete a user |
| `POST` | `/users/:userId/follow` | Yes | Toggle follow status |

### Chat

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/chats` | Yes | Get all user's chats |
| `GET` | `/chats/:userId` | Yes | Get or create a chat |
| `GET` | `/chats/:chatId/messages` | Yes | Get messages in a chat |
| `PATCH` | `/chats/:chatId/read` | Yes | Mark messages as read |

### Donations

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/donations` | Yes | Create a donation (Kashier) |
| `POST` | `/donations/webhook` | — | Kashier webhook |
| `GET` | `/donations` | Yes | List user's donations |
| `GET` | `/donations/all` | Admin | List all donations |
| `POST` | `/donations/stripe/create-payment-intent` | Yes | Create a Stripe payment |
| `POST` | `/donations/stripe/webhook` | — | Stripe webhook |

### WebSocket Events

All socket.io events for the real-time chat feature are listed here:

| Event | Direction | Description |
| :--- | :--- | :--- |
| `chat:send` | Client -> Server | Send a message in a chat |
| `chat:message` | Server -> Client | New message broadcast |
| `chat:typing` | Bidirectional | Typing indicator |
| `chat:read` | Client -> Server | Mark messages as read |

## Testing

The project includes a suite of tests to  codebase quality  :

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch
```

## Project Structure

```
│  1.  app.js              # Application entry point
│  2.  controllers/        # HTTP request handlers
│  3.  services/            # Business logic and database interactions
│  4.  models/              # Mongoose schemas
│  5.  routes/               # API route definitions
│  6.  middlewares/          # Custom express middleware
│  7.  validators/           # Joi validation schemas
│  8.  utils/                # Utility functions
│  9.  tests/                # Test suite
└─10.  public/               # Static files
```

## Architecture

This project follows the `Controller-Service` pattern for a clean separation of concerns:

- ** promise and **Middlewares** provide robust security.

## Contributing

Contributions , bug reports , and feature requests are welcome ! For major changes, please open an issue first to discuss what you would like to change .

## License

[ISC]
