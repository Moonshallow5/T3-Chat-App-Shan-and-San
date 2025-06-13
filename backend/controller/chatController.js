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
    // Check if this is the first message in the session
    const messageCount = await pool.query(
      "SELECT COUNT(*) FROM messages WHERE session_id = $1",
      [session_id]
    );

    // If it's the first message, update the session title
    if (messageCount.rows[0].count === '0') {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      await pool.query(
        "UPDATE chat_sessions SET title = $1 WHERE id = $2",
        [title, session_id]
      );
    }

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

exports.getSession = async (req, res) => {
  const { sessionId } = req.params;
  const { user_id } = req.query;

  try {
    // First verify the session belongs to the user
    const sessionCheck = await pool.query(
      "SELECT id, title, updated_at FROM chat_sessions WHERE id = $1 AND user_id = $2",
      [sessionId, user_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Get all messages for this session
    const messages = await pool.query(
      `SELECT 
        content,
        is_bot,
        created_at
      FROM messages 
      WHERE session_id = $1 
      ORDER BY created_at ASC`,
      [sessionId]
    );

    return res.json({
      message: "Chat session retrieved successfully",
      data: {
        title: sessionCheck.rows[0].title || 'New Chat',
        messages: messages.rows.map(msg => ({
          content: msg.content,
          role: msg.is_bot ? 'persona' : 'user',
          created_at: msg.created_at
        }))
      }
    });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllSessions = async (req, res) => {
  const { user_id } = req.query;

  try {
    const sessions = await pool.query(
      `SELECT 
        id,
        title,
        updated_at
      FROM chat_sessions 
      WHERE user_id = $1 
      ORDER BY updated_at DESC`,
      [user_id]
    );

    return res.json({
      message: "Chat sessions retrieved successfully",
      data: sessions.rows
    });
  } catch (error) {
    console.error("Get all sessions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 