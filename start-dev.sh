#!/bin/bash

# Start backend server
echo "Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server on port 5173..."
npx vite &
FRONTEND_PID=$!

echo "Servers started!"
echo "Backend: http://localhost:3001 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait