const db = require('../db/index');
const logger = require('../utils/logger');

exports.getAbout = (req, res) => {
    const sql = 'SELECT * FROM about_config LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) {
            logger.error('获取关于信息失败', { error: err.message, sql: sql });
            return res.send({ status: 400, message: '获取信息失败' });
        }
        if (result.length === 0) {
            logger.warn('关于信息不存在');
            return res.send({ status: 404, message: '信息不存在' });
        }
        const data = result[0];
        const birthDate = new Date(data.birth_date);
        const today = new Date();
        const diffTime = Math.abs(today - birthDate);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        
        logger.info(`获取关于信息成功: baby_name=${data.baby_name}`);
        res.send({
            status: 200,
            data: {
                ...data,
                days_born: days,
                month_age: `${months}个月${remainingDays}天`
            }
        });
    });
};

exports.updateAbout = (req, res) => {
    const { baby_name, birth_date, birth_weight, birth_height, nickname_meaning, site_description, welcome_message, footer_message } = req.body;
    const sql = 'UPDATE about_config SET baby_name=?, birth_date=?, birth_weight=?, birth_height=?, nickname_meaning=?, site_description=?, welcome_message=?, footer_message=?, updated_at=CURRENT_TIMESTAMP WHERE id=1';
    db.query(sql, [baby_name, birth_date, birth_weight, birth_height, nickname_meaning, site_description, welcome_message, footer_message], (err, result) => {
        if (err) {
            logger.error('更新关于信息失败', { error: err.message, sql: sql, data: req.body });
            return res.send({ status: 400, message: '更新失败' });
        }
        if (result.affectedRows === 0) {
            logger.warn('更新关于信息失败: 记录不存在');
            return res.send({ status: 404, message: '记录不存在' });
        }
        logger.info(`更新关于信息成功: baby_name=${baby_name}`);
        res.send({ status: 200, message: '更新成功' });
    });
};