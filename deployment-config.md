# Deployment Configuration

## Render (Backend) Setup

1. Go to your Render dashboard and create a new Web Service
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: mediterranean-alumni-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `MONGO_URI`: (paste your MongoDB Atlas URI from mongodb-atlas-uri.txt)
     - `JWT_SECRET`: mysecrettoken
     - `FRONTEND_URL`: https://mediterranean-alumni.netlify.app

## Netlify (Frontend) Setup

1. Go to your Netlify dashboard and create a new site
2. Connect your GitHub repository
3. Configure the following settings:
   - **Base directory**: client
   - **Build command**: `npm run build`
   - **Publish directory**: build
   - **Environment Variables**:
     - `REACT_APP_API_URL`: https://mediterranean-alumni-api.onrender.com

## GitHub Configuration

Before deploying, make sure to commit and push all the changes we've made:

```
git add .
git commit -m "Fix MongoDB Atlas connection and authentication"
git push
```

## Important Files to Include

Make sure the following files are included in your GitHub repository:

1. `netlify.toml` (already exists)
2. `render.yaml` (newly created)
3. All the fixed server and client code

## Post-Deployment

After deploying:

1. Go to your Render dashboard and check the logs to ensure the server is connecting to MongoDB Atlas
2. Visit the deployed Netlify site and test login with:
   - Email: admin@example.com
   - Password: password123

If you encounter issues, check the browser console and server logs for error messages. 