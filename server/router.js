let express = require('express');
let router = express.Router();

let users = require('./api/users');
let about = require('./api/about');
let timeline = require('./api/timeline');
let milestones = require('./api/milestones');
let diaries = require('./api/diaries');
let growth = require('./api/growth');
let messages = require('./api/messages');

router.post('/api/login', users.login);
router.post('/api/register', users.register);
router.get('/api/user/info', users.getUserInfo);
router.get('/api/users', users.getUsers);
router.put('/api/users', users.updateUser);
router.delete('/api/users', users.deleteUser);

router.get('/api/about', about.getAbout);
router.put('/api/about', about.updateAbout);

router.get('/api/timeline', timeline.getAllRecords);
router.get('/api/timeline/latest', timeline.getLatestRecords);
router.get('/api/timeline/:id', timeline.getRecordById);
router.get('/api/timeline/month/list', timeline.getMonthList);
router.get('/api/timeline/date', timeline.getRecordByDate);
router.post('/api/timeline', timeline.addRecord);
router.put('/api/timeline', timeline.updateRecord);
router.delete('/api/timeline/:id', timeline.deleteRecord);

router.get('/api/milestones', milestones.getAllMilestones);
router.get('/api/milestones/unlocked', milestones.getUnlockedMilestones);
router.get('/api/milestones/:id', milestones.getMilestoneById);
router.post('/api/milestones', milestones.addMilestone);
router.put('/api/milestones', milestones.updateMilestone);
router.delete('/api/milestones/:id', milestones.deleteMilestone);

router.get('/api/diaries', diaries.getAllDiaries);
router.get('/api/diaries/:id', diaries.getDiaryById);
router.get('/api/diaries/:id/prevnext', diaries.getPrevNextDiary);
router.post('/api/diaries', diaries.addDiary);
router.put('/api/diaries', diaries.updateDiary);
router.delete('/api/diaries/:id', diaries.deleteDiary);

router.get('/api/growth', growth.getAllGrowthData);
router.get('/api/growth/chart', growth.getChartData);
router.get('/api/growth/:id', growth.getGrowthById);
router.post('/api/growth', growth.addGrowthData);
router.put('/api/growth', growth.updateGrowthData);
router.delete('/api/growth/:id', growth.deleteGrowthData);

router.get('/api/messages', messages.getAllMessages);
router.get('/api/messages/count', messages.getMessageCount);
router.post('/api/messages', messages.addMessage);
router.put('/api/messages', messages.updateMessage);
router.delete('/api/messages/:id', messages.deleteMessage);

module.exports = router;