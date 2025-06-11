const express = require("express");
const router = express.Router();
const chatController = require('../controller/chatController');

router.post('/session', chatController.createSession);
router.post('/message', chatController.sendMessage);

module.exports = router; 