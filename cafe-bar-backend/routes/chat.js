const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');
const { pool: db } = require("../config/database");
router.get('/room/:room', verifyToken, chatController.getRoomMessages);

module.exports = router;
