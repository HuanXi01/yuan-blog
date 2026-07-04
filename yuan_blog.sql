CREATE DATABASE IF NOT EXISTS yuan_blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yuan_blog;

CREATE TABLE IF NOT EXISTS about_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    baby_name VARCHAR(50) NOT NULL DEFAULT '宇安',
    birth_date DATE NOT NULL DEFAULT '2026-01-01',
    birth_weight DECIMAL(5,2) NOT NULL DEFAULT 3.50,
    birth_height INT NOT NULL DEFAULT 50,
    nickname_meaning TEXT,
    site_description TEXT,
    welcome_message TEXT,
    footer_message VARCHAR(200) DEFAULT '慢慢长大，岁岁平安',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO about_config (baby_name, birth_date, birth_weight, birth_height, nickname_meaning, site_description, welcome_message) VALUES 
('宇安', '2026-01-01', 3.50, 50, '宇：宇宙之大，安：平安喜乐。愿你在广阔天地间，平安快乐地成长。', '记录宇安成长的每一个珍贵瞬间，让爱与温暖伴随每一天。', '欢迎来到我的小世界');

CREATE TABLE IF NOT EXISTS timeline_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    images TEXT,
    videos TEXT,
    record_date DATE NOT NULL,
    month_age VARCHAR(20) DEFAULT '',
    is_featured TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_record_date (record_date)
);

INSERT INTO timeline_records (title, content, images, record_date, month_age, is_featured) VALUES 
('第一次微笑', '今天宇安第一次对我笑了，眼睛弯弯的，心都融化了～', 'baby_smile.jpg', '2026-01-20', '0个月19天', 1),
('满月啦', '今天是宇安满月的日子，爸爸妈妈祝你健康快乐成长！', 'baby_fullmoon.jpg', '2026-02-01', '1个月0天', 1),
('第一次抬头', '小家伙自己把头抬起来了，虽然还不太稳，但已经很棒了！', 'baby_headup.jpg', '2026-02-15', '1个月14天', 1),
('百天纪念', '一百天啦，时间过得好快，我的宝贝已经是个小大人了', 'baby_100days.jpg', '2026-04-10', '3个月9天', 1),
('第一次翻身', '今天成功从仰卧翻到侧卧了，太厉害了！', 'baby_rollover.jpg', '2026-04-25', '3个月24天', 1),
('长出第一颗牙', '下面的小门牙冒出来了，吃奶的时候会咬我了～', 'baby_tooth.jpg', '2026-06-01', '5个月0天', 1);

CREATE TABLE IF NOT EXISTS milestones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'star',
    description TEXT,
    target_date DATE,
    actual_date DATE NULL,
    is_unlocked TINYINT(1) DEFAULT 0,
    color VARCHAR(20) DEFAULT '#FFD93D',
    category VARCHAR(50) DEFAULT 'development',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_target_date (target_date)
);

INSERT INTO milestones (title, icon, description, target_date, actual_date, is_unlocked, color) VALUES 
('满月', 'moon', '出生满一个月，庆祝小生命的第一个里程碑', '2026-02-01', '2026-02-01', 1, '#FFD93D'),
('百天', 'cake', '出生满一百天，传统习俗中的重要日子', '2026-04-10', '2026-04-10', 1, '#FF6B9D'),
('第一次微笑', 'smile', '有意识地对人微笑，开始社交互动', '2026-01-25', '2026-01-20', 1, '#6BCB77'),
('第一次抬头', 'arrow-up', '能够自主抬头，锻炼颈部力量', '2026-02-20', '2026-02-15', 1, '#4D96FF'),
('第一次翻身', 'refresh-cw', '从仰卧翻到侧卧或俯卧', '2026-05-01', '2026-04-25', 1, '#FFD93D'),
('长出第一颗牙', 'tooth', '乳牙开始萌出', '2026-06-01', '2026-06-01', 1, '#FF6B6B'),
('独坐', 'user', '不需要支撑独自坐着', '2026-07-01', NULL, 0, '#6BCB77'),
('爬行', 'footprints', '开始用四肢爬行移动', '2026-08-01', NULL, 0, '#4D96FF'),
('站立', 'accessibility', '能够扶着东西站立', '2026-09-01', NULL, 0, '#FFD93D'),
('第一次叫妈妈', 'volume-2', '有意识地发出妈妈的音', '2026-07-15', NULL, 0, '#FF6B9D'),
('一周岁', 'gift', '出生满一年，生日快乐！', '2027-01-01', NULL, 0, '#FF6B6B'),
('走路', 'footprints', '能够独立行走', '2027-02-01', NULL, 0, '#6BCB77');

