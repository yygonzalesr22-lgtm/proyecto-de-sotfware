const { pool } = require('../config/database');

exports.saveMessage = async (from_user, room, message) => {
  try {
    await pool.query('INSERT INTO chat_messages (from_user, room, message) VALUES (?, ?, ?)', [from_user, room, message]);
  } catch (err) {
    console.error('Error saving chat message:', err.message);
  }
};

exports.getRoomMessages = async (req, res) => {
  const room = req.params.room;
  try {
    const [rows] = await pool.query('SELECT cm.*, u.nombre FROM chat_messages cm LEFT JOIN usuarios u ON cm.from_user = u.id_usuario WHERE cm.room = ? ORDER BY cm.created_at ASC', [room]);
    res.json({ success:true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
};
