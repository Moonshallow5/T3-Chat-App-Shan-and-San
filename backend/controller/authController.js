const pool=require('../models/db');
const bcrypt = require("bcrypt");


const generateToken = (username) => Buffer.from(username + Date.now()).toString("base64");

exports.register= async(req,res)=> {
  const { username, password } = req.body;
    try{
        const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: "Username already taken" });
            }

            const hashedpass=await bcrypt.hash(password,10);

            const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
            [username, hashedpass]
        );

        return res.json({ message: "User registered successfully", user_id: result.rows[0].id });
    }catch(error){
            res.status(500).json({ message: "Internal server error" });
        }



};



exports.login= async (req, res) => {
    const { username,password } = req.body;
    console.log("Login attempt for:", username);  // Log received username
    try{

  
    // Check if user exists
    const result = await pool.query("SELECT id, username,password FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      const passwordMatch = await bcrypt.compare(password, user.password);


      if (passwordMatch) {
          const token = generateToken(username);
          return res.json({ message: "Login successful", token, user_id: user.id });
      } else {
          return res.status(401).json({ message: "Invalid password" });
      }
  } else {
      return res.status(401).json({ message: "User not found" });
  }
}catch(error){
    res.status(500).json({ message: "Internal server error" });
}
  

  }