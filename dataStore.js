
class DataStore {
  constructor() {
    
    this.users = [];
    this.userIdCounter = 1;

  
    this.events = [];
    this.eventIdCounter = 1;

   
    this.registrations = [];
    this.registrationIdCounter = 1;
  }

 
  addUser(user) {
    const newUser = {
      id: this.userIdCounter++,
      ...user,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Find user by email
   */
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  /**
   * Find user by ID
   */
  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  /**
   * Get all users
   */
  getAllUsers() {
    return this.users.map(user => {
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // ============= EVENT OPERATIONS =============
  
  /**
   * Add a new event
   */
  addEvent(event) {
    const newEvent = {
      id: this.eventIdCounter++,
      ...event,
      participants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.push(newEvent);
    return newEvent;
  }

  /**
   * Find event by ID
   */
  findEventById(id) {
    return this.events.find(event => event.id === parseInt(id));
  }

  /**
   * Get all events
   */
  getAllEvents() {
    return this.events;
  }

  /**
   * Update an event
   */
  updateEvent(id, updates) {
    const eventIndex = this.events.findIndex(event => event.id === parseInt(id));
    if (eventIndex === -1) return null;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      id: this.events[eventIndex].id, // Preserve ID
      participants: this.events[eventIndex].participants, // Preserve participants
      createdAt: this.events[eventIndex].createdAt, // Preserve creation date
      updatedAt: new Date()
    };
    return this.events[eventIndex];
  }

  /**
   * Delete an event
   */
  deleteEvent(id) {
    const eventIndex = this.events.findIndex(event => event.id === parseInt(id));
    if (eventIndex === -1) return false;

    this.events.splice(eventIndex, 1);
    // Also remove all registrations for this event
    this.registrations = this.registrations.filter(reg => reg.eventId !== parseInt(id));
    return true;
  }

  // ============= REGISTRATION OPERATIONS =============
  
  /**
   * Register a user for an event
   */
  addRegistration(eventId, userId) {
    // Check if already registered
    const existingRegistration = this.registrations.find(
      reg => reg.eventId === eventId && reg.userId === userId
    );
    if (existingRegistration) {
      return null; // Already registered
    }

    const registration = {
      id: this.registrationIdCounter++,
      eventId,
      userId,
      registeredAt: new Date()
    };
    this.registrations.push(registration);

    // Add user to event participants
    const event = this.findEventById(eventId);
    if (event && !event.participants.includes(userId)) {
      event.participants.push(userId);
    }

    return registration;
  }

  /**
   * Get all registrations for a user
   */
  getUserRegistrations(userId) {
    return this.registrations.filter(reg => reg.userId === userId);
  }

  /**
   * Get all registrations for an event
   */
  getEventRegistrations(eventId) {
    return this.registrations.filter(reg => reg.eventId === eventId);
  }

  /**
   * Check if user is registered for an event
   */
  isUserRegisteredForEvent(eventId, userId) {
    return this.registrations.some(
      reg => reg.eventId === eventId && reg.userId === userId
    );
  }

  /**
   * Get event with participant details
   */
  getEventWithParticipants(eventId) {
    const event = this.findEventById(eventId);
    if (!event) return null;

    const participants = event.participants.map(userId => {
      const user = this.findUserById(userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    }).filter(user => user !== null);

    return {
      ...event,
      participantDetails: participants
    };
  }
}

// Create and export a singleton instance
const dataStore = new DataStore();
module.exports = dataStore;