const db = require('../db/index');
const logger = require('../utils/logger');

const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return null;
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    return dateStr;
};

exports.getAllRecords = (req, res) => {
    const { page = 1, pageSize = 20, month } = req.query;
    const offset = (page - 1) * pageSize;
    
    let sql = 'SELECT * FROM timeline_records WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM timeline_records WHERE 1=1';
    let params = [];
    
    if (month) {
        const [year, m] = month.split('-');
        sql += ' AND YEAR(record_date) = ? AND MONTH(record_date) = ?';
        countSql += ' AND YEAR(record_date) = ? AND MONTH(record_date) = ?';
        params.push(year, m, year, m);
    }
    
    sql += ' ORDER BY record_date DESC LIMIT ?, ?';
    params.push(offset, parseInt(pageSize));
    
    db.query(countSql, params.slice(0, -2), (countErr, countResult) => {
        if (countErr) {
            logger.error('获取时光轴总数失败', { error: countErr.message, sql: countSql });
            return res.send({ status: 400, message: '获取总数失败' });
        }
        
        db.query(sql, params, (err, result) => {
            if (err) {
                logger.error('获取时光轴记录失败', { error: err.message, sql: sql });
                return res.send({ status: 400, message: '获取记录失败' });
            }
            logger.info(`获取时光轴记录成功: ${result.length}条`);
            res.send({
                status: 200,
                data: result,
                total: countResult[0].total
            });
        });
    });
};

exports.getRecordById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM timeline_records WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('获取时光轴记录失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '获取记录失败' });
        }
        if (result.length === 0) {
            logger.warn('时光轴记录不存在', { id: id });
            return res.send({ status: 404, message: '记录不存在' });
        }
        logger.info(`获取时光轴记录成功: id=${id}`);
        res.send({ status: 200, data: result[0] });
    });
};

exports.addRecord = (req, res) => {
    const { title, content, images, videos, record_date, month_age } = req.body;
    const sql = 'INSERT INTO timeline_records (title, content, images, videos, record_date, month_age) VALUES (?, ?, ?, ?, ?, ?)';
    const formattedDate = formatDate(record_date);
    db.query(sql, [title, content, images, videos, formattedDate, month_age], (err, result) => {
        if (err) {
            logger.error('添加时光轴记录失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '添加失败' });
        }
        logger.info(`添加时光轴记录成功: id=${result.insertId}, title=${title}`);
        res.send({ status: 200, message: '添加成功', insertId: result.insertId });
    });
};

exports.updateRecord = (req, res) => {
    const { id, title, content, images, videos, record_date, month_age } = req.body;
    const sql = 'UPDATE timeline_records SET title=?, content=?, images=?, videos=?, record_date=?, month_age=?, updated_at=CURRENT_TIMESTAMP WHERE id=?';
    const formattedDate = formatDate(record_date);
    db.query(sql, [title, content, images, videos, formattedDate, month_age, id], (err, result) => {
        if (err) {
            logger.error('更新时光轴记录失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新时光轴记录失败: 记录不存在', { id: id });
            return res.send({ status: 404, message: '记录不存在' });
        }
        logger.info(`更新时光轴记录成功: id=${id}, title=${title}`);
        res.send({ status: 200, message: '更新成功' });
    });
};

exports.deleteRecord = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM timeline_records WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('删除时光轴记录失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '删除失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('删除时光轴记录失败: 记录不存在', { id: id });
            return res.send({ status: 404, message: '记录不存在' });
        }
        logger.info(`删除时光轴记录成功: id=${id}`);
        res.send({ status: 200, message: '删除成功' });
    });
};

exports.getLatestRecords = (req, res) => {
    const { limit = 4 } = req.query;
    const sql = 'SELECT * FROM timeline_records ORDER BY record_date DESC LIMIT ?';
    db.query(sql, [parseInt(limit)], (err, result) => {
        if (err) {
            logger.error('获取最新时光轴记录失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取记录失败' });
        }
        logger.info(`获取最新时光轴记录成功: ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};

exports.getMonthList = (req, res) => {
    const sql = 'SELECT DISTINCT DATE_FORMAT(record_date, "%Y-%m") as month FROM timeline_records ORDER BY month DESC';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取时光轴月份列表失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取月份列表失败' });
        }
        logger.info(`获取时光轴月份列表成功: ${result.length}个月份`);
        res.send({ status: 200, data: result.map(item => item.month) });
    });
};

exports.getRecordByDate = (req, res) => {
    const { date } = req.query;
    const sql = 'SELECT * FROM timeline_records WHERE DATE(record_date) = ?';
    db.query(sql, [date], (err, result) => {
        if (err) {
            logger.error('按日期获取时光轴记录失败', { error: err.message, sql: sql, date: date });
            return res.send({ status: 400, message: '获取记录失败' });
        }
        logger.info(`按日期获取时光轴记录成功: date=${date}, ${result.length}条`);
        res.send({ status: 200, data: result });
    });
};