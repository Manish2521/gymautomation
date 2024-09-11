const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // For loading environment variables

const app = express();
const port = process.env.PORT || 5000;

const now = new Date();


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

const now = new Date();
const formattedDateTime = now.toLocaleString('en-IN', options);  


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
        console.log("User: " + user.username + " with Password: " + password + " logged in to site: gymautomation.netlify.app at " + formattedDateTime);

    } else {
      res.status(401).json({ error: 'Incorrect credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Unable to connect to the database' });
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
  console.log("User:" + user + "with Password:" + password + "logged OUT to gymautomation.netlify.app at " + formattedDateTime);
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
