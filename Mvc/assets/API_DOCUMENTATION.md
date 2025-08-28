# E-commerce MEAN Stack API Documentation

## Overview

This is a comprehensive RESTful API built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) for e-commerce applications. The API provides functionality for user management, product management, shopping cart operations, order processing, and file uploads including user avatars.

## Base URL

```
https://[your-domain]/api/v1
```

For local development:
```
http://localhost:3000/api/v1
```

## Authentication

### Authentication Methods

The API supports two authentication methods:

1. **JWT Token Authentication**
   - Used for regular email/password login
   - Tokens must be included in the `Authorization` header as `Bearer [token]`

2. **OAuth Authentication (Google)**
   - Login with Google account
   - Redirects to Google and returns with user data

### Login Endpoints

#### Email/Password Login

**POST** `/users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "status": "success1",
  "data": {
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // JWT token
  }
}
```

#### Google OAuth Login

**GET** `/auth/google`

Redirects to Google for authentication.

**GET** `/auth/google/callback`

Google redirects back to this endpoint after authentication.

## User Management

### Create User

**POST** `/users/InsertUserS`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "data": "New User Has Been Created Succfully John Doe"
  }
}
```

### Get All Users (Admin only)

**GET** `/users/GetAllUserS`

**Authorization:** Required (Admin)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "name": "John Doe",
        "email": "john@example.com"
      },
      // More users...
    ]
  }
}
```

### Edit User (Admin only)

**PATCH** `/users/EditUsers`

**Authorization:** Required (Admin)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "currentPassword",
  "newemail": "newuser@example.com",
  "newPAsswaord": "newPassword"
}
```

**Response (202):**
```json
{
  "status": "success",
  "data": {
    "data": "User user@example.com Has Been Updated Succfully to newuser@example.com"
  }
}
```

### Update Profile

**PATCH** `/users/profile`

**Authorization:** Required

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "password": "currentPassword",
  "newPassword": "newSecurePassword"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "name": "New Name",
      "email": "newemail@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New JWT token
  }
}
```

## Avatar Management

### Upload Avatar

**POST** `/users/avatar`

**Authorization:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `avatar` (file): Image file (JPEG, PNG, GIF, WebP, max 5MB)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "message": "Avatar uploaded successfully",
    "avatar": "1640001564164-profile.jpg",
    "avatarUrl": "/api/v1/avatars/1640001564164-profile.jpg",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "1640001564164-profile.jpg"
    }
  }
}
```

### Get Current User's Avatar

**GET** `/users/avatar`

**Authorization:** Required

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "avatar": "1640001564164-profile.jpg",
    "avatarUrl": "/api/v1/avatars/1640001564164-profile.jpg",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Get User Avatar by ID (Public)

**GET** `/users/avatar/:userId`

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "avatar": "1640001564164-profile.jpg",
    "avatarUrl": "/api/v1/avatars/1640001564164-profile.jpg",
    "userName": "John Doe"
  }
}
```

### Delete Avatar

**DELETE** `/users/avatar`

**Authorization:** Required

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "message": "Avatar deleted successfully",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null
    }
  }
}
```

## Product Management

### Get All Products

**GET** `/products/getAllProducts`

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        // Product data
      },
      // More products...
    ]
  }
}
```

### Insert Product (Admin only)

**POST** `/products/insertProduct`

**Authorization:** Required (Admin)

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "quantity": 100,
  "category": "categoryId",
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "data": "New Product Has Been Created Successfully"
  }
}
```

### Create Order

**POST** `/products/order`

**Authorization:** Required

**Request Body:**
```json
{
  "products": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "ST",
    "zipCode": "12345",
    "country": "Country"
  }
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    // Order data
  }
}
```

### Update Order Status

**PATCH** `/products/order/:orderId`

**Authorization:** Required

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    // Updated order data
  }
}
```

### Get Last Orders

**GET** `/products/lastOrders`

**Authorization:** Required

**Response (200):**
```json
{
  "data": [
    {
      // Order data
    },
    // More orders...
  ]
}
```

## File Upload

### Upload Files

**POST** `/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (files): Up to 5 files (10MB max per file)

**Response (200):**
```json
{
  "status": "success",
  "message": "Files uploaded successfully",
  "files": [
    {
      "fieldname": "file",
      "originalname": "image.jpg",
      "encoding": "7bit",
      "mimetype": "image/jpeg",
      "destination": "./Mvc/assets",
      "filename": "1640001564164-image.jpg",
      "path": "Mvc/assets/1640001564164-image.jpg",
      "size": 12345
    },
    // More files...
  ]
}
```

## API Response Format

The API follows a consistent response format:

### Success Response

```json
{
  "status": "success",
  "data": {
    // Relevant data
  }
}
```

### Error Response

```json
{
  "status": "fail" | "error",
  "data": {
    "message": "Error description"
  }
}
```

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `202 Accepted`: Request accepted for processing
- `400 Bad Request`: Invalid request (e.g., validation errors)
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: Request entity too large
- `500 Internal Server Error`: Server-side error

## Frontend Integration

### Authentication Flow

1. **Registration:**
   - Send POST request to `/users/InsertUserS`
   - Store returned confirmation message

2. **Login:**
   - Send POST request to `/users/login`
   - Store JWT token in localStorage or secure cookie
   - Include token in subsequent requests

3. **OAuth Login:**
   - Redirect user to `/auth/google`
   - Handle the redirect back from Google
   - Store JWT token from the response

4. **Authenticated Requests:**
   - Include JWT token in the Authorization header: `Authorization: Bearer [token]`

### Avatar Upload Example (React)

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function AvatarUpload() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await axios.post('/api/v1/users/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status === 'success') {
        setAvatarUrl(response.data.data.avatarUrl);
      }
    } catch (error) {
      setError(error.response?.data?.data?.message || 'Upload failed');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload Avatar</button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {avatarUrl && (
        <img 
          src={`http://localhost:3000${avatarUrl}`} 
          alt="Avatar" 
          className="avatar-preview"
        />
      )}
    </div>
  );
}

export default AvatarUpload;
```

### Product Listing Example (React)

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/products/getAllProducts');
        if (response.data.status === 'success') {
          setProducts(response.data.data.data);
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to load products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <img 
            src={`/api/v1/uploads/${product.images[0]}`} 
            alt={product.name} 
          />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

### Shopping Cart Example (React)

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function Checkout({ cart }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const orderData = {
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: address
      };
      
      const response = await axios.post('/api/v1/products/order', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        // Order placed successfully
        // Redirect to order confirmation page
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };
  
  // Address form and checkout button UI
}
```

## Security Considerations

1. **Authentication**: Always include the JWT token for authenticated routes
2. **File Uploads**: Be aware of file size limits (5MB for avatars, 10MB for general files)
3. **CORS**: The API allows requests from specific origins:
   - https://apdo978.github.io
   - https://abdelrhman-dev.me
   - http://localhost:4200

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- After limit is reached, requests will be blocked with a 429 status code

## Testing

For testing API endpoints, you can use the provided test files like `avatar-test.js` or tools like Postman or curl.

## Contact Information

For API support or questions, please contact the development team.
