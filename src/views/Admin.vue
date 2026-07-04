<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1 class="page-title">管理员后台</h1>
      <p class="page-desc">管理博客数据和用户</p>
    </div>
    
    <div class="admin-container">
      <div class="sidebar">
        <div class="sidebar-nav">
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            <span class="nav-icon">👤</span>
            <span class="nav-text">用户管理</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'timeline' }"
            @click="activeTab = 'timeline'"
          >
            <span class="nav-icon">📅</span>
            <span class="nav-text">时光轴管理</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'milestones' }"
            @click="activeTab = 'milestones'"
          >
            <span class="nav-icon">🏆</span>
            <span class="nav-text">里程碑管理</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'diaries' }"
            @click="activeTab = 'diaries'"
          >
            <span class="nav-icon">📝</span>
            <span class="nav-text">成长日记管理</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'growth' }"
            @click="activeTab = 'growth'"
          >
            <span class="nav-icon">📈</span>
            <span class="nav-text">成长数据管理</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'messages' }"
            @click="activeTab = 'messages'"
          >
            <span class="nav-icon">💬</span>
            <span class="nav-text">留言管理</span>
          </div>
        </div>
      </div>
      
      <div class="main-content">
        <div v-if="activeTab === 'users'" class="content-section">
          <div class="section-header">
            <h2>用户管理</h2>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>昵称</th>
                  <th>角色</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.nickname || '-' }}</td>
                  <td>
                    <span class="role-tag" :class="user.role">
                      {{ user.role === 'admin' ? '管理员' : user.role === 'user' ? '普通用户' : '访客' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-edit" 
                        @click="editUser(user)"
                      >
                        编辑
                      </button>
                      <button 
                        class="btn btn-sm btn-delete" 
                        :disabled="user.role === 'admin'"
                        @click="deleteUser(user.id)"
                      >
                        {{ user.role === 'admin' ? '不可删除' : '删除' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-if="activeTab === 'timeline'" class="content-section">
          <div class="section-header">
            <h2>时光轴管理</h2>
            <button class="btn btn-primary btn-sm" @click="openTimelineModal()">添加记录</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>日期</th>
                  <th>月龄</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in timelineRecords" :key="record.id">
                  <td>{{ record.id }}</td>
                  <td>{{ record.title }}</td>
                  <td>{{ record.record_date }}</td>
                  <td>{{ record.month_age }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-edit" @click="editTimeline(record)">编辑</button>
                      <button class="btn btn-sm btn-delete" @click="deleteTimeline(record.id)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-if="activeTab === 'milestones'" class="content-section">
          <div class="section-header">
            <h2>里程碑管理</h2>
            <button class="btn btn-primary btn-sm" @click="openMilestoneModal()">添加里程碑</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>目标日期</th>
                  <th>实际日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in milestones" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.target_date || '-' }}</td>
                  <td>{{ item.actual_date || '-' }}</td>
                  <td>
                    <span class="status-tag" :class="item.is_unlocked ? 'unlocked' : 'locked'">
                      {{ item.is_unlocked ? '已解锁' : '待解锁' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-edit" @click="editMilestone(item)">编辑</button>
                      <button class="btn btn-sm btn-delete" @click="deleteMilestone(item.id)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-if="activeTab === 'diaries'" class="content-section">
          <div class="section-header">
            <h2>成长日记管理</h2>
            <button class="btn btn-primary btn-sm" @click="openDiaryModal()">添加日记</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>发布日期</th>
                  <th>月龄</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="diary in diaries" :key="diary.id">
                  <td>{{ diary.id }}</td>
                  <td>{{ diary.title }}</td>
                  <td>{{ diary.publish_date }}</td>
                  <td>{{ diary.month_age }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-edit" @click="editDiary(diary)">编辑</button>
                      <button class="btn btn-sm btn-delete" @click="deleteDiary(diary.id)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-if="activeTab === 'growth'" class="content-section">
          <div class="section-header">
            <h2>成长数据管理</h2>
            <button class="btn btn-primary btn-sm" @click="openGrowthModal()">添加数据</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>测量日期</th>
                  <th>身高(cm)</th>
                  <th>体重(kg)</th>
                  <th>备注</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in growthData" :key="data.id">
                  <td>{{ data.id }}</td>
                  <td>{{ data.measure_date }}</td>
                  <td>{{ data.height }}</td>
                  <td>{{ data.weight }}</td>
                  <td>{{ data.note || '-' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-edit" @click="editGrowth(data)">编辑</button>
                      <button class="btn btn-sm btn-delete" @click="deleteGrowth(data.id)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-if="activeTab === 'messages'" class="content-section">
          <div class="section-header">
            <h2>留言管理</h2>
          </div>
          <div class="message-list">
            <div v-for="msg in messages" :key="msg.id" class="message-item">
              <div class="message-header">
                <span class="message-nickname">{{ msg.nickname }}</span>
                <span class="message-date">{{ msg.message_date }}</span>
                <span v-if="msg.is_admin_reply" class="admin-tag">管理员回复</span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
              <div v-if="msg.replies && msg.replies.length" class="message-replies">
                <div v-for="reply in msg.replies" :key="reply.id" class="reply-item">
                  <span class="reply-nickname">{{ reply.nickname }}</span>
                  <span class="reply-content">{{ reply.content }}</span>
                </div>
              </div>
              <div class="message-actions">
                <button class="btn btn-sm btn-delete" @click="deleteMessage(msg.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showUserModal" class="modal-overlay" @click="closeUserModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingUser ? '编辑用户' : '添加用户' }}</h3>
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input type="text" class="form-input" v-model="userForm.username">
        </div>
        <div class="form-group">
          <label class="form-label">昵称</label>
          <input type="text" class="form-input" v-model="userForm.nickname">
        </div>
        <div class="form-group">
          <label class="form-label">角色</label>
          <div class="form-input readonly">{{ userForm.role === 'admin' ? '管理员' : '普通用户' }}</div>
        </div>
        <div class="form-group">
          <label class="form-label">{{ editingUser ? '新密码（留空则不修改）' : '密码' }}</label>
          <input type="password" class="form-input" v-model="userForm.password" :placeholder="editingUser ? '留空表示不修改密码' : '请输入密码'">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeUserModal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveUser">保存</button>
        </div>
      </div>
    </div>
    
    <div v-if="showTimelineModal" class="modal-overlay" @click="closeTimelineModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingTimeline ? '编辑时光轴记录' : '添加时光轴记录' }}</h3>
        <div class="form-group">
          <label class="form-label">标题</label>
          <input type="text" class="form-input" v-model="timelineForm.title">
        </div>
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea class="form-textarea" v-model="timelineForm.content" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">上传图片</label>
          <div class="upload-area" @click.stop.prevent="triggerUpload('timelineImages')">
            <input type="file" id="timelineImages" multiple accept="image/*" style="display:none" @click.stop @change.prevent="handleImageUpload('timeline', $event)">
            <span v-if="!timelineForm.images" class="upload-hint">📷 点击选择图片（可多选）</span>
            <div v-else class="preview-images">
              <div v-for="(img, idx) in getImageList(timelineForm.images)" :key="img" class="preview-item">
                <img :src="img" class="preview-img">
                <span class="preview-remove" @click.stop="removeImage('timeline', idx)">×</span>
              </div>
              <span class="upload-add" @click.stop.prevent="triggerUpload('timelineImages')">+ 添加</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">上传视频</label>
          <div class="upload-area" @click.stop.prevent="triggerUpload('timelineVideos')">
            <input type="file" id="timelineVideos" multiple accept="video/*" style="display:none" @click.stop @change.prevent="handleVideoUpload('timeline', $event)">
            <span v-if="!timelineForm.videos" class="upload-hint">🎬 点击选择视频（可多选）</span>
            <div v-else class="preview-images">
              <div v-for="(video, idx) in getVideoList(timelineForm.videos)" :key="video" class="preview-item video">
                <span class="video-icon">🎬</span>
                <span class="video-name">{{ getVideoName(video) }}</span>
                <span class="preview-remove" @click.stop="removeVideo('timeline', idx)">×</span>
              </div>
              <span class="upload-add" @click.stop.prevent="triggerUpload('timelineVideos')">+ 添加</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">日期</label>
          <input type="date" class="form-input" v-model="timelineForm.record_date">
        </div>
        <div class="form-group">
          <label class="form-label">月龄</label>
          <input type="text" class="form-input" v-model="timelineForm.month_age" placeholder="如：3个月10天">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeTimelineModal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveTimeline">保存</button>
        </div>
      </div>
    </div>
    
    <div v-if="showMilestoneModal" class="modal-overlay" @click="closeMilestoneModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingMilestone ? '编辑里程碑' : '添加里程碑' }}</h3>
        <div class="form-group">
          <label class="form-label">标题</label>
          <input type="text" class="form-input" v-model="milestoneForm.title">
        </div>
        <div class="form-group">
          <label class="form-label">图标</label>
          <input type="text" class="form-input" v-model="milestoneForm.icon" placeholder="如：star">
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea class="form-textarea" v-model="milestoneForm.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">目标日期</label>
          <input type="date" class="form-input" v-model="milestoneForm.target_date">
        </div>
        <div class="form-group">
          <label class="form-label">实际日期</label>
          <input type="date" class="form-input" v-model="milestoneForm.actual_date">
        </div>
        <div class="form-group">
          <label class="form-label">状态</label>
          <select class="form-input" v-model="milestoneForm.is_unlocked">
            <option :value="0">待解锁</option>
            <option :value="1">已解锁</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeMilestoneModal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveMilestone">保存</button>
        </div>
      </div>
    </div>
    
    <div v-if="showDiaryModal" class="modal-overlay" @click="closeDiaryModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingDiary ? '编辑日记' : '添加日记' }}</h3>
        <div class="form-group">
          <label class="form-label">标题</label>
          <input type="text" class="form-input" v-model="diaryForm.title">
        </div>
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea class="form-textarea" v-model="diaryForm.content" rows="6"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">封面图片</label>
          <div class="upload-area" @click.stop.prevent="triggerUpload('diaryCover')">
            <input type="file" id="diaryCover" accept="image/*" style="display:none" @click.stop @change.prevent="handleSingleUpload('diaryCover', $event)">
            <span v-if="!diaryForm.cover_image" class="upload-hint">📷 点击选择封面图片</span>
            <div v-else class="preview-images">
              <div class="preview-item">
                <img :src="diaryForm.cover_image" class="preview-img">
                <span class="preview-remove" @click.stop="diaryForm.cover_image = ''">×</span>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">内容图片</label>
          <div class="upload-area" @click.stop.prevent="triggerUpload('diaryImages')">
            <input type="file" id="diaryImages" multiple accept="image/*" style="display:none" @click.stop @change.prevent="handleImageUpload('diary', $event)">
            <span v-if="!diaryForm.images" class="upload-hint">📷 点击选择图片（可多选）</span>
            <div v-else class="preview-images">
              <div v-for="(img, idx) in getImageList(diaryForm.images)" :key="img" class="preview-item">
                <img :src="img" class="preview-img">
                <span class="preview-remove" @click.stop="removeImage('diary', idx)">×</span>
              </div>
              <span class="upload-add" @click.stop.prevent="triggerUpload('diaryImages')">+ 添加</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">上传视频</label>
          <div class="upload-area" @click.stop.prevent="triggerUpload('diaryVideos')">
            <input type="file" id="diaryVideos" multiple accept="video/*" style="display:none" @click.stop @change.prevent="handleVideoUpload('diary', $event)">
            <span v-if="!diaryForm.videos" class="upload-hint">🎬 点击选择视频（可多选）</span>
            <div v-else class="preview-images">
              <div v-for="(video, idx) in getVideoList(diaryForm.videos)" :key="video" class="preview-item video">
                <span class="video-icon">🎬</span>
                <span class="video-name">{{ getVideoName(video) }}</span>
                <span class="preview-remove" @click.stop="removeVideo('diary', idx)">×</span>
              </div>
              <span class="upload-add" @click.stop.prevent="triggerUpload('diaryVideos')">+ 添加</span>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">发布日期</label>
          <input type="date" class="form-input" v-model="diaryForm.publish_date">
        </div>
        <div class="form-group">
          <label class="form-label">月龄</label>
          <input type="text" class="form-input" v-model="diaryForm.month_age" placeholder="如：3个月10天">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeDiaryModal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveDiary">保存</button>
        </div>
      </div>
    </div>
    
    <div v-if="showGrowthModal" class="modal-overlay" @click="closeGrowthModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editingGrowth ? '编辑成长数据' : '添加成长数据' }}</h3>
        <div class="form-group">
          <label class="form-label">测量日期</label>
          <input type="date" class="form-input" v-model="growthForm.measure_date">
        </div>
        <div class="form-group">
          <label class="form-label">身高(cm)</label>
          <input type="number" step="0.1" class="form-input" v-model="growthForm.height">
        </div>
        <div class="form-group">
          <label class="form-label">体重(kg)</label>
          <input type="number" step="0.01" class="form-input" v-model="growthForm.weight">
        </div>
        <div class="form-group">
          <label class="form-label">头围(cm)</label>
          <input type="number" step="0.1" class="form-input" v-model="growthForm.head_circumference">
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input type="text" class="form-input" v-model="growthForm.note">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeGrowthModal">取消</button>
          <button type="button" class="btn btn-primary" @click="saveGrowth">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      activeTab: 'users',
      users: [],
      timelineRecords: [],
      milestones: [],
      diaries: [],
      growthData: [],
      messages: [],
      showUserModal: false,
      showTimelineModal: false,
      showMilestoneModal: false,
      showDiaryModal: false,
      showGrowthModal: false,
      editingUser: null,
      editingTimeline: null,
      editingMilestone: null,
      editingDiary: null,
      editingGrowth: null,
      userForm: {
        username: '',
        password: '',
        nickname: '',
        role: 'user'
      },
      timelineForm: {
        title: '',
        content: '',
        images: '',
        videos: '',
        record_date: '',
        month_age: ''
      },
      milestoneForm: {
        title: '',
        icon: 'star',
        description: '',
        target_date: '',
        actual_date: '',
        is_unlocked: 0
      },
      diaryForm: {
        title: '',
        content: '',
        cover_image: '',
        images: '',
        videos: '',
        publish_date: '',
        month_age: ''
      },
      growthForm: {
        measure_date: '',
        height: '',
        weight: '',
        head_circumference: '',
        note: ''
      }
    }
  },
  created() {
    this.log('info', 'Admin组件 created')
    this.loadData()
  },
  mounted() {
    this.log('info', 'Admin组件 mounted')
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('unload', this.handleUnload)
  },
  beforeDestroy() {
    this.log('warn', 'Admin组件 beforeDestroy - 页面即将销毁！')
  },
  watch: {
    activeTab(val) {
      this.log('info', `activeTab变化: ${val}`)
      this.loadData()
    },
    showTimelineModal(val) {
      this.log('info', `showTimelineModal变化: ${val}`)
    },
    showDiaryModal(val) {
      this.log('info', `showDiaryModal变化: ${val}`)
    }
  },
  methods: {
    log(level, message) {
      console.log(`[DEBUG] ${message}`)
      this.axios.post('/api/log', { level, message }).catch(() => {})
    },
    loadData() {
      switch (this.activeTab) {
        case 'users':
          this.loadUsers()
          break
        case 'timeline':
          this.loadTimeline()
          break
        case 'milestones':
          this.loadMilestones()
          break
        case 'diaries':
          this.loadDiaries()
          break
        case 'growth':
          this.loadGrowth()
          break
        case 'messages':
          this.loadMessages()
          break
      }
    },
    loadUsers() {
      this.axios.get('/api/users').then(res => {
        if (res.data.status === 200) {
          this.users = res.data.data
        }
      }).catch(() => {})
    },
    loadTimeline() {
      this.axios.get('/api/timeline').then(res => {
        if (res.data.status === 200) {
          this.timelineRecords = res.data.data
        }
      }).catch(() => {})
    },
    loadMilestones() {
      this.axios.get('/api/milestones').then(res => {
        if (res.data.status === 200) {
          this.milestones = res.data.data
        }
      }).catch(() => {})
    },
    loadDiaries() {
      this.axios.get('/api/diaries').then(res => {
        if (res.data.status === 200) {
          this.diaries = res.data.data
        }
      }).catch(() => {})
    },
    loadGrowth() {
      this.axios.get('/api/growth').then(res => {
        if (res.data.status === 200) {
          this.growthData = res.data.data
        }
      }).catch(() => {})
    },
    loadMessages() {
      this.axios.get('/api/messages').then(res => {
        if (res.data.status === 200) {
          this.messages = res.data.data
        }
      }).catch(() => {})
    },
    editUser(user) {
      this.editingUser = user
      this.userForm = {
        username: user.username,
        password: '',
        nickname: user.nickname,
        role: user.role
      }
      this.showUserModal = true
    },
    closeUserModal() {
      this.showUserModal = false
      this.editingUser = null
      this.userForm = { username: '', password: '', nickname: '', role: 'user' }
    },
    saveUser() {
      if (!this.userForm.username) {
        this.$message.warning('请输入用户名')
        return
      }
      if (!this.editingUser && !this.userForm.password) {
        this.$message.warning('请输入密码')
        return
      }
      if (this.editingUser) {
        this.axios.put('/api/users', {
          id: this.editingUser.id,
          username: this.userForm.username,
          nickname: this.userForm.nickname,
          password: this.userForm.password
        }).then(res => {
          if (res.data.status === 200) {
            this.$message.success('更新成功')
            this.loadUsers()
            this.closeUserModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('更新失败')
        })
      } else {
        this.axios.post('/api/register', {
          username: this.userForm.username,
          password: this.userForm.password,
          nickname: this.userForm.nickname,
          role: this.userForm.role
        }).then(res => {
          if (res.data.status === 200) {
            this.$message.success('添加成功')
            this.loadUsers()
            this.closeUserModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('添加失败')
        })
      }
    },
    deleteUser(id) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('/api/users', { data: { id } }).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadUsers()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    editTimeline(record) {
      this.editingTimeline = record
      this.timelineForm = {
        title: record.title,
        content: record.content || '',
        images: record.images || '',
        videos: record.videos || '',
        record_date: this.formatDateStr(record.record_date),
        month_age: record.month_age || ''
      }
      this.showTimelineModal = true
    },
    openTimelineModal() {
      this.editingTimeline = null
      this.timelineForm = { title: '', content: '', images: '', videos: '', record_date: '', month_age: '' }
      this.showTimelineModal = true
    },
    closeTimelineModal() {
      this.showTimelineModal = false
      this.editingTimeline = null
      this.timelineForm = { title: '', content: '', images: '', videos: '', record_date: '', month_age: '' }
    },
    saveTimeline() {
      console.log('[DEBUG] saveTimeline 开始执行')
      console.log('[DEBUG] timelineForm:', JSON.stringify(this.timelineForm))
      console.log('[DEBUG] editingTimeline:', this.editingTimeline ? JSON.stringify(this.editingTimeline) : null)
      if (!this.timelineForm.title) {
        this.$message.warning('请输入标题')
        console.log('[DEBUG] saveTimeline 结束: 缺少标题')
        return
      }
      if (!this.timelineForm.record_date) {
        this.$message.warning('请选择日期')
        console.log('[DEBUG] saveTimeline 结束: 缺少日期')
        return
      }
      const data = {
        title: this.timelineForm.title,
        content: this.timelineForm.content,
        images: this.timelineForm.images,
        videos: this.timelineForm.videos,
        record_date: this.timelineForm.record_date,
        month_age: this.timelineForm.month_age
      }
      console.log('[DEBUG] saveTimeline 准备发送请求:', JSON.stringify(data))
      if (this.editingTimeline) {
        data.id = this.editingTimeline.id
        console.log('[DEBUG] 执行 PUT 请求')
        this.axios.put('/api/timeline', data).then(res => {
          console.log('[DEBUG] PUT 请求成功:', JSON.stringify(res.data))
          if (res.data.status === 200) {
            this.$message.success('更新成功')
            this.loadTimeline()
            this.closeTimelineModal()
            console.log('[DEBUG] saveTimeline 结束: 更新成功')
          } else {
            this.$message.error(res.data.message)
            console.log('[DEBUG] saveTimeline 结束: 更新失败', res.data.message)
          }
        }).catch(err => {
          console.error('[DEBUG] PUT 请求失败:', err)
          this.$message.error('更新失败')
        })
      } else {
        console.log('[DEBUG] 执行 POST 请求')
        this.axios.post('/api/timeline', data).then(res => {
          console.log('[DEBUG] POST 请求成功:', JSON.stringify(res.data))
          if (res.data.status === 200) {
            this.$message.success('添加成功')
            this.loadTimeline()
            this.closeTimelineModal()
            console.log('[DEBUG] saveTimeline 结束: 添加成功')
          } else {
            this.$message.error(res.data.message)
            console.log('[DEBUG] saveTimeline 结束: 添加失败', res.data.message)
          }
        }).catch(err => {
          console.error('[DEBUG] POST 请求失败:', err)
          this.$message.error('添加失败')
        })
      }
    },
    deleteTimeline(id) {
      this.$confirm('确定要删除该记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/api/timeline/${id}`).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadTimeline()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    editMilestone(item) {
      this.editingMilestone = item
      this.milestoneForm = {
        title: item.title,
        icon: item.icon || 'star',
        description: item.description || '',
        target_date: this.formatDateStr(item.target_date),
        actual_date: this.formatDateStr(item.actual_date),
        is_unlocked: item.is_unlocked
      }
      this.showMilestoneModal = true
    },
    openMilestoneModal() {
      this.editingMilestone = null
      this.milestoneForm = { title: '', icon: 'star', description: '', target_date: '', actual_date: '', is_unlocked: 0 }
      this.showMilestoneModal = true
    },
    closeMilestoneModal() {
      this.showMilestoneModal = false
      this.editingMilestone = null
      this.milestoneForm = { title: '', icon: 'star', description: '', target_date: '', actual_date: '', is_unlocked: 0 }
    },
    saveMilestone() {
      if (!this.milestoneForm.title) {
        this.$message.warning('请输入标题')
        return
      }
      const data = {
        title: this.milestoneForm.title,
        icon: this.milestoneForm.icon,
        description: this.milestoneForm.description,
        target_date: this.milestoneForm.target_date,
        actual_date: this.milestoneForm.actual_date,
        is_unlocked: this.milestoneForm.is_unlocked
      }
      if (this.editingMilestone) {
        data.id = this.editingMilestone.id
        this.axios.put('/api/milestones', data).then(res => {
          if (res.data.status === 200) {
            this.$message.success('更新成功')
            this.loadMilestones()
            this.closeMilestoneModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('更新失败')
        })
      } else {
        this.axios.post('/api/milestones', data).then(res => {
          if (res.data.status === 200) {
            this.$message.success('添加成功')
            this.loadMilestones()
            this.closeMilestoneModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('添加失败')
        })
      }
    },
    deleteMilestone(id) {
      this.$confirm('确定要删除该里程碑吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/api/milestones/${id}`).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadMilestones()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    editDiary(diary) {
      this.editingDiary = diary
      this.diaryForm = {
        title: diary.title,
        content: diary.content || '',
        cover_image: diary.cover_image || '',
        images: diary.images || '',
        videos: diary.videos || '',
        publish_date: this.formatDateStr(diary.publish_date),
        month_age: diary.month_age || ''
      }
      this.showDiaryModal = true
    },
    openDiaryModal() {
      this.editingDiary = null
      this.diaryForm = { title: '', content: '', cover_image: '', images: '', videos: '', publish_date: '', month_age: '' }
      this.showDiaryModal = true
    },
    closeDiaryModal() {
      this.showDiaryModal = false
      this.editingDiary = null
      this.diaryForm = { title: '', content: '', cover_image: '', images: '', videos: '', publish_date: '', month_age: '' }
    },
    saveDiary() {
      console.log('[DEBUG] saveDiary 开始执行')
      console.log('[DEBUG] diaryForm:', JSON.stringify(this.diaryForm))
      console.log('[DEBUG] editingDiary:', this.editingDiary ? JSON.stringify(this.editingDiary) : null)
      if (!this.diaryForm.title) {
        this.$message.warning('请输入标题')
        console.log('[DEBUG] saveDiary 结束: 缺少标题')
        return
      }
      if (!this.diaryForm.publish_date) {
        this.$message.warning('请选择发布日期')
        console.log('[DEBUG] saveDiary 结束: 缺少日期')
        return
      }
      const data = {
        title: this.diaryForm.title,
        content: this.diaryForm.content,
        cover_image: this.diaryForm.cover_image,
        images: this.diaryForm.images,
        videos: this.diaryForm.videos,
        publish_date: this.diaryForm.publish_date,
        month_age: this.diaryForm.month_age
      }
      console.log('[DEBUG] saveDiary 准备发送请求:', JSON.stringify(data))
      if (this.editingDiary) {
        data.id = this.editingDiary.id
        console.log('[DEBUG] 执行 PUT 请求')
        this.axios.put('/api/diaries', data).then(res => {
          console.log('[DEBUG] PUT 请求成功:', JSON.stringify(res.data))
          if (res.data.status === 200) {
            this.$message.success('更新成功')
            this.loadDiaries()
            this.closeDiaryModal()
            console.log('[DEBUG] saveDiary 结束: 更新成功')
          } else {
            this.$message.error(res.data.message)
            console.log('[DEBUG] saveDiary 结束: 更新失败', res.data.message)
          }
        }).catch(err => {
          console.error('[DEBUG] PUT 请求失败:', err)
          this.$message.error('更新失败')
        })
      } else {
        console.log('[DEBUG] 执行 POST 请求')
        this.axios.post('/api/diaries', data).then(res => {
          console.log('[DEBUG] POST 请求成功:', JSON.stringify(res.data))
          if (res.data.status === 200) {
            this.$message.success('添加成功')
            this.loadDiaries()
            this.closeDiaryModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('添加失败')
        })
      }
    },
    deleteDiary(id) {
      this.$confirm('确定要删除该日记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/api/diaries/${id}`).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadDiaries()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    editGrowth(data) {
      this.editingGrowth = data
      this.growthForm = {
        measure_date: this.formatDateStr(data.measure_date),
        height: data.height,
        weight: data.weight,
        head_circumference: data.head_circumference || '',
        note: data.note || ''
      }
      this.showGrowthModal = true
    },
    openGrowthModal() {
      this.editingGrowth = null
      this.growthForm = { measure_date: '', height: '', weight: '', head_circumference: '', note: '' }
      this.showGrowthModal = true
    },
    closeGrowthModal() {
      this.showGrowthModal = false
      this.editingGrowth = null
      this.growthForm = { measure_date: '', height: '', weight: '', head_circumference: '', note: '' }
    },
    saveGrowth() {
      if (!this.growthForm.measure_date) {
        this.$message.warning('请选择测量日期')
        return
      }
      if (!this.growthForm.height) {
        this.$message.warning('请输入身高')
        return
      }
      if (!this.growthForm.weight) {
        this.$message.warning('请输入体重')
        return
      }
      const data = {
        measure_date: this.growthForm.measure_date,
        height: this.growthForm.height,
        weight: this.growthForm.weight,
        head_circumference: this.growthForm.head_circumference,
        note: this.growthForm.note
      }
      if (this.editingGrowth) {
        data.id = this.editingGrowth.id
        this.axios.put('/api/growth', data).then(res => {
          if (res.data.status === 200) {
            this.$message.success('更新成功')
            this.loadGrowth()
            this.closeGrowthModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('更新失败')
        })
      } else {
        this.axios.post('/api/growth', data).then(res => {
          if (res.data.status === 200) {
            this.$message.success('添加成功')
            this.loadGrowth()
            this.closeGrowthModal()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('添加失败')
        })
      }
    },
    deleteGrowth(id) {
      this.$confirm('确定要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/api/growth/${id}`).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadGrowth()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    deleteMessage(id) {
      this.$confirm('确定要删除该留言吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete(`/api/messages/${id}`).then(res => {
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.loadMessages()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      return dateStr.substring(0, 10)
    },
    formatDateStr(dateStr) {
      if (!dateStr) return ''
      if (dateStr.includes('T')) {
        return dateStr.substring(0, 10)
      }
      return dateStr
    },
    triggerUpload(id) {
      document.getElementById(id).click()
    },
    handleSingleUpload(type, event) {
      const file = event.target.files[0]
      if (!file) return
      this.uploadFile(file, type)
      event.target.value = ''
    },
    handleImageUpload(type, event) {
      const files = event.target.files
      if (!files || files.length === 0) return
      Array.from(files).forEach(file => {
        this.uploadFile(file, type + 'Images')
      })
      event.target.value = ''
    },
    handleVideoUpload(type, event) {
      const files = event.target.files
      if (!files || files.length === 0) return
      Array.from(files).forEach(file => {
        this.uploadFile(file, type + 'Videos')
      })
      event.target.value = ''
    },
    uploadFile(file, type) {
      const formData = new FormData()
      formData.append('file', file)
      this.log('info', `开始上传文件: ${file.name}, 类型: ${type}, showTimelineModal: ${this.showTimelineModal}, showDiaryModal: ${this.showDiaryModal}`)
      const loading = this.$loading({ text: '正在上传处理中，请稍候...' })
      const that = this
      this.axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000
      }).then(res => {
        loading.close()
        that.log('info', `上传响应: ${JSON.stringify(res.data)}, showTimelineModal: ${that.showTimelineModal}, showDiaryModal: ${that.showDiaryModal}`)
        if (res.data && res.data.data && res.data.data.url) {
          const url = res.data.data.url
          that.log('info', `准备更新表单，URL: ${url}, 类型: ${type}`)
          if (type === 'diaryCover') {
            that.diaryForm.cover_image = url
          } else if (type === 'timelineImages') {
            const currentImages = that.timelineForm.images ? that.timelineForm.images.split(',') : []
            currentImages.push(url)
            that.timelineForm.images = currentImages.join(',')
          } else if (type === 'timelineVideos') {
            const currentVideos = that.timelineForm.videos ? that.timelineForm.videos.split(',') : []
            currentVideos.push(url)
            that.timelineForm.videos = currentVideos.join(',')
          } else if (type === 'diaryImages') {
            const currentImages = that.diaryForm.images ? that.diaryForm.images.split(',') : []
            currentImages.push(url)
            that.diaryForm.images = currentImages.join(',')
          } else if (type === 'diaryVideos') {
            const currentVideos = that.diaryForm.videos ? that.diaryForm.videos.split(',') : []
            currentVideos.push(url)
            that.diaryForm.videos = currentVideos.join(',')
          }
          that.log('info', `表单更新完成，showTimelineModal: ${that.showTimelineModal}, showDiaryModal: ${that.showDiaryModal}`)
          that.$message.success(res.data.status === 200 ? '上传成功' : '上传成功（部分处理）')
        } else {
          that.$message.error(res.data && res.data.message ? res.data.message : '上传失败')
        }
      }).catch(error => {
        loading.close()
        that.log('error', `上传错误: ${error.message}, showTimelineModal: ${that.showTimelineModal}, showDiaryModal: ${that.showDiaryModal}`)
        if (error.code === 'ECONNABORTED') {
          that.$message.error('上传超时，请重试')
        } else if (error.response) {
          that.$message.error('上传失败: ' + (error.response.data && error.response.data.message || error.message))
        } else {
          that.$message.error('上传失败: ' + error.message)
        }
      })
    },
    handleBeforeUnload(event) {
      this.log('warn', 'window.beforeunload 触发 - 页面即将刷新！')
    },
    handleUnload(event) {
      this.log('error', 'window.unload 触发 - 页面正在刷新！')
    },
    getImageList(images) {
      if (!images) return []
      return images.split(',').filter(img => img.trim())
    },
    getVideoList(videos) {
      if (!videos) return []
      return videos.split(',').filter(video => video.trim())
    },
    getVideoName(url) {
      return url.split('/').pop()
    },
    removeImage(type, index) {
      if (type === 'timeline') {
        const images = this.timelineForm.images ? this.timelineForm.images.split(',') : []
        images.splice(index, 1)
        this.timelineForm.images = images.join(',')
      } else if (type === 'diary') {
        const images = this.diaryForm.images ? this.diaryForm.images.split(',') : []
        images.splice(index, 1)
        this.diaryForm.images = images.join(',')
      }
    },
    removeVideo(type, index) {
      if (type === 'timeline') {
        const videos = this.timelineForm.videos ? this.timelineForm.videos.split(',') : []
        videos.splice(index, 1)
        this.timelineForm.videos = videos.join(',')
      } else if (type === 'diary') {
        const videos = this.diaryForm.videos ? this.diaryForm.videos.split(',') : []
        videos.splice(index, 1)
        this.diaryForm.videos = videos.join(',')
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding: 80px 20px 40px;
}

.admin-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.page-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.admin-container {
  display: flex;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.sidebar-nav {
  background: white;
  border-radius: var(--radius-lg);
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.nav-item:hover {
  background: rgba(142, 184, 217, 0.1);
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-weight: 500;
}

.main-content {
  flex: 1;
}

.content-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #F0EDE8;
}

.data-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 13px;
}

.data-table td {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.role-tag {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.role-tag.admin {
  background: rgba(142, 184, 217, 0.15);
  color: #8EB8D9;
}

.role-tag.user {
  background: rgba(107, 203, 119, 0.15);
  color: #6BCB77;
}

.role-tag.guest {
  background: rgba(200, 200, 200, 0.15);
  color: #999;
}

.status-tag {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.status-tag.unlocked {
  background: rgba(107, 203, 119, 0.15);
  color: #6BCB77;
}

.status-tag.locked {
  background: rgba(200, 200, 200, 0.15);
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-edit {
  background: rgba(142, 184, 217, 0.1);
  color: var(--color-primary);
  border: none;
}

.btn-edit:hover:not(:disabled) {
  background: rgba(142, 184, 217, 0.2);
}

.btn-delete {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
  border: none;
}

.btn-delete:hover:not(:disabled) {
  background: rgba(255, 107, 107, 0.2);
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.message-nickname {
  font-weight: 600;
  color: var(--color-text-primary);
}

.message-date {
  font-size: 12px;
  color: var(--color-text-light);
}

.admin-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(142, 184, 217, 0.15);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
}

.message-content {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.message-replies {
  margin-left: 20px;
  padding-left: 15px;
  border-left: 2px solid #E8E4DF;
}

.reply-item {
  padding: 8px 0;
}

.reply-nickname {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  margin-right: 8px;
}

.reply-content {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.message-actions {
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 15px;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
}

.form-textarea {
  resize: vertical;
}

.form-input:disabled,
.form-input.readonly {
  background: var(--bg-secondary);
  color: var(--color-text-light);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 24px;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(142, 184, 217, 0.05);
}

.upload-hint {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.preview-item.video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5F0E6;
}

.video-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.video-name {
  font-size: 10px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #FF6B6B;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}

.upload-add {
  width: 80px;
  height: 80px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .nav-item {
    flex: 1;
    min-width: 100px;
    justify-content: center;
  }
}
</style>