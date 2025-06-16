const pool = require('../models/db');
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

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

    // Get the current session title
    const sessionTitle = await pool.query(
      "SELECT title FROM chat_sessions WHERE id = $1",
      [session_id]
    );

    // Get chat history for context
    const pastMessagesQuery = await pool.query(
      "SELECT content, is_bot FROM messages WHERE session_id = $1 ORDER BY created_at DESC LIMIT 5",
      [session_id]
    );

    // Format messages for OpenAI (reverse to get chronological order)
    const chatHistory = pastMessagesQuery.rows.reverse().map(msg => ({
      role: msg.is_bot ? "persona" : "user",
      content: msg.content
    }));

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Basic model available in free tier
        messages: [
          { 
            role: "system", 
            content: "You are a helpful AI assistant. Keep responses concise and clear." 
          },
          ...chatHistory,
          { role: "user", content: content }
        ],
        temperature: 0.7,
        max_tokens: 100, // Reduced token limit for free tier
      });

      const botResponse = completion.choices[0].message.content;

      // Insert bot response
      await pool.query(
        "INSERT INTO messages (session_id, user_id, content, is_bot) VALUES ($1, $2, $3, $4)",
        [session_id, user_id, botResponse, true]
      );

      return res.json({
        message: "Message sent successfully",
        data: {
          bot_response: botResponse,
          session_title: sessionTitle.rows[0].title
        }
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback response if API fails
      const fallbackResponse = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
      
      await pool.query(
        "INSERT INTO messages (session_id, user_id, content, is_bot) VALUES ($1, $2, $3, $4)",
        [session_id, user_id, fallbackResponse, true]
      );

      return res.json({
        message: "Message sent with fallback response",
        data: {
          bot_response: fallbackResponse,
          session_title: sessionTitle.rows[0].title
        }
      });
    }
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
      AND is_active = true
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

exports.updateSessionTitle = async (req, res) => {
  const { session_id } = req.params;
  const { title, user_id } = req.body;

  try {
    // First verify the session belongs to the user
    const sessionCheck = await pool.query(
      "SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2",
      [session_id, user_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Update the session title
    await pool.query(
      "UPDATE chat_sessions SET title = $1 WHERE id = $2",
      [title, session_id]
    );

    return res.json({
      message: "Session title updated successfully",
      data: {
        session_id,
        title
      }
    });
  } catch (error) {
    console.error("Update session title error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSession = async (req, res) => {
  const { session_id } = req.params;
  const { user_id } = req.body;

  try {
    // First verify the session belongs to the user
    const sessionCheck = await pool.query(
      "SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2",
      [session_id, user_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Soft delete the session by setting is_active to false
    await pool.query(
      "UPDATE chat_sessions SET is_active = false WHERE id = $1",
      [session_id]
    );

    return res.json({
      message: "Session deleted successfully",
      data: {
        session_id
      }
    });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 