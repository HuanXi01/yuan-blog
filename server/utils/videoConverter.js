const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'];

function isVideoFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return VIDEO_EXTENSIONS.includes(ext);
}

function convertVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac -b:v 1500k -b:a 128k -movflags +faststart -y "${outputPath}"`;
        
        logger.info(`开始视频转码: ${inputPath} -> ${outputPath}`);
        
        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                if (error.code === 127) {
                    logger.warn('FFmpeg 未找到，跳过转码');
                } else {
                    logger.error(`视频转码失败: ${error.message}`);
                    logger.error(`FFmpeg stderr: ${stderr}`);
                }
                reject(error);
                return;
            }
            
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                if (stats.size > 0) {
                    logger.info(`视频转码成功: ${outputPath} (大小: ${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
                    resolve(outputPath);
                } else {
                    logger.error(`视频转码后文件为空: ${outputPath}`);
                    reject(new Error('转码后文件为空'));
                }
            } else {
                logger.error(`视频转码后文件不存在: ${outputPath}`);
                reject(new Error('转码后文件不存在'));
            }
        });
        
        child.stderr.on('data', (data) => {
            logger.debug(`FFmpeg progress: ${data.toString().trim()}`);
        });
    });
}

async function handleVideoUpload(file) {
    const filename = file.filename;
    
    if (!isVideoFile(filename)) {
        return `/uploads/${filename}`;
    }
    
    const inputPath = file.path;
    const ext = path.extname(filename);
    const baseName = filename.replace(ext, '');
    const outputFilename = `${baseName}_converted.mp4`;
    const outputPath = path.join(path.dirname(inputPath), outputFilename);
    
    try {
        await convertVideo(inputPath, outputPath);
        
        fs.unlink(inputPath, (err) => {
            if (err) {
                logger.warn(`删除原视频文件失败: ${inputPath}`);
            }
        });
        
        return `/uploads/${outputFilename}`;
    } catch (error) {
        logger.warn(`视频转码失败，使用原文件: ${filename} (错误: ${error.message})`);
        return `/uploads/${filename}`;
    }
}

module.exports = {
    isVideoFile,
    convertVideo,
    handleVideoUpload
};