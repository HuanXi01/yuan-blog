/*
 Navicat Premium Dump SQL

 Source Server         : secnicdb
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : localhost:3306
 Source Schema         : yuan_blog

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 04/07/2026 20:33:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for about_config
-- ----------------------------
DROP TABLE IF EXISTS `about_config`;
CREATE TABLE `about_config`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `baby_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '宇安',
  `birth_date` date NOT NULL DEFAULT '2026-01-01',
  `birth_weight` decimal(5, 2) NOT NULL DEFAULT 3.50,
  `birth_height` int NOT NULL DEFAULT 50,
  `nickname_meaning` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `site_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `welcome_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `footer_message` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '慢慢长大，岁岁平安',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of about_config
-- ----------------------------
INSERT INTO `about_config` VALUES (1, '宇安', '2026-04-27', 3.50, 50, '宇：宇宙之大，安：平安喜乐。愿你在广阔天地间，平安快乐地成长。', '记录宇安成长的每一个珍贵瞬间，让爱与温暖伴随每一天。', '欢迎来到我的小世界', '慢慢长大，岁岁平安', '2026-07-04 15:41:51', '2026-07-04 19:17:16');

-- ----------------------------
-- Table structure for diaries
-- ----------------------------
DROP TABLE IF EXISTS `diaries`;
CREATE TABLE `diaries`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `videos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `publish_date` date NOT NULL,
  `month_age` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `summary` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_published` tinyint(1) NULL DEFAULT 1,
  `view_count` int NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_publish_date`(`publish_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of diaries
-- ----------------------------
INSERT INTO `diaries` VALUES (4, '这是一个测试数据', '', '/uploads/1783152599365_d1xz7g74j.jpg', '/uploads/1783152603792_2hhgnb9u5.jpg', '/uploads/1783163363050_j1pss6yfl_converted.mp4', '2026-07-03', '', NULL, 1, 1, '2026-07-04 16:10:19', '2026-07-04 19:09:28');
INSERT INTO `diaries` VALUES (5, '测试添加日记功能', '这是一个测试数据', '/uploads/1783163446882_r1walrn8l.jpg', '/uploads/1783163453123_fm0yrfgy8.jpg', '/uploads/1783163462406_8eeo5jky1_converted.mp4', '2026-07-04', '', NULL, 1, 0, '2026-07-04 19:11:11', '2026-07-04 19:11:11');

-- ----------------------------
-- Table structure for growth_data
-- ----------------------------
DROP TABLE IF EXISTS `growth_data`;
CREATE TABLE `growth_data`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `measure_date` date NOT NULL,
  `height` decimal(5, 1) NOT NULL,
  `weight` decimal(5, 2) NOT NULL,
  `head_circumference` decimal(5, 1) NULL DEFAULT NULL,
  `note` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_measure_date`(`measure_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of growth_data
-- ----------------------------

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_admin_reply` tinyint(1) NULL DEFAULT 0,
  `reply_to` int NULL DEFAULT NULL,
  `message_date` date NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_message_date`(`message_date` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `reply_to`(`reply_to` ASC) USING BTREE,
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`reply_to`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO `messages` VALUES (1, NULL, '奶奶', '我的小宇安越来越可爱了，奶奶好想你！', NULL, 0, NULL, '2026-06-01', '2026-07-04 15:41:51');
INSERT INTO `messages` VALUES (2, NULL, '妈妈', '谢谢奶奶的关心，宇安也很想奶奶呢～', NULL, 1, 1, '2026-06-01', '2026-07-04 15:41:51');
INSERT INTO `messages` VALUES (3, NULL, '小姨', '宇安宝贝要快快长大呀，小姨给你买好多玩具！', NULL, 0, NULL, '2026-06-05', '2026-07-04 15:41:51');
INSERT INTO `messages` VALUES (4, NULL, '姑姑', '好期待下次见到宇安，一定又长漂亮了！', NULL, 0, NULL, '2026-06-10', '2026-07-04 15:41:51');
INSERT INTO `messages` VALUES (5, NULL, '爸爸', '宇安是爸爸的小宝贝，爸爸永远爱你！', NULL, 0, NULL, '2026-06-15', '2026-07-04 15:41:51');

-- ----------------------------
-- Table structure for milestones
-- ----------------------------
DROP TABLE IF EXISTS `milestones`;
CREATE TABLE `milestones`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'star',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `target_date` date NULL DEFAULT NULL,
  `actual_date` date NULL DEFAULT NULL,
  `is_unlocked` tinyint(1) NULL DEFAULT 0,
  `color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '#FFD93D',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'development',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_target_date`(`target_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of milestones
-- ----------------------------
INSERT INTO `milestones` VALUES (1, '满月', 'moon', '出生满一个月，庆祝小生命的第一个里程碑', '2026-05-27', '2026-07-27', 1, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:27:55');
INSERT INTO `milestones` VALUES (2, '百天', 'cake', '出生满一百天，传统习俗中的重要日子', NULL, NULL, 0, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:27:07');
INSERT INTO `milestones` VALUES (3, '第一次微笑', 'smile', '有意识地对人微笑，开始社交互动', NULL, NULL, 0, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:26:42');
INSERT INTO `milestones` VALUES (4, '第一次抬头', 'arrow-up', '能够自主抬头，锻炼颈部力量', NULL, NULL, 0, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:26:58');
INSERT INTO `milestones` VALUES (5, '第一次翻身', 'refresh-cw', '从仰卧翻到侧卧或俯卧', NULL, NULL, 0, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:27:19');
INSERT INTO `milestones` VALUES (6, '长出第一颗牙', 'tooth', '乳牙开始萌出', NULL, NULL, 0, NULL, NULL, '2026-07-04 15:41:51', '2026-07-04 19:27:28');
INSERT INTO `milestones` VALUES (7, '独坐', 'user', '不需要支撑独自坐着', '2026-07-01', NULL, 0, '#6BCB77', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');
INSERT INTO `milestones` VALUES (8, '爬行', 'footprints', '开始用四肢爬行移动', '2026-08-01', NULL, 0, '#4D96FF', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');
INSERT INTO `milestones` VALUES (9, '站立', 'accessibility', '能够扶着东西站立', '2026-09-01', NULL, 0, '#FFD93D', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');
INSERT INTO `milestones` VALUES (10, '第一次叫妈妈', 'volume-2', '有意识地发出妈妈的音', '2026-07-15', NULL, 0, '#FF6B9D', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');
INSERT INTO `milestones` VALUES (11, '一周岁', 'gift', '出生满一年，生日快乐！', '2027-01-01', NULL, 0, '#FF6B6B', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');
INSERT INTO `milestones` VALUES (12, '走路', 'footprints', '能够独立行走', '2027-02-01', NULL, 0, '#6BCB77', 'development', '2026-07-04 15:41:51', '2026-07-04 15:41:51');

-- ----------------------------
-- Table structure for timeline_records
-- ----------------------------
DROP TABLE IF EXISTS `timeline_records`;
CREATE TABLE `timeline_records`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `videos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `record_date` date NOT NULL,
  `month_age` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `is_featured` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_record_date`(`record_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of timeline_records
-- ----------------------------
INSERT INTO `timeline_records` VALUES (7, '测试时光轴', '这是一个测试数据', '/uploads/1783152828411_cv1p9puov.jpg', '/uploads/1783161783558_dohsi4ck9_converted.mp4', '2026-07-03', '', 0, '2026-07-04 16:14:02', '2026-07-04 18:43:09');
INSERT INTO `timeline_records` VALUES (8, '添加时光轴测试', '123456', '/uploads/1783163532077_no42r7e05.jpg', '/uploads/1783163535796_kg061h0vp_converted.mp4', '2026-07-04', '', 0, '2026-07-04 19:12:23', '2026-07-04 19:12:23');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'guest',
  `is_admin` tinyint(1) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'lgbq', '21232f297a57a5a743894a0e4a801fc3', '管理员', 'admin', 1, '2026-07-04 15:41:51');
INSERT INTO `users` VALUES (2, 'baba', '21232f297a57a5a743894a0e4a801fc3', '爸爸', 'admin', 1, '2026-07-04 15:41:51');
INSERT INTO `users` VALUES (3, 'mama', '21232f297a57a5a743894a0e4a801fc3', '妈妈', 'admin', 1, '2026-07-04 15:41:51');
INSERT INTO `users` VALUES (4, 'kp', 'e10adc3949ba59abbe56e057f20f883e', 'kp', 'user', 0, '2026-07-04 19:55:35');

SET FOREIGN_KEY_CHECKS = 1;
