# 🏪 Store Rating Platform - Backend API

A comprehensive RESTful API for a role-based store rating platform built with Express.js, Prisma, and PostgreSQL.

## 🛠️ Tech Stack

- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

### 3. Setup PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE store_rating_db;
```

### 4. Run Prisma Migrations

Generate Prisma client and run database migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will create all necessary tables in your database.

### 5. (Optional) Seed Database

To test the application with sample data, you can manually create an admin user using Prisma Studio:

```bash
npx prisma studio
```

Or insert directly via SQL:

```sql
INSERT INTO users (id, name, email, password, address, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'System Administrator Account',
  'admin@storerating.com',
  '$2a$10$...(hash of "Admin@123")',
  '123 Admin Street, City, State 12345',
  'ADMIN',
  NOW(),
  NOW()
);
```

### 6. Start the Server

**Development mode** (with nodemon hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # Prisma client configuration
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication
│   │   ├── role.middleware.js    # Role-based authorization
│   │   ├── validation.middleware.js # Request validation
│   │   └── error.middleware.js   # Global error handler
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication endpoints
│   │   ├── admin.controller.js   # Admin operations
│   │   ├── user.controller.js    # User operations
│   │   └── store.controller.js   # Store owner operations
│   ├── services/
│   │   ├── auth.service.js       # Authentication business logic
│   │   ├── user.service.js       # User management logic
│   │   ├── store.service.js      # Store management logic
│   │   └── rating.service.js     # Rating management logic
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth routes
│   │   ├── admin.routes.js       # /api/admin routes
│   │   ├── user.routes.js        # /api/user routes
│   │   └── store.routes.js       # /api/store routes
│   ├── utils/
│   │   ├── jwt.util.js           # JWT utilities
│   │   ├── password.util.js      # Password hashing utilities
│   │   └── validators.js         # Validation schemas
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration files
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | User registration |
| POST | `/login` | Public | User login |
| PUT | `/password` | Protected | Update password |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Admin Only | Dashboard statistics |
| GET | `/stores` | Admin Only | List all stores |
| POST | `/stores` | Admin Only | Add new store with owner |
| GET | `/users` | Admin Only | List all users |
| POST | `/users` | Admin Only | Add new user/admin |
| GET | `/users/:id` | Admin Only | Get user details |

### User Routes (`/api/user`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/stores` | User Only | List all stores |
| POST | `/ratings` | User Only | Submit a rating |
| PUT | `/ratings/:id` | User Only | Update a rating |
| GET | `/ratings/my` | User Only | Get user's ratings |

### Store Owner Routes (`/api/store`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Store Owner Only | Store dashboard |
| GET | `/ratings` | Store Owner Only | Store's ratings |

## 📝 Sample API Requests

### 1. User Signup

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Anderson Smith",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "address": "123 Main Street, Springfield, IL 62701"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Anderson Smith",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "jwt_token_here"
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

### 3. Submit Rating (Protected)

```bash
POST /api/user/ratings
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeId": "store-uuid",
  "rating": 5
}
```

### 4. Get Admin Dashboard (Admin Only)

```bash
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStores": 45,
    "totalRatings": 892
  }
}
```

## ✅ Form Validation Rules

All endpoints enforce the following validation rules:

- **Name**: 20-60 characters, letters and spaces only
- **Email**: Valid email format
- **Password**: 8-16 characters, at least 1 uppercase letter, at least 1 special character
- **Address**: Maximum 400 characters
- **Rating**: Integer between 1 and 5

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control (ADMIN, USER, STORE_OWNER)
- Protected routes with middleware chain
- Input validation on all endpoints
- CORS configuration
- SQL injection protection via Prisma ORM

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

Status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate entries)
- `500`: Internal Server Error

## 🧪 Testing

You can test the API using:

- **Postman**: Import the endpoints and test manually
- **cURL**: Use the sample requests above
- **Frontend**: Use the React frontend in the `frontend` directory

## 📊 Database Schema

### Users Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `address` (VARCHAR)
- `role` (ENUM: ADMIN, USER, STORE_OWNER)
- `store_id` (UUID, FK, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

### Stores Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `address` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Ratings Table
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `store_id` (UUID, FK)
- `rating` (INTEGER, 1-5)
- `created_at`, `updated_at` (TIMESTAMP)
- **UNIQUE**: (user_id, store_id)

## 🛡️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 📝 Additional Notes

- The first admin user must be created manually via database or Prisma Studio
- Store owners are automatically created when an admin adds a new store
- Each user can rate each store only once (enforced by unique constraint)
- Average ratings are calculated dynamically
- All timestamps are in UTC

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure production database URL
4. Set up SSL/TLS for database connection
5. Use a process manager like PM2
6. Enable database connection pooling
7. Set up proper logging and monitoring

## 📞 Support

For issues or questions, please refer to the main project README or contact the development team.

---

**Happy Coding! 🎉**
