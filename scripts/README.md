# Admin Scripts

This directory contains utility scripts for administering the Mediterranean College Alumni application.

## Available Scripts

### createAdmin.js

This script creates or updates an admin user in the MongoDB database with the following credentials:

- Email: admin@example.com
- Password: password123
- Role: admin
- ID: 5f8f8c8f8c8f8c8f8c8f8c9d (consistent with the ID used in the application)

#### Usage

```bash
node scripts/createAdmin.js
```

#### What it does

1. Connects to the MongoDB database
2. Checks if an admin user with email admin@example.com already exists
   - If found, ensures password and role are correct
   - If not found, creates a new admin user with the correct ID
3. Disconnects from the database

#### When to use

Run this script:
- After initial setup of the application
- If you need to reset the admin credentials
- When migrating to a new database
- If you're experiencing authentication issues with the admin account

This script is designed to work seamlessly with the authentication system and ensures the admin user in the database matches the one expected by the application. 