# Local Setup Instructions for Windows

## Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS version recommended)
2. Install [Git](https://git-scm.com/download/win)
3. Install a code editor like [VS Code](https://code.visualstudio.com/)

## Setup Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Alumni
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with:
   ```
   MONGO_URI=mongodb+srv://henrishani:Med2005!@alumni-cluster.7pjqg4a.mongodb.net/mediterranean-alumni?retryWrites=true&w=majority&appName=alumni-cluster
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=mysecrettoken
   ```

4. **Start the Application**
   ```bash
   # Start the backend server (from root directory)
   npm start

   # In a new terminal, start the frontend (from root directory)
   cd client
   npm start
   ```

5. **Access the Application**
   - Backend API: http://localhost:5006
   - Frontend: http://localhost:3000

## Troubleshooting

1. **MongoDB Connection Issues**
   - If you get a connection error, you might need to:
     1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
     2. Log in with the credentials provided by the repository owner
     3. Add your IP address to the IP whitelist in the Network Access settings

2. **Port Already in Use**
   - If port 5006 is in use, you can change it in `server.js`
   - If port 3000 is in use, the React app will ask to use a different port

3. **Node Modules Issues**
   - If you encounter module errors, try:
     ```bash
     # On Windows, use this instead of rm -rf
     rmdir /s /q node_modules
     npm install
     ```

## Default Login Credentials
- Email: admin@example.com
- Password: password123

## Need Help?
If you encounter any issues:
1. Check the console for error messages
2. Make sure all environment variables are set correctly
3. If you get a MongoDB connection error, ask the repository owner to add your IP to the whitelist
4. Ensure all dependencies are installed correctly 