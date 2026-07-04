const db = require('../db/index');
const logger = require('../utils/logger');

exports.getAllMessages = (req, res) => {
    const sql = `SELECT m.*, r.nickname as reply_nickname FROM messages m 
                 LEFT JOIN messages r ON m.reply_to = r.id 
                 ORDER BY m.message_date DESC, m.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取留言失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取留言失败' });
        }
        const groupedMessages = [];
        const messageMap = {};
        
        result.forEach(msg => {
            if (msg.reply_to) {
                if (messageMap[msg.reply_to]) {
                    messageMap[msg.reply_to].replies = messageMap[msg.reply_to].replies || [];
                    messageMap[msg.reply_to].replies.push(msg);
                }
            } else {
                messageMap[msg.id] = { ...msg, replies: [] };
                groupedMessages.push(messageMap[msg.id]);
            }
        });
        
        logger.info(`获取留言成功: ${groupedMessages.length}条`);
        res.send({ status: 200, data: groupedMessages });
    });
};

exports.addMessage = (req, res) => {
    const { nickname, content, avatar, is_admin_reply, reply_to, user_id } = req.body;
    const sql = 'INSERT INTO messages (user_id, nickname, content, avatar, is_admin_reply, reply_to, message_date) VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)';
    db.query(sql, [user_id || null, nickname, content, avatar, is_admin_reply || 0, reply_to || null], (err, result) => {
        if (err) {
            logger.error('添加留言失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '添加失败' });
        }
        logger.info(`添加留言成功: id=${result.insertId}, nickname=${nickname}`);
        res.send({ status: 200, message: '添加成功', insertId: result.insertId });
    });
};

exports.updateMessage = (req, res) => {
    const { id, content } = req.body;
    const sql = 'UPDATE messages SET content=?, updated_at=CURRENT_TIMESTAMP WHERE id=?';
    db.query(sql, [content, id], (err, result) => {
        if (err) {
            logger.error('更新留言失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新留言失败: 留言不存在', { id: id });
            return res.send({ status: 404, message: '留言不存在' });
        }
        logger.info(`更新留言成功: id=${id}`);
        res.send({ status: 200, message: '更新成功' });
    });
};

exports.deleteMessage = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM messages WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('删除留言失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '删除失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('删除留言失败: 留言不存在', { id: id });
            return res.send({ status: 404, message: '留言不存在' });
        }
        logger.info(`删除留言成功: id=${id}`);
        res.send({ status: 200, message: '删除成功' });
    });
};

exports.getMessageCount = (req, res) => {
    const sql = 'SELECT COUNT(*) as count FROM messages';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取留言数量失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取数量失败' });
        }
        logger.info(`获取留言数量成功: ${result[0].count}条`);
        res.send({ status: 200, count: result[0].count });
    });
};