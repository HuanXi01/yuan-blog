const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db;
let dbReady = false;
let readyCallback = null;

let dbPath;
if (process.env.FC_FUNC_CODE_PATH) {
    dbPath = path.join('/tmp', 'yuan_blog.db');
} else {
    dbPath = path.join(__dirname, '../data/yuan_blog.db');
}

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const initDb = async () => {
    try {
        const SQL = await initSqlJs({
            locateFile: file => path.join(__dirname, '../node_modules/sql.js/dist/', file)
        });
        
        let dbBuffer = null;
        if (fs.existsSync(dbPath)) {
            dbBuffer = fs.readFileSync(dbPath);
        }
        
        db = new SQL.Database(dbBuffer);
        
        const saveDb = () => {
            try {
                const data = db.export();
                fs.writeFileSync(dbPath, Buffer.from(data));
            } catch (e) {
                console.error('保存数据库失败:', e.message);
            }
        };
        
        db.save = saveDb;
        
        initDatabase();
        
        dbReady = true;
        console.log('数据库连接成功');
        
        if (readyCallback) {
            readyCallback();
        }
    } catch (err) {
        console.error('数据库连接失败:', err.message);
    }
};

const initDatabase = () => {
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nickname TEXT,
            role TEXT DEFAULT 'user',
            is_admin INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS about (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            baby_name TEXT,
            birth_date TEXT,
            days_born INTEGER,
            footer_message TEXT,
            avatar TEXT,
            birth_weight REAL,
            birth_height REAL,
            nickname_meaning TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS timeline_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            images TEXT,
            videos TEXT,
            record_date TEXT,
            month_age INTEGER,
            category TEXT DEFAULT '其他',
            icon TEXT DEFAULT 'star',
            color TEXT DEFAULT '#FFD700',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS milestones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            icon TEXT DEFAULT 'star',
            description TEXT,
            target_date TEXT,
            actual_date TEXT,
            is_unlocked INTEGER DEFAULT 0,
            color TEXT DEFAULT '#4CAF50',
            category TEXT DEFAULT '成长',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS diaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            cover_image TEXT,
            publish_date TEXT,
            month_age INTEGER,
            summary TEXT,
            view_count INTEGER DEFAULT 0,
            images TEXT,
            videos TEXT,
            is_published INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS growth (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            measure_date TEXT NOT NULL,
            weight REAL,
            height REAL,
            head_circumference REAL,
            month_age INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            content TEXT NOT NULL,
            avatar TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS city_stats_1507 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            city_name TEXT UNIQUE NOT NULL,
            total_tickets INTEGER DEFAULT 0,
            min_price REAL,
            max_price REAL,
            avg_price REAL,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`
    ];
    
    try {
        tables.forEach(sql => db.run(sql));
        console.log('数据库初始化完成');
        initDefaultData();
    } catch (err) {
        console.error('数据库初始化失败:', err.message);
    }
};

const initDefaultData = () => {
    try {
        const userResult = db.exec('SELECT COUNT(*) as count FROM users');
        if (userResult.length > 0 && userResult[0].values.length > 0 && userResult[0].values[0][0] === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync('1234', 10);
            db.run('INSERT INTO users (username, password, nickname, role, is_admin) VALUES (?, ?, ?, ?, ?)', 
                ['admin', hashedPassword, '管理员', 'admin', 1]);
            db.save();
            console.log('默认管理员账号已创建');
        }
        
        const aboutResult = db.exec('SELECT COUNT(*) as count FROM about');
        if (aboutResult.length > 0 && aboutResult[0].values.length > 0 && aboutResult[0].values[0][0] === 0) {
            db.run('INSERT INTO about (baby_name, birth_date, days_born, footer_message, avatar, birth_weight, birth_height, nickname_meaning) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                ['宇安', '2026-04-27', 0, '慢慢长大，岁岁平安', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20asian%20baby%20portrait%20soft%20beige%20background%20warm%20natural%20lighting%20peaceful%20expression%20wearing%20white%20onesie&image_size=square', 3.5, 50, '宇是宇宙的宇，安是平安的安，希望你胸怀宇宙，一生平安']);
            db.save();
            console.log('默认关于信息已创建');
        }
        
        const timelineResult = db.exec('SELECT COUNT(*) as count FROM timeline_records');
        if (timelineResult.length > 0 && timelineResult[0].values.length > 0 && timelineResult[0].values[0][0] === 0) {
            db.run('INSERT INTO timeline_records (title, content, record_date, month_age, category, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['第一次微笑', '今天宝宝第一次对着妈妈笑了，心都融化了', '2026-05-15', 1, '成长', 'smile', '#FF69B4']);
            db.run('INSERT INTO timeline_records (title, content, record_date, month_age, category, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['满月啦', '今天宝宝满月了，全家一起庆祝', '2026-05-27', 1, '纪念日', 'cake', '#FFD700']);
            db.run('INSERT INTO timeline_records (title, content, record_date, month_age, category, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['会翻身了', '宝宝第一次自己翻身成功', '2026-06-10', 2, '成长', 'refresh-cw', '#4CAF50']);
            db.run('INSERT INTO timeline_records (title, content, record_date, month_age, category, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['百天照', '今天拍了百天照，宝宝好配合', '2026-08-04', 3, '纪念日', 'camera', '#2196F3']);
            db.save();
            console.log('默认时光轴记录已创建');
        }
        
        const milestoneResult = db.exec('SELECT COUNT(*) as count FROM milestones');
        if (milestoneResult.length > 0 && milestoneResult[0].values.length > 0 && milestoneResult[0].values[0][0] === 0) {
            db.run('INSERT INTO milestones (title, icon, description, target_date, actual_date, is_unlocked, color, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                ['出生', 'baby', '来到这个美丽的世界', '2026-04-27', '2026-04-27', 1, '#FF6B6B', '成长']);
            db.run('INSERT INTO milestones (title, icon, description, target_date, actual_date, is_unlocked, color, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                ['满月', 'moon', '出生满一个月，庆祝小生命的第一个里程碑', '2026-05-27', '2026-05-27', 1, '#FFD700', '成长']);
            db.run('INSERT INTO milestones (title, icon, description, target_date, is_unlocked, color, category) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['百天', 'sun', '出生满一百天，期待宝宝的百天照', '2026-08-04', 0, '#FFA500', '成长']);
            db.run('INSERT INTO milestones (title, icon, description, target_date, is_unlocked, color, category) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                ['会走路', 'footprints', '迈出人生第一步', '2026-10-27', 0, '#4CAF50', '成长']);
            db.save();
            console.log('默认里程碑已创建');
        }
    } catch (err) {
        console.error('初始化默认数据失败:', err.message);
    }
};

const parseArgs = (sql, params, callback) => {
    if (typeof params === 'function') {
        return { sql, params: [], callback: params };
    }
    if (!params) {
        return { sql, params: [], callback };
    }
    return { sql, params, callback };
};

const get = (sql, params, callback) => {
    const { sql: s, params: p, callback: cb } = parseArgs(sql, params, callback);
    
    if (!dbReady) {
        if (cb) cb(new Error('数据库未初始化'), null);
        return null;
    }
    try {
        const stmt = db.prepare(s);
        if (p && Array.isArray(p) && p.length > 0) {
            stmt.bind(p);
        }
        let result = null;
        if (stmt.step()) {
            result = stmt.getAsObject();
        }
        stmt.free();
        if (cb) {
            cb(null, result);
        }
        return result;
    } catch (err) {
        if (cb) {
            cb(err, null);
        }
        return null;
    }
};

const all = (sql, params, callback) => {
    const { sql: s, params: p, callback: cb } = parseArgs(sql, params, callback);
    
    if (!dbReady) {
        if (cb) cb(new Error('数据库未初始化'), []);
        return [];
    }
    try {
        const stmt = db.prepare(s);
        if (p && Array.isArray(p) && p.length > 0) {
            stmt.bind(p);
        }
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.getAsObject());
        }
        stmt.free();
        if (cb) {
            cb(null, rows);
        }
        return rows;
    } catch (err) {
        if (cb) {
            cb(err, []);
        }
        return [];
    }
};

const run = (sql, params, callback) => {
    const { sql: s, params: p, callback: cb } = parseArgs(sql, params, callback);
    
    if (!dbReady) {
        if (cb) cb(new Error('数据库未初始化'));
        return { changes: 0, lastID: 0 };
    }
    try {
        const stmt = db.prepare(s);
        if (p && Array.isArray(p) && p.length > 0) {
            stmt.bind(p);
        }
        stmt.step();
        stmt.free();
        db.save();
        
        const changes = db.getRowsModified();
        
        if (cb) {
            const ctx = { changes, lastID: changes > 0 ? db.getRowsModified() : 0 };
            cb.call(ctx, null);
        }
        return { changes, lastID: changes > 0 ? db.getRowsModified() : 0 };
    } catch (err) {
        if (cb) {
            cb(err);
        }
        return { changes: 0, lastID: 0 };
    }
};

const exec = (sql, callback) => {
    if (!dbReady) {
        if (callback) callback(new Error('数据库未初始化'));
        return;
    }
    try {
        db.exec(sql);
        db.save();
        if (callback) {
            callback(null);
        }
    } catch (err) {
        if (callback) {
            callback(err);
        }
    }
};

const query = (sql, params, callback) => {
    const { sql: s, params: p, callback: cb } = parseArgs(sql, params, callback);
    
    if (!dbReady) {
        if (cb) cb(new Error('数据库未初始化'), []);
        return [];
    }
    
    const isSelect = s.trim().toUpperCase().startsWith('SELECT');
    const isInsert = s.trim().toUpperCase().startsWith('INSERT');
    const isUpdate = s.trim().toUpperCase().startsWith('UPDATE');
    const isDelete = s.trim().toUpperCase().startsWith('DELETE');
    
    if (isSelect) {
        try {
            const stmt = db.prepare(s);
            if (p && Array.isArray(p) && p.length > 0) {
                stmt.bind(p);
            }
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            if (cb) {
                cb(null, rows);
            }
            return rows;
        } catch (err) {
            if (cb) {
                cb(err, []);
            }
            return [];
        }
    } else {
        try {
            const stmt = db.prepare(s);
            if (p && Array.isArray(p) && p.length > 0) {
                stmt.bind(p);
            }
            stmt.step();
            stmt.free();
            db.save();
            
            const changes = db.getRowsModified();
            const lastID = db.getRowsModified() > 0 ? db.prepare('SELECT last_insert_rowid() as id').step().getAsObject().id : 0;
            
            const result = {
                affectedRows: changes,
                insertId: lastID,
                changes: changes,
                lastID: lastID
            };
            
            if (cb) {
                cb(null, result);
            }
            return result;
        } catch (err) {
            if (cb) {
                cb(err, { affectedRows: 0, insertId: 0 });
            }
            return { affectedRows: 0, insertId: 0 };
        }
    }
};

const waitForDb = (callback) => {
    if (dbReady) {
        callback();
    } else {
        readyCallback = callback;
    }
};

module.exports = {
    get,
    all,
    run,
    exec,
    query,
    waitForDb
};

initDb();