CREATE TABLE IF NOT EXISTS diaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    cover_image VARCHAR(255),
    images TEXT,
    videos TEXT,
    publish_date DATE NOT NULL,
    month_age VARCHAR(20) DEFAULT '',
    summary VARCHAR(300),
    is_published TINYINT(1) DEFAULT 1,
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_publish_date (publish_date)
);

INSERT INTO diaries (title, content, cover_image, publish_date, month_age, summary) VALUES 
('写给宇安的第一封信', '亲爱的宇安宝贝：\n\n今天是你来到这个世界的第30天，妈妈想写一封信给你。\n\n这30天里，有辛苦，有疲惫，但更多的是幸福和感动。每天看着你熟睡的小脸，听着你咿咿呀呀的声音，妈妈觉得一切都值得。\n\n愿你健康快乐地成长，拥有一个充满爱与温暖的童年。\n\n爱你的妈妈', 'diary_letter.jpg', '2026-02-01', '1个月0天', '写给宇安的第一封信，记录满月时的心情'),
('宇安的百天成长记录', '时间过得真快，转眼间宇安已经一百天了。\n\n回顾这一百天，宇安从一个只会哭的小婴儿，变成了一个会笑、会抬头、会翻身的小宝贝。\n\n成长的每一天都是惊喜，爸爸妈妈会陪你一起走过每一个阶段。', 'diary_100days.jpg', '2026-04-10', '3个月9天', '记录宇安百天的成长变化'),
('第一次带宇安出门', '今天天气很好，带宇安第一次出门晒太阳。\n\n小家伙很兴奋，眼睛一直好奇地东张西望，看什么都觉得新鲜。\n\n希望以后能带你去更多地方，看更美的风景。', 'diary_outdoor.jpg', '2026-03-15', '2个月14天', '第一次带宇安出门晒太阳的经历');

CREATE TABLE IF NOT EXISTS growth_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    measure_date DATE NOT NULL,
    height DECIMAL(5,1) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    head_circumference DECIMAL(5,1) NULL,
    note VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_measure_date (measure_date)
);

INSERT INTO growth_data (measure_date, height, weight, head_circumference, note) VALUES 
('2026-01-01', 50.0, 3.50, 34.0, '出生时'),
('2026-02-01', 56.5, 5.20, 37.5, '满月'),
('2026-03-01', 60.2, 6.30, 39.0, '两个月'),
('2026-04-01', 63.5, 7.10, 40.2, '三个月'),
('2026-04-10', 64.8, 7.50, 40.8, '百天'),
('2026-05-01', 67.0, 8.00, 41.5, '四个月'),
('2026-06-01', 69.5, 8.60, 42.2, '五个月');

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'guest',
    is_admin TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, nickname, role, is_admin) VALUES 
('admin', '21232f297a57a5a743894a0e4a801fc3', '管理员', 'admin', 1),
('baba', '21232f297a57a5a743894a0e4a801fc3', '爸爸', 'admin', 1),
('mama', '21232f297a57a5a743894a0e4a801fc3', '妈妈', 'admin', 1);

CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    nickname VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    is_admin_reply TINYINT(1) DEFAULT 0,
    reply_to INT NULL,
    message_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_message_date (message_date),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (reply_to) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO messages (user_id, nickname, content, is_admin_reply, reply_to, message_date) VALUES 
(NULL, '奶奶', '我的小宇安越来越可爱了，奶奶好想你！', 0, NULL, '2026-06-01'),
(NULL, '妈妈', '谢谢奶奶的关心，宇安也很想奶奶呢～', 1, 1, '2026-06-01'),
(NULL, '小姨', '宇安宝贝要快快长大呀，小姨给你买好多玩具！', 0, NULL, '2026-06-05'),
(NULL, '姑姑', '好期待下次见到宇安，一定又长漂亮了！', 0, NULL, '2026-06-10'),
(NULL, '爸爸', '宇安是爸爸的小宝贝，爸爸永远爱你！', 0, NULL, '2026-06-15');