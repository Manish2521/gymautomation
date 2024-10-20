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

// Define your Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  status: String,
});

// const MONGODB_URI = 'mongodb://localhost:27017/userdata'; // Hard-coded MongoDB URI
// const ACCESS_TOKEN_SECRET = 'yourSecretKey'; // Replace with your desired secret key

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://gymautomationfront.netlify.app', 'https://gymautomation.netlify.app'], // Allow both frontend origins
  credentials: true, // Allow credentials (cookies) to be included
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { // Use hard-coded MongoDB URI
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


// Equipment Schema
const equipSchema = new mongoose.Schema({
  name: String,
  quantity: Number, 
  status: { type: String, default: 'Available' }, 
});

// trainer Schema
const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  specialty: { type: String }, // Add this line
  certification: { type: String }, // Add this line
  status: { type: String, default: 'Available' }, 
});


const Membership = mongoose.model('Membership', membershipSchema, 'membership'); 
const Availableplans = mongoose.model('availablePlans', membershipSchema, 'availablePlans'); 
const Employee = mongoose.model('employees', employeeSchema, 'employees'); 
const equip = mongoose.model('equipment', equipSchema, 'equipment'); 
const trainer = mongoose.model('trainer', trainerSchema, 'trainer'); 

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

      // Log login details
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
  }
});



// Membership route to get all availableplans
app.get('/availableplans', async (req, res) => {
  try {
    const availablePlans = await Availableplans.find(); // Fetch all memberships from the database
    res.json(availablePlans);
  } catch (error) {
    console.error('Error fetching Availableplans:', error);
    res.status(500).json({ error: 'Unable to fetch Availableplans' });
  }
});




// Membership route to get all employees
app.get('/employees', async (req, res) => {
  try {
    const employee = await Employee.find(); // Fetch all employee from the database
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Unable to fetch employee' });
  }
});

// POST endpoint to add a new employee
app.post('/employees', async (req, res) => {
  const { name, role } = req.body; // Get name and role from request body

  try {
    // Check if an employee with the same name already exists
    const existingEmployee = await Employee.findOne({ name });

    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this name already exists' });
    }

    const newEmployee = new Employee({
      name,
      role,
    });

    const savedEmployee = await newEmployee.save(); 
    res.status(201).json(savedEmployee); 
  } catch (error) {
    console.error('Error adding employee:', error.message); 
    res.status(500).json({ error: 'Unable to add employee', details: error.message }); 
  }
});

// PUT endpoint to update an existing employee's details
app.put('/employees', async (req, res) => {
  const { id } = req.params; // Extract the employee ID from the URL
  const { name, role } = req.body; // Extract name and role from request body

  try {
    // Find the employee by ID and update their details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      name,
      { name, role }, // Only update name and role
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Log the updated employee for debugging
    console.log(`Updated Employee: ${JSON.stringify(updatedEmployee)}`);

    // Check if the employee was found and updated
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Send the updated employee back as the response
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Unable to update employee' });
  }
});


// DELETE endpoint to delete an employee by name
app.delete('/employees/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the employee by name
    const deletedEmployee = await Employee.findOneAndDelete({ name });

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Unable to delete employee' });
  }
});



// Equipment route to get all equipment
app.get('/equipment', async (req, res) => {
  try {
    const equipment = await equip.find(); // Fetch all equipment from the database
    res.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Unable to fetch equipment' });
  }
});

// POST endpoint to add a new equipment item
app.post('/equipment', async (req, res) => {
  const { name, quantity, status } = req.body; // Get name, quantity, and status from request body

  try {
    // Check if an equipment item with the same name already exists
    const existingEquipment = await equip.findOne({ name });

    if (existingEquipment) {
      return res.status(400).json({ error: 'Equipment with this name already exists' });
    }

    const newEquipment = new equip({
      name,
      quantity,
      status,
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error('Error adding equipment:', error.message);
    res.status(500).json({ error: 'Unable to add equipment', details: error.message });
  }
});

// PUT endpoint to update an existing equipment item's details
app.put('/equipment/:id', async (req, res) => {
  const { id } = req.params; // Extract the equipment ID from the URL
  const { name, quantity, status } = req.body; // Extract name, quantity, and status from request body

  try {
    // Find the equipment by ID and update their details
    const updatedEquipment = await equip.findByIdAndUpdate(
      id,
      { name, quantity, status }, // Update name, quantity, and status
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the equipment was found and updated
    if (!updatedEquipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(updatedEquipment); // Send the updated equipment back as the response
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Unable to update equipment' });
  }
});

// DELETE endpoint to delete an equipment item by name
app.delete('/equipment/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the equipment item by name
    const deletedEquipment = await equip.findOneAndDelete({ name });

    if (!deletedEquipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Unable to delete equipment' });
  }
});

// Route to get all trainers
app.get('/trainers', async (req, res) => {
  try {
    const trainers = await trainer.find(); // Fetch all trainers from the database
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Unable to fetch trainers' });
  }
});

// POST endpoint to add a new trainer
app.post('/trainers', async (req, res) => {
  const { name, specialty, certification, status } = req.body; // Get trainer details from request body

  try {
    // Check if a trainer with the same name already exists
    const existingTrainer = await trainer.findOne({ name });

    if (existingTrainer) {
      return res.status(400).json({ error: 'Trainer with this name already exists' });
    }

    const newTrainer = new trainer({
      name,
      specialty,
      certification,
      status,
    });

    const savedTrainer = await newTrainer.save();
    res.status(201).json(savedTrainer);
  } catch (error) {
    console.error('Error adding trainer:', error.message);
    res.status(500).json({ error: 'Unable to add trainer', details: error.message });
  }
});

// PUT endpoint to update an existing trainer's details
app.put('/trainers/:id', async (req, res) => {
  const { id } = req.params; // Extract the trainer ID from the URL
  const { name, specialty, certification, status } = req.body; // Extract trainer details from request body

  try {
    // Find the trainer by ID and update their details
    const updatedTrainer = await trainer.findByIdAndUpdate(
      id,
      { name, specialty, certification, status }, // Update name, specialty, certification, and status
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the trainer was found and updated
    if (!updatedTrainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(updatedTrainer); // Send the updated trainer back as the response
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ error: 'Unable to update trainer' });
  }
});

// DELETE endpoint to delete a trainer by name
app.delete('/trainers/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the trainer by name
    const deletedTrainer = await trainer.findOneAndDelete({ name });

    if (!deletedTrainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Unable to delete trainer' });
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
