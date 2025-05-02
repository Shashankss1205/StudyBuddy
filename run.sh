#!/bin/bash

# Start the backend server
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Start the frontend development server
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle cleanup on script exit
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Set up trap to catch script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Servers started. Press Ctrl+C to stop."
wait 