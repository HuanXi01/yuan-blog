const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

const getDateStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const logToFile = (level, message, data) => {
    const timestamp = getTimestamp();
    const dateStr = getDateStr();
    const logFile = path.join(logDir, `${dateStr}.log`);
    
    let logContent = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (data) {
        logContent += ` | ${typeof data === 'string' ? data : JSON.stringify(data)}`;
    }
    logContent += '\n';
    
    console.log(logContent.trim());
    
    fs.appendFile(logFile, logContent, (err) => {
        if (err) {
            console.error('写入日志文件失败:', err);
        }
    });
};

const logger = {
    info: (message, data) => logToFile('info', message, data),
    warn: (message, data) => logToFile('warn', message, data),
    error: (message, data) => logToFile('error', message, data),
    debug: (message, data) => logToFile('debug', message, data)
};

module.exports = logger;