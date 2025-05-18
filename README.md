# Mediterranean College Alumni Platform

Web application for supporting the Mediterranean College alumni community and administration.

## Description

The Mediterranean College Alumni Platform enables graduates to register, create profiles, and connect with other alumni. The system provides different access levels based on user roles: Administrator, Registered Alumni, Applied Alumni, and Visitor.

## Key Features

- **User Authentication**: Secure registration and login system
- **Profile Management**: Alumni can create and manage their personal profiles
- **Alumni Directory**: Browse and search approved alumni with advanced filters
- **Pending Profile Approval**: Admins can approve new alumni registrations
- **School & Programs Management**: View and manage college schools and academic programs
- **Events System**: Browse upcoming events and register for them (alumni only)
- **Admin Dashboard**: Complete administration interface for managing all aspects of the platform
- **Dark Mode**: Optimized dark theme for better user experience
- **Responsive Design**: Mobile-friendly interface for all devices

## Technologies

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- REST API architecture

### Frontend
- React for UI components
- React Router for navigation
- Context API for state management
- CSS for styling (dark mode optimized)

## Setup Guide

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (v6.x or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/erikos5/medalumni.git
cd medalumni
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

4. Configure MongoDB access:
   - Create a file called `mongodb-uri.txt` in the root directory
   - Add your MongoDB connection string to this file
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/mediterranean-alumni?retryWrites=true&w=majority`

5. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   JWT_SECRET=your_secure_jwt_secret_key_here
   PORT=5006
   ```
   
   Example of a completed `.env` file:
   ```
    NODE_ENV=development
    PORT=5006
    MONGO_URI=mongodb://localhost:27017/mediterranean-alumni
    JWT_SECRET=mysecrettoken
   ```
   - The JWT_SECRET is used for securing authentication tokens
   - You can generate a secure random string for JWT_SECRET using a tool like https://randomkeygen.com/

### Running the Application

Start both the backend and frontend with:

```
npm run dev
```

Or run them separately:

Backend server only:
```
npm run server
```

Frontend React app only:
```
npm run client
```

The backend will run on port 5006, and the frontend will run on port 3001.

### Default Login Credentials

The application comes with the following pre-configured accounts:

**Admin User**:
- Email: admin@example.com
- Password: password123

**Regular User**:
- Email: yannos@example.com
- Password: password123

## Application Flow

### User Registration Process

1. Users register with their email and password
2. Upon registration, users are assigned the "appliedAlumni" role
3. A pending profile is automatically created for them
4. Admin users can review and approve pending profiles
5. Once approved, users can access alumni-only features

### Admin Features

- **Dashboard**: Overview of system statistics
- **User Management**: View, edit, and approve user profiles
- **School Management**: Add, edit, and manage schools and programs
- **Events Management**: Create and manage events
- **Photo Gallery**: Upload and manage photo galleries

### User Features

- **Profile Management**: Create and update personal information
- **Alumni Directory**: Connect with other approved alumni
- **Events**: Register for and attend alumni events
- **Schools**: Browse information about college schools and programs

## Utility Scripts

The project includes several utility scripts to help with database management:

- **check-profiles.js**: Lists users with missing profiles
- **create-pending-profiles.js**: Creates pending profiles for users missing them
- **approve-pending-profiles.js**: Approves pending profiles
- **remove-mock-profiles.js**: Removes test/mock profile data
- **reset-user-password.js**: Resets a user's password

Run any script with Node.js:
```
node scripts/script-name.js
```

## Troubleshooting

### Common Issues

- **Login Problems**: Make sure you're using the correct credentials
- **Profile Not Appearing**: New registrations need admin approval
- **Events Access Denied**: Only approved alumni can access events
- **Dark Mode Display Issues**: Clear browser cache if experiencing display problems

### MongoDB Connection

The application requires a valid MongoDB connection. If you're having issues:

1. Check that your MongoDB server is running
2. Verify the connection string in mongodb-uri.txt is correct
3. Ensure your IP address is whitelisted if using MongoDB Atlas

### Environment Variables

If you're experiencing authentication issues or other unexpected behavior:

1. Make sure your `.env` file exists in the project root
2. Verify it contains all required variables (NODE_ENV, JWT_SECRET, PORT)
3. Make sure PORT is set to 5006 to match the frontend configuration
4. Restart the server after making changes to the `.env` file

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
├── scripts/                # Utility scripts
├── uploads/                # Uploaded files
├── mongodb-uri.txt         # MongoDB connection string
└── server.js               # Main Express server
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

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 