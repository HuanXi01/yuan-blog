const db = require('../db/index');
const logger = require('../utils/logger');

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    return dateStr;
};

exports.getAllDiaries = (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    const sql = 'SELECT id, title, cover_image, publish_date, month_age, summary, view_count, images, videos FROM diaries WHERE is_published = 1 ORDER BY publish_date DESC LIMIT ?, ?';
    const countSql = 'SELECT COUNT(*) as total FROM diaries WHERE is_published = 1';
    
    db.query(countSql, (countErr, countResult) => {
        if (countErr) {
            logger.error('获取日记总数失败', { error: countErr.message, sql: countSql });
            return res.send({ status: 400, message: '获取总数失败' });
        }
        
        db.query(sql, [offset, parseInt(pageSize)], (err, result) => {
            if (err) {
                logger.error('获取日记失败', { error: err.message, sql: sql });
                return res.send({ status: 400, message: '获取日记失败' });
            }
            logger.info(`获取日记成功: ${result.length}条`);
            res.send({
                status: 200,
                data: result,
                total: countResult[0].total
            });
        });
    });
};

exports.getDiaryById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM diaries WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('获取日记失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '获取日记失败' });
        }
        if (result.length === 0) {
            logger.warn('日记不存在', { id: id });
            return res.send({ status: 404, message: '日记不存在' });
        }
        const updateSql = 'UPDATE diaries SET view_count = view_count + 1 WHERE id = ?';
        db.query(updateSql, [id], () => {});
        logger.info(`获取日记成功: id=${id}, title=${result[0].title}`);
        res.send({ status: 200, data: result[0] });
    });
};

exports.getPrevNextDiary = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT 
        (SELECT id FROM diaries WHERE id < ? AND is_published = 1 ORDER BY id DESC LIMIT 1) as prev_id,
        (SELECT id FROM diaries WHERE id > ? AND is_published = 1 ORDER BY id ASC LIMIT 1) as next_id,
        (SELECT title FROM diaries WHERE id < ? AND is_published = 1 ORDER BY id DESC LIMIT 1) as prev_title,
        (SELECT title FROM diaries WHERE id > ? AND is_published = 1 ORDER BY id ASC LIMIT 1) as next_title
    FROM diaries WHERE id = ?`;
    
    db.query(sql, [id, id, id, id, id], (err, result) => {
        if (err) {
            logger.error('获取前后日记失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '获取失败' });
        }
        logger.info(`获取前后日记成功: id=${id}`);
        res.send({ status: 200, data: result[0] });
    });
};

exports.addDiary = (req, res) => {
    const { title, content, cover_image, images, videos, publish_date, summary, month_age } = req.body;
    const formattedDate = formatDate(publish_date);
    const sql = 'INSERT INTO diaries (title, content, cover_image, images, videos, publish_date, summary, month_age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [title, content, cover_image, images, videos, formattedDate, summary, month_age], (err, result) => {
        if (err) {
            logger.error('添加日记失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '添加失败' });
        }
        logger.info(`添加日记成功: id=${result.insertId}, title=${title}`);
        res.send({ status: 200, message: '添加成功', insertId: result.insertId });
    });
};

exports.updateDiary = (req, res) => {
    const { id, title, content, cover_image, images, videos, publish_date, summary, month_age } = req.body;
    const formattedDate = formatDate(publish_date);
    const sql = 'UPDATE diaries SET title=?, content=?, cover_image=?, images=?, videos=?, publish_date=?, summary=?, month_age=?, updated_at=CURRENT_TIMESTAMP WHERE id=?';
    db.query(sql, [title, content, cover_image, images, videos, formattedDate, summary, month_age, id], (err, result) => {
        if (err) {
            logger.error('更新日记失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新日记失败: 日记不存在', { id: id });
            return res.send({ status: 404, message: '日记不存在' });
        }
        logger.info(`更新日记成功: id=${id}, title=${title}`);
        res.send({ status: 200, message: '更新成功' });
    });
};

exports.deleteDiary = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM diaries WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            logger.error('删除日记失败', { error: err.message, sql: sql, id: id });
            return res.send({ status: 400, message: '删除失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('删除日记失败: 日记不存在', { id: id });
            return res.send({ status: 404, message: '日记不存在' });
        }
        logger.info(`删除日记成功: id=${id}`);
        res.send({ status: 200, message: '删除成功' });
    });
};