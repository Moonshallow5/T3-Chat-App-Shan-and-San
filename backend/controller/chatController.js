const pool = require('../models/db');

exports.createSession = async (req, res) => {
  const { user_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING id",
      [user_id]
    );

    return res.json({
      message: "Chat session created successfully",
      data: {
        session_id: result.rows[0].id
      }
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
  const { session_id, user_id, content, is_bot } = req.body;

  try {
    // Insert the message
    await pool.query(
      "INSERT INTO messages (session_id, user_id, content, is_bot) VALUES ($1, $2, $3, $4)",
      [session_id, user_id, content, is_bot]
    );

    // Update session's updated_at
    await pool.query(
      "UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [session_id]
    );

    // TODO: Add your chatbot logic here to generate a response
    const botResponse = "This is a sample bot response. Replace with actual chatbot logic.";

    // Insert bot response
    await pool.query(
      "INSERT INTO messages (session_id, user_id, content, is_bot) VALUES ($1, $2, $3, $4)",
      [session_id, user_id, botResponse, true]
    );

    return res.json({
      message: "Message sent successfully",
      data: {
        bot_response: botResponse
      }
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 