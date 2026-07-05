let db = require('../db/index')
let md5 = require('md5')
const logger = require('../utils/logger')

exports.login = (req, res) => {
    let { username, password } = req.body
    if (!username || !password) {
        logger.warn('登录失败: 用户名或密码为空')
        return res.json({ status: 400, message: '用户名和密码不能为空' })
    }
    let sql = 'SELECT * FROM users WHERE username = ?'
    db.get(sql, [username], (err, user) => {
        if (err) {
            logger.error('登录失败: 数据库查询错误', { error: err.message, username: username })
            return res.json({ status: 500, message: '登录失败' })
        }
        if (!user) {
            logger.warn('登录失败: 用户名不存在', { username: username })
            return res.json({ status: 401, message: '用户名不存在' })
        }
        if (user.password !== md5(password)) {
            logger.warn('登录失败: 密码错误', { username: username })
            return res.json({ status: 401, message: '密码错误' })
        }
        logger.info(`登录成功: ${username}, role=${user.role}`)
        res.json({
            status: 200,
            message: '登录成功',
            data: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                role: user.role,
                is_admin: user.is_admin
            }
        })
    })
}

exports.register = (req, res) => {
    let { username, password, nickname } = req.body
    if (!username || !password) {
        logger.warn('注册失败: 用户名或密码为空')
        return res.json({ status: 400, message: '用户名和密码不能为空' })
    }
    let checkSql = 'SELECT * FROM users WHERE username = ?'
    db.get(checkSql, [username], (err, user) => {
        if (err) {
            logger.error('注册失败: 数据库查询错误', { error: err.message, username: username })
            return res.json({ status: 500, message: '注册失败' })
        }
        if (user) {
            logger.warn('注册失败: 用户名已存在', { username: username })
            return res.json({ status: 400, message: '用户名已存在' })
        }
        let insertSql = 'INSERT INTO users (username, password, nickname, role, is_admin) VALUES (?, ?, ?, ?, ?)'
        db.run(insertSql, [username, md5(password), nickname || '', 'user', 0], function(err) {
            if (err) {
                logger.error('注册失败: 数据库插入错误', { error: err.message, username: username })
                return res.json({ status: 500, message: '注册失败' })
            }
            logger.info(`注册成功: ${username}`)
            res.json({ status: 200, message: '注册成功' })
        })
    })
}

exports.getUserInfo = (req, res) => {
    let userId = req.query.id || req.body.userId
    if (!userId) {
        logger.warn('获取用户信息失败: 用户ID为空')
        return res.json({ status: 400, message: '用户ID不能为空' })
    }
    let sql = 'SELECT id, username, nickname, role, is_admin, created_at FROM users WHERE id = ?'
    db.get(sql, [userId], (err, user) => {
        if (err) {
            logger.error('获取用户信息失败: 数据库查询错误', { error: err.message, userId: userId })
            return res.json({ status: 500, message: '获取用户信息失败' })
        }
        if (!user) {
            logger.warn('获取用户信息失败: 用户不存在', { userId: userId })
            return res.json({ status: 404, message: '用户不存在' })
        }
        logger.info(`获取用户信息成功: userId=${userId}`)
        res.json({ status: 200, data: user })
    })
}

exports.getUsers = (req, res) => {
    let sql = 'SELECT id, username, nickname, role, is_admin, created_at FROM users ORDER BY created_at DESC'
    db.all(sql, (err, results) => {
        if (err) {
            logger.error('获取用户列表失败: 数据库查询错误', { error: err.message })
            return res.json({ status: 500, message: '获取用户列表失败' })
        }
        logger.info(`获取用户列表成功: ${results.length}个用户`)
        res.json({ status: 200, data: results })
    })
}

