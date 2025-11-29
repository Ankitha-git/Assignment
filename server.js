/**
 * Event Management Platform - Main Server File
 * This is the entry point of the application
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Event Management Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /register',
        login: 'POST /login',
        profile: 'GET /profile (requires auth)'
      },
      events: {
        getAllEvents: 'GET /events',
        getEvent: 'GET /events/:id',
        createEvent: 'POST /events (organizers only)',
        updateEvent: 'PUT /events/:id (owner only)',
        deleteEvent: 'DELETE /events/:id (owner only)',
        registerForEvent: 'POST /events/:id/register (requires auth)',
        myRegistrations: 'GET /events/my-registrations (requires auth)',
        myEvents: 'GET /events/my-events (organizers only)'
      }
    }
  });
});

// API Routes
app.use('/', authRoutes); // Auth routes: /register, /login, /profile
app.use('/events', eventRoutes); // Event routes: /events/*

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Event Management Platform Server`);
  console.log(`📡 Server is running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('\n📚 Available Endpoints:');
  console.log('  POST   /register           - Register new user');
  console.log('  POST   /login              - Login user');
  console.log('  GET    /profile            - Get user profile (auth)');
  console.log('  GET    /events             - Get all events');
  console.log('  POST   /events             - Create event (organizer)');
  console.log('  GET    /events/:id         - Get event by ID');
  console.log('  PUT    /events/:id         - Update event (owner)');
  console.log('  DELETE /events/:id         - Delete event (owner)');
  console.log('  POST   /events/:id/register - Register for event (auth)');
  console.log('  GET    /events/my-registrations - My registrations (auth)');
  console.log('  GET    /events/my-events   - My events (organizer)');
  console.log('='.repeat(50));
});

module.exports = app;