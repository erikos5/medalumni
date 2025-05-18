# Mediterranean College Alumni Platform Deployment Guide

This document provides comprehensive instructions for deploying the Mediterranean College Alumni platform to production environments.

## Required Services

1. **MongoDB Atlas** - For database hosting
2. **Render** - For Node.js backend hosting
3. **Netlify/Vercel** - For React frontend hosting

## 1. Database Deployment (MongoDB Atlas)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (free tier is available)
3. Configure Database Access:
   - Create a database user with a strong password
   - Note the credentials for later use
4. Configure Network Access:
   - Add IP address 0.0.0.0/0 to allow access from anywhere
   - For improved security, restrict to your application server IPs later
5. Get your connection string:
   - Go to Clusters > Connect > Connect your application
   - Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/mediterranean-alumni?retryWrites=true&w=majority`)

## 2. Backend Deployment (Render)

1. Sign up at [Render](https://render.com/)
2. Connect your GitHub repository
3. Create a Web Service:
   - Choose your repository
   - Set Name: `mediterranean-alumni-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string
   FRONTEND_URL=your_frontend_url
   ```
5. Deploy the service

### Backend Code Changes Required:

1. Update CORS settings in `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

2. Make sure to use environment variables for sensitive information:
```javascript
mongoose.connect(process.env.MONGO_URI, {...});
jwt.sign(payload, process.env.JWT_SECRET, {...});
```

## 3. Frontend Deployment (Netlify or Vercel)

1. Sign up at [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Configure build settings:
   - Base directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
4. Add environment variables:
   ```
   REACT_APP_API_URL=your_backend_url
   ```

### Frontend Code Changes Required:

1. Update API configuration in `client/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5006',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});
```

2. Update the `package.json` build script:
```json
"scripts": {
  "start": "react-scripts start",
  "build": "REACT_APP_API_URL=https://your-backend-url.onrender.com react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

3. Remove the proxy setting from `package.json` for production builds

## Post-Deployment Steps

1. **Test the entire application flow**:
   - Registration
   - Login (both admin and regular user)
   - Profile creation and viewing
   - Event creation and management
   - School management
   - Photo gallery

2. **Setup monitoring**:
   - Use Render's built-in logs for backend monitoring
   - Consider adding a service like Sentry for error tracking

3. **Setup automatic backups**:
   - Configure MongoDB Atlas automated backups

4. **Security considerations**:
   - Ensure all environment variables are properly set
   - Add rate limiting to prevent abuse
   - Implement proper validation for all input fields

## Troubleshooting

### Common Issues:

1. **CORS errors**: Ensure CORS is properly configured with the correct frontend URL
2. **Authentication issues**: Verify JWT_SECRET is consistent and token handling is working
3. **Database connection problems**: Check MongoDB connection string and network access settings
4. **Build failures**: Verify that all dependencies are properly installed and compatible

For any persistent issues, check application logs in the respective platforms for detailed error messages. 