exports.updateUser = (req, res) => {
    let { id, username, nickname, password } = req.body
    if (!id) {
        logger.warn('更新用户失败: 用户ID为空')
        return res.json({ status: 400, message: '用户ID不能为空' })
    }
    let checkSql = 'SELECT * FROM users WHERE id = ?'
    db.get(checkSql, [id], (err, user) => {
        if (err) {
            logger.error('更新用户失败: 数据库查询错误', { error: err.message, id: id })
            return res.json({ status: 500, message: '更新失败' })
        }
        if (!user) {
            logger.warn('更新用户失败: 用户不存在', { id: id })
            return res.json({ status: 404, message: '用户不存在' })
        }
        if (username) {
            let checkUsernameSql = 'SELECT * FROM users WHERE username = ? AND id != ?'
            db.get(checkUsernameSql, [username, id], (checkErr, existingUser) => {
                if (checkErr) {
                    logger.error('更新用户失败: 用户名检查错误', { error: checkErr.message, username: username })
                    return res.json({ status: 500, message: '更新失败' })
                }
                if (existingUser) {
                    logger.warn('更新用户失败: 用户名已存在', { username: username })
                    return res.json({ status: 400, message: '用户名已存在' })
                }
                if (password && password.trim() !== '') {
                    let updateSql = 'UPDATE users SET username = ?, nickname = ?, password = ? WHERE id = ?'
                    db.run(updateSql, [username, nickname, md5(password), id], function(err) {
                        if (err) {
                            logger.error('更新用户失败: 数据库更新错误', { error: err.message, id: id })
                            return res.json({ status: 500, message: '更新失败' })
                        }
                        logger.info(`更新用户成功: id=${id}, username=${username}, nickname=${nickname}, password=updated`)
                        res.json({ status: 200, message: '更新成功' })
                    })
                } else {
                    let updateSql = 'UPDATE users SET username = ?, nickname = ? WHERE id = ?'
                    db.run(updateSql, [username, nickname, id], function(err) {
                        if (err) {
                            logger.error('更新用户失败: 数据库更新错误', { error: err.message, id: id })
                            return res.json({ status: 500, message: '更新失败' })
                        }
                        logger.info(`更新用户成功: id=${id}, username=${username}, nickname=${nickname}`)
                        res.json({ status: 200, message: '更新成功' })
                    })
                }
            })
        } else {
            if (password && password.trim() !== '') {
                let updateSql = 'UPDATE users SET nickname = ?, password = ? WHERE id = ?'
                db.run(updateSql, [nickname, md5(password), id], function(err) {
                    if (err) {
                        logger.error('更新用户失败: 数据库更新错误', { error: err.message, id: id })
                        return res.json({ status: 500, message: '更新失败' })
                    }
                    logger.info(`更新用户成功: id=${id}, nickname=${nickname}, password=updated`)
                    res.json({ status: 200, message: '更新成功' })
                })
            } else {
                let updateSql = 'UPDATE users SET nickname = ? WHERE id = ?'
                db.run(updateSql, [nickname, id], function(err) {
                    if (err) {
                        logger.error('更新用户失败: 数据库更新错误', { error: err.message, id: id })
                        return res.json({ status: 500, message: '更新失败' })
                    }
                    logger.info(`更新用户成功: id=${id}, nickname=${nickname}`)
                    res.json({ status: 200, message: '更新成功' })
                })
            }
        }
    })
}

exports.deleteUser = (req, res) => {
    let { id } = req.body
    if (!id) {
        logger.warn('删除用户失败: 用户ID为空')
        return res.json({ status: 400, message: '用户ID不能为空' })
    }
    let checkSql = 'SELECT * FROM users WHERE id = ?'
    db.get(checkSql, [id], (err, user) => {
        if (err) {
            logger.error('删除用户失败: 数据库查询错误', { error: err.message, id: id })
            return res.json({ status: 500, message: '删除失败' })
        }
        if (!user) {
            logger.warn('删除用户失败: 用户不存在', { id: id })
            return res.json({ status: 404, message: '用户不存在' })
        }
        if (user.role === 'admin') {
            logger.warn('删除用户失败: 管理员不可删除', { id: id, username: user.username })
            return res.json({ status: 403, message: '管理员不可删除' })
        }
        let deleteSql = 'DELETE FROM users WHERE id = ?'
        db.run(deleteSql, [id], function(err) {
            if (err) {
                logger.error('删除用户失败: 数据库删除错误', { error: err.message, id: id })
                return res.json({ status: 500, message: '删除失败' })
            }
            logger.info(`删除用户成功: id=${id}`)
            res.json({ status: 200, message: '删除成功' })
        })
    })
}
