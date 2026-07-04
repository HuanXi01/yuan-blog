const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const router = require('./router');
const multer = require('multer');
const logger = require('./utils/logger');
const { handleVideoUpload } = require('./utils/videoConverter');

logger.info('服务器启动中...');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/pImages', express.static(path.join(__dirname, '../public/pImages')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        params: req.params,
        query: req.query,
        body: req.body ? JSON.stringify(req.body).substring(0, 500) : null
    });
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        cb(null, `${timestamp}_${random}${ext}`);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        logger.warn('文件上传失败: 未选择文件');
        return res.send({ status: 400, message: '请选择文件' });
    }
    
    logger.info(`开始处理上传文件: ${req.file.originalname}, 大小: ${req.file.size} bytes, 类型: ${req.file.mimetype}`);
    
    try {
        const filePath = await handleVideoUpload(req.file);
        logger.info(`文件上传成功: ${filePath}`);
        res.send({ status: 200, message: '上传成功', data: { url: filePath } });
    } catch (error) {
        logger.error(`文件上传处理失败: ${error.message}`);
        res.send({ status: 200, message: '上传成功（使用原文件）', data: { url: `/uploads/${req.file.filename}` } });
    }
});

app.post('/api/upload/multiple', upload.array('files', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        logger.warn('多文件上传失败: 未选择文件');
        return res.send({ status: 400, message: '请选择文件' });
    }
    
    try {
        const files = await Promise.all(req.files.map(async file => {
            const url = await handleVideoUpload(file);
            return {
                url: url,
                name: file.originalname,
                type: file.mimetype
            };
        }));
        logger.info(`多文件上传成功: ${files.length}个文件`);
        res.send({ status: 200, message: '上传成功', data: files });
    } catch (error) {
        logger.error(`多文件上传处理失败: ${error.message}`);
        const files = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            type: file.mimetype
        }));
        res.send({ status: 500, message: '部分文件处理失败', data: files });
    }
});

app.post('/api/log', (req, res) => {
    const { level = 'info', message, data } = req.body;
    if (logger[level]) {
        logger[level](`[前端日志] ${message}`, data);
    } else {
        logger.info(`[前端日志] ${message}`, data);
    }
    res.send({ status: 200, message: '日志已记录' });
});

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`服务器启动成功，后端接口地址 http://localhost:${PORT}`);
});