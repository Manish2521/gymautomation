const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 5000;


const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  timeZone: 'Asia/Kolkata'
};

const currentDateTime = new Date();
const formattedDateTime = currentDateTime.toLocaleString('en-IN', options);  

// const MONGODB_URI = 'mongodb://localhost:27017/userdata'; // Corrected database name
// const ACCESS_TOKEN_SECRET = 'yourSecretKey'; // Replace with your desired secret key

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://gymautomationfront.netlify.app', 'https://gymautomation.netlify.app'], // Allow both frontend origins
  credentials: true, // Allow credentials (cookies) to be included
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // You should use hashed passwords in production
});

const User = mongoose.model('User', userSchema);

// Membership Schema
const membershipSchema = new mongoose.Schema({
  name: String,
  type: String,
  startDate: String, 
  endDate: String,   
  status: { type: String, default: 'Active' }, 
});

const Membership = mongoose.model('Membership', membershipSchema, 'membership'); 

// Default route
app.get("/", (req, res) => {
  res.json("Hello");
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Set the token in a cookie
      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
      res.status(200).json({ message: 'Login successful' });
      console.log("Login successful");

      // const ipify = await import('ipify');  
      console.log("-----------------------------------------------------------------------------------------------------------------------------------");
      console.log("User: " + user.username + " with Password: " + password + " logged IN to site: gymautomation.netlify.app at " + formattedDateTime);
      console.log("-----------------------------------------------------------------------------------------------------------------------------------");

    } else {
      res.status(401).json({ error: 'Incorrect credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Unable to connect to the database' });
  }
});

// Membership route to get all memberships
app.get('/memberships', async (req, res) => {
  try {
    const memberships = await Membership.find(); // Fetch all memberships from the database
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Unable to fetch memberships' });
    console.log("Error fetching memberships");
  }
});


// POST endpoint to add a new membership
app.post('/memberships', async (req, res) => {
  const { name, type, startDate, endDate } = req.body;

  try {
    // Check if a membership with the same name already exists
    const existingMembership = await Membership.findOne({ name });

    if (existingMembership) {
      return res.status(400).json({ error: 'Membership with this name already exists' });
    }

    const newMembership = new Membership({
      name,
      type,
      startDate: new Date(startDate).toISOString().split('T')[0], 
      endDate: new Date(endDate).toISOString().split('T')[0],    
      status: new Date(endDate) >= new Date() ? 'Active' : 'Expired',
    });

    const savedMembership = await newMembership.save(); 
    res.status(201).json(savedMembership); 
  } catch (error) {
    console.error('Error adding membership:', error.message); 
    res.status(500).json({ error: 'Unable to add membership', details: error.message }); 
  }
});


// PUT endpoint to delete an existing membership and create a new one
app.put('/memberships', async (req, res) => {
  const { id } = req.params;
  const { name, type, startDate, endDate } = req.body;

  try {
    // Delete the existing membership by name
    const deletedMembership = await Membership.findOneAndDelete({ name });

    // Log the deleted membership for debugging
    console.log(`Deleted Membership: ${JSON.stringify(deletedMembership)}`);

    // Check if the membership was actually deleted
    if (!deletedMembership) {
      console.log(`No membership found with name ${name} to delete.`);
    }

    // Create a new membership
    const newMembership = new Membership({
      name,
      type,
      startDate: new Date(startDate).toISOString().split('T')[0], 
      endDate: new Date(endDate).toISOString().split('T')[0],     
      status: new Date(endDate) >= new Date() ? 'Active' : 'Expired',
    });

    // Save the new membership to the database
    const savedMembership = await newMembership.save();
    console.log(`New Membership Created: ${JSON.stringify(savedMembership)}`); 

    res.json(savedMembership); 
  } catch (error) {
    console.error('Error processing membership:', error);
    res.status(500).json({ error: 'Unable to process membership' });
  }
});



// Delete membership by name
app.delete('/memberships/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the membership by name
    const deletedMembership = await Membership.findOneAndDelete({ name });

    if (!deletedMembership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Unable to delete membership' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
  console.log("===============================================================================================================");
  console.log("User logged OUT to gymautomation.netlify.app at " + formattedDateTime);
  console.log("===============================================================================================================");
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Unauthorized access' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Protected route to check auth
app.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

// Error handling middleware
app.use('/error', (req, res) => {
  res.send(`
    <h1>Unauthorized Access</h1>
    <p>You are not logged in. Please log in to access this page.</p>
    <p>Redirecting to login page in <span id="countdown">5</span> seconds...</p>
    <script>
      let countdown = 5;
      const countdownElement = document.getElementById('countdown');
      const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = '/';
        }
      }, 1000);
    </script>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
