const db = require('../db/index');
const logger = require('../utils/logger');

const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return null;
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    return dateStr;
};

exports.getAllGrowthData = (req, res) => {
    const sql = 'SELECT * FROM growth_data ORDER BY measure_date DESC';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取成长数据失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取数据失败' });
        }
        logger.info(`获取成长数据成功: ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};

exports.getGrowthById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM growth_data WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('获取成长数据失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '获取数据失败' });
        }
        if (result.length === 0) {
            logger.warn('成长数据不存在', { id: id });
            return res.send({ status: 404, message: '数据不存在' });
        }
        logger.info(`获取成长数据成功: id=${id}`);
        res.send({ status: 200, data: result[0] });
    });
};

exports.addGrowthData = (req, res) => {
    const { measure_date, height, weight, head_circumference, note } = req.body;
    const sql = 'INSERT INTO growth_data (measure_date, height, weight, head_circumference, note) VALUES (?, ?, ?, ?, ?)';
    const formattedDate = formatDate(measure_date);
    db.query(sql, [formattedDate, height, weight, head_circumference, note], (err, result) => {
        if (err) {
            logger.error('添加成长数据失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '添加失败' });
        }
        logger.info(`添加成长数据成功: id=${result.insertId}, date=${measure_date}`);
        res.send({ status: 200, message: '添加成功', insertId: result.insertId });
    });
};

exports.updateGrowthData = (req, res) => {
    const { id, measure_date, height, weight, head_circumference, note } = req.body;
    const sql = 'UPDATE growth_data SET measure_date=?, height=?, weight=?, head_circumference=?, note=?, updated_at=CURRENT_TIMESTAMP WHERE id=?';
    const formattedDate = formatDate(measure_date);
    db.query(sql, [formattedDate, height, weight, head_circumference, note, id], (err, result) => {
        if (err) {
            logger.error('更新成长数据失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新成长数据失败: 数据不存在', { id: id });
            return res.send({ status: 404, message: '数据不存在' });
        }
        logger.info(`更新成长数据成功: id=${id}, date=${measure_date}`);
        res.send({ status: 200, message: '更新成功' });
    });
};

exports.deleteGrowthData = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM growth_data WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('删除成长数据失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '删除失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('删除成长数据失败: 数据不存在', { id: id });
            return res.send({ status: 404, message: '数据不存在' });
        }
        logger.info(`删除成长数据成功: id=${id}`);
        res.send({ status: 200, message: '删除成功' });
    });
};

exports.getChartData = (req, res) => {
    const sql = 'SELECT measure_date, height, weight FROM growth_data ORDER BY measure_date ASC';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取图表数据失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取数据失败' });
        }
        logger.info(`获取图表数据成功: ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};