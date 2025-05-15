#!/bin/bash
cd client
export NODE_OPTIONS=--openssl-legacy-provider
export PORT=3001
export REACT_APP_API_URL=http://localhost:5006
npm start
