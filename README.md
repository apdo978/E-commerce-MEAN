# E-Commerce Frontend Documentation

## Overview
This is a modern e-commerce frontend application built with Angular 17, featuring a responsive design and Material UI components. The application provides a seamless shopping experience with features like product browsing, cart management, and user authentication.

## Tech Stack
- Angular 17
- Angular Material
- TypeScript
- SCSS
- RxJS
- Angular Router

## Project Structure
```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # Data models
│   │   └── services/        # Core services
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── cart/           # Shopping cart
│   │   ├── home/           # Home page
│   │   └── products/       # Product management
│   └── shared/             # Shared components and modules
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## Key Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Persistent sessions

### Product Management
- Product listing with filtering and search
- Category-based navigation
- Product details view
- Responsive product grid

### Shopping Cart
- Add/remove items
- Quantity management
- Price calculation
- Persistent cart data

### User Interface
- Material Design components
- Responsive layout
- Loading states
- Error handling
- Toast notifications

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v17)

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Environment Setup
Create a `src/environments/environment.ts` file:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000' // Your backend API URL
};
```

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement lazy loading for feature modules
- Use SCSS for styling
- Follow component-based architecture

### State Management
- Use services for state management
- Implement reactive forms for user input
- Use RxJS operators for data transformation

### Testing
- Unit tests with Jasmine/Karma
- E2E tests with Protractor
- Component testing
- Service testing

### Performance Optimization
- Lazy loading modules
- Image optimization
- Tree shaking
- AOT compilation

## Deployment
1. Build the application
```bash
ng build --prod
```

2. Deploy the contents of the `dist` folder to your hosting service

## API Integration
The frontend communicates with the backend through RESTful APIs. All API calls are handled through services in the `core/services` directory.

### Available Services
- `AuthService`: Handles authentication
- `ProductService`: Manages product data
- `CartService`: Manages shopping cart operations

## Error Handling
- Global error interceptor
- Toast notifications for user feedback
- Loading states for async operations
- Form validation

## Security
- JWT token management
- HTTP interceptors for authentication
- Route guards for protected routes
- XSS protection
- CSRF protection

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
