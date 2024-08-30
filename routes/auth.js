const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const jwt_s = "imharshkanjar@127.0.0.1/#";

// Create a user
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User already exists" });
        }

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password // Store password in plain text
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_s);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Authenticate a user
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if the password matches
        if (password !== user.password) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_s);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Get logged-in user details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

const SABPAISA_API_URL = 'https://api.sabpaisa.in/your-endpoint';
const SABPAISA_API_KEY = 'your_api_key_here';

router.post('/payments', async (req, res) => {
  const { amount, currency, description } = req.body;

  try {
    const response = await axios.post(SABPAISA_API_URL, {
      amount,
      currency,
      description,
      api_key: SABPAISA_API_KEY,
    });

    // Assuming the API response contains a payment URL
    res.json({ paymentUrl: response.data.paymentUrl });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
});


module.exports = router;
