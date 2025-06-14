const express = require("express");
const router = express.Router();
const chatController = require('../controller/chatController');

router.post('/session', chatController.createSession);
router.post('/message', chatController.sendMessage);
router.get('/session/:sessionId', chatController.getSession);
router.get('/sessions', chatController.getAllSessions);
router.put('/session/:session_id/title', chatController.updateSessionTitle);
router.delete('/session/:session_id', chatController.deleteSession);

module.exports = router; 