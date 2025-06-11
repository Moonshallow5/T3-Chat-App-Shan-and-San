const pool=require('../models/db');
const bcrypt = require("bcrypt");


const generateToken = (username) => Buffer.from(username + Date.now()).toString("base64");

exports.register = async(req, res) => {
  const { username, name, password, confirm_password } = req.body;
  
  try {
    // Validate all required fields
    if (!username || !name || !password || !confirm_password) {
      return res.status(400).json({ 
        message: "All fields are required",
        details: {
          username: !username ? "Username is required" : null,
          name: !name ? "Name is required" : null,
          password: !password ? "Password is required" : null,
          confirm_password: !confirm_password ? "Please confirm your password" : null
        }
      });
    }

    // First check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Then check if username exists
    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // If all checks pass, hash password and create user
    const hashedpass = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, name, password, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id",
      [username, name, hashedpass]
    );

    return res.json({ 
      message: "User registered successfully", 
      data: {
        user_id: result.rows[0].id
      }
    });
  } catch(error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        message: "All fields are required",
        details: {
          username: !username ? "Username is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    console.log("Login attempt for:", username);
    
    // Check if user exists and is active
    const result = await pool.query(
      "SELECT id, username, password FROM users WHERE username = $1 AND is_deleted = false AND is_active = true",
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Update last_login_at and updated_at
        await pool.query(
          "UPDATE users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
          [user.id]
        );

        const token = generateToken(username);
        return res.json({ 
          message: "Login successful", 
          data: {
            token,
            user_id: user.id
          }
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(401).json({ message: "User not found or account is inactive" });
    }
  } catch(error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};