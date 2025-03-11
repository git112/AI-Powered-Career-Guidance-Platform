import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const { email, name, picture, googleToken } = req.body;

    if (!email || !name) {
      console.log('Missing required fields:', { email, name });
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { email, name }
      });
    }

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      console.log('Found existing user:', user);

      if (!user) {
        // Create new user with googleId
        const newUser = {
          email,
          name,
          imageUrl: picture,
          googleId: googleToken // Save Google token as googleId
        };
        console.log('Creating new user with data:', newUser);
        
        user = new User(newUser);
        await user.save();
        console.log('New user created successfully:', user);
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Authentication successful, sending response');
      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl
        }
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return res.status(500).json({
        message: 'Database operation failed',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
};
