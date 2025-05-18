# Mediterranean College Alumni Platform

Web application for supporting the Mediterranean College website and specifically the alumni office.

## Description

The Mediterranean College Alumni Platform enables graduates to register, create profiles, and connect with other alumni. The system provides different access levels based on user roles: Administrator, Registered Alumni, Applied Alumni, and Visitor.

## Features

- **User Authentication**: Secure registration and login system
- **Profile Management**: Alumni can create and edit their personal profiles
- **Alumni Directory**: Browse and search the alumni catalog with filters
- **School & Programs Catalog**: View information about college schools and programs
- **Events System**: Browse upcoming events and register for them
- **Admin Panel**: Complete administration interface for managing:
  - User Profiles
  - Schools and Programs
  - Events
  - Photo Galleries
  - System Statistics

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### Frontend
- React
- React Router for navigation
- Context API for state management
- Axios for HTTP requests

## Setup Guide

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/mediterranean-alumni.git
cd mediterranean-alumni
```

2. Install backend dependencies
```
npm install
```

3. Install frontend dependencies
```
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5006
MONGO_URI=mongodb://localhost:27017/mediterranean-alumni
JWT_SECRET=your_jwt_secret_key_here
```

### MongoDB Setup

You can either:

1. Use a local MongoDB installation:
   - Make sure MongoDB is installed and running on your system
   - The application will create the database automatically

2. Or use MongoDB Atlas:
   - Create a free MongoDB Atlas account
   - Set up a cluster and get your connection string
   - Update the `MONGO_URI` in your `.env` file with your Atlas connection string

### Database Seeding

The application can run with mock data if MongoDB is not available, but for full functionality:

1. Start the application (instructions below)
2. The database will be seeded automatically with:
   - Schools and programs
   - Sample users and profiles
   - Event data
   - Sample photo galleries

### Running the Application

#### Development Mode
To run the application in development environment (both frontend and backend):
```
npm run dev
```

To run only the backend:
```
npm run server
```

To run only the frontend:
```
npm run client
```

#### Production Mode
To build the frontend for production:
```
cd client
npm run build
cd ..
```

To run the application in production environment:
```
npm start
```

### Default Login Credentials

The application comes with the following pre-configured accounts:

**Admin User**:
- Email: admin@example.com
- Password: admin123

**Regular Users**:
- Email: johndoe@example.com
- Password: password123
- Email: janesmith@example.com
- Password: password123

## Project Structure

```
mediterranean-alumni/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       ├── context/        # Context API
│       └── utils/          # Helper functions
├── config/                 # Backend configuration
├── middleware/             # Express middleware
├── models/                 # Mongoose models
├── routes/                 # Express routes
│   └── api/                # API endpoints
├── uploads/                # Uploaded files
├── .env                    # Environment variables
├── .gitignore              # Files ignored by Git
├── package.json            # Backend dependencies
└── server.js               # Main Express file
```

## Key Components

### Client-side
- **Authentication System**: Secure JWT-based authentication
- **Context API**: Global state management for auth, alerts, and theme
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-friendly user interface

### Server-side
- **RESTful API**: Well-structured endpoints
- **MongoDB Models**: Mongoose schemas for data storage
- **Middleware**: Authentication, admin access control
- **Error Handling**: Consistent error responses

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running if using a local installation
- Check your MongoDB connection string in the `.env` file
- Verify the correct port is set in the `.env` file

### Authentication Problems
- Clear your browser's localStorage if experiencing login issues
- Reset your browser cache if styles or scripts aren't updating

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 