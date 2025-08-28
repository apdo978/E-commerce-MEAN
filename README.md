# E-Commerce Backend Documentation

## Overview
This is a Node.js-based e-commerce backend application that provides RESTful APIs for the frontend application. It handles user authentication, product management, and order processing.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing
- Mongoose ODM

## Project Structure
```
Back-End E-Commerce/
├── Mvc/                    # MVC structure
│   ├── Controllers/       # Route controllers
│   ├── Models/           # Database models
│   ├── Routes/           # API routes
│   └── Middleware/       # Custom middleware
├── config/               # Configuration files
├── utils/               # Utility functions
└── app.js              # Application entry point
```

## API Endpoints

### Authentication
```
POST /Users/login
POST /Users/InsertUserS
```

### Products
```
GET /products
GET /products/:id
GET /products/category/:category
POST /products
PATCH /products/:id
DELETE /products/:id
```

### Cart
```
GET /cart
POST /cart
PUT /cart/:id
DELETE /cart/:id
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  userType: {
    _id: String,
    name: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number
  },
  qunt: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm (v6 or higher)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd Back-End-E-Commerce
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
```

4. Start the server
```bash
npm start
```

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for common functionality

### Security
- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Rate limiting
- Helmet for security headers

### Error Handling
- Global error handler
- Custom error classes
- Proper HTTP status codes
- Error logging

### Testing
- Unit tests with Jest
- API tests with Supertest
- Integration tests
- Mock database for testing

## API Documentation

### Authentication

#### Login
```http
POST /Users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /Users/InsertUserS
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Products

#### Get All Products
```http
GET /products
```

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "title": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "category": "Category",
  "image": "image_url",
  "qunt": 10
}
```

## Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Set up PM2 or similar process manager
4. Configure reverse proxy (Nginx/Apache)
5. Set up SSL certificates

## Monitoring
- Error logging
- Performance monitoring
- Database monitoring
- API usage tracking

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
