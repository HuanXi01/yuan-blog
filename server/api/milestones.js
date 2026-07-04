const db = require('../db/index');
const logger = require('../utils/logger');

exports.getAllMilestones = (req, res) => {
    const sql = 'SELECT * FROM milestones ORDER BY target_date ASC';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取里程碑失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取里程碑失败' });
        }
        logger.info(`获取里程碑成功: ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};

exports.getMilestoneById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM milestones WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('获取里程碑失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '获取里程碑失败' });
        }
        if (result.length === 0) {
            logger.warn('里程碑不存在', { id: id });
            return res.send({ status: 404, message: '里程碑不存在' });
        }
        logger.info(`获取里程碑成功: id=${id}`);
        res.send({ status: 200, data: result[0] });
    });
};

exports.addMilestone = (req, res) => {
    const { title, icon, description, target_date, color, category } = req.body;
    const sql = 'INSERT INTO milestones (title, icon, description, target_date, color, category) VALUES (?, ?, ?, ?, ?, ?)';
    const formattedTargetDate = target_date && target_date.trim() !== '' ? target_date : null;
    db.query(sql, [title, icon, description, formattedTargetDate, color, category], (err, result) => {
        if (err) {
            logger.error('添加里程碑失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '添加失败' });
        }
        logger.info(`添加里程碑成功: id=${result.insertId}, title=${title}`);
        res.send({ status: 200, message: '添加成功', insertId: result.insertId });
    });
};

exports.updateMilestone = (req, res) => {
    const { id, title, icon, description, target_date, actual_date, is_unlocked, color, category } = req.body;
    const sql = 'UPDATE milestones SET title=?, icon=?, description=?, target_date=?, actual_date=?, is_unlocked=?, color=?, category=?, updated_at=CURRENT_TIMESTAMP WHERE id=?';
    const formattedTargetDate = target_date && target_date.trim() !== '' ? target_date : null;
    const formattedActualDate = actual_date && actual_date.trim() !== '' ? actual_date : null;
    db.query(sql, [title, icon, description, formattedTargetDate, formattedActualDate, is_unlocked, color, category, id], (err, result) => {
        if (err) {
            logger.error('更新里程碑失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新里程碑失败: 里程碑不存在', { id: id });
            return res.send({ status: 404, message: '里程碑不存在' });
        }
        logger.info(`更新里程碑成功: id=${id}, title=${title}`);
        res.send({ status: 200, message: '更新成功' });
    });
};

exports.deleteMilestone = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM milestones WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('删除里程碑失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '删除失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('删除里程碑失败: 里程碑不存在', { id: id });
            return res.send({ status: 404, message: '里程碑不存在' });
        }
        logger.info(`删除里程碑成功: id=${id}`);
        res.send({ status: 200, message: '删除成功' });
    });
};

exports.getUnlockedMilestones = (req, res) => {
    const sql = 'SELECT * FROM milestones WHERE is_unlocked = 1 ORDER BY target_date DESC LIMIT 8';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取已解锁里程碑失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取里程碑失败' });
        }
        logger.info(`获取已解锁里程碑成功: ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};