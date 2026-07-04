<template>
  <div class="messages-page">
    <div class="decoration-cloud" style="top: 100px; left: 5%;">☁️</div>
    <div class="decoration-star" style="top: 250px; right: 8%;">⭐</div>
    
    <div class="page-header">
      <h1 class="page-title">给宇安的祝福</h1>
      <p class="page-desc">来自亲友的温馨祝福</p>
      <template v-if="canWrite">
        <button class="btn btn-primary write-btn" @click="showWriteModal = true">
          ✏️ 写下祝福
        </button>
      </template>
      <template v-else>
        <div class="login-hint">
          <span>登录后可以发布祝福</span>
          <a href="/login" class="login-link">去登录</a>
        </div>
      </template>
    </div>
    
    <div class="messages-container">
      <div 
        v-for="(message, index) in messages" 
        :key="message.id"
        class="message-card"
        :style="{ 
          backgroundColor: getCardColor(index),
          transform: `rotate(${getRotation(index)}deg)`
        }"
      >
        <div class="message-header">
          <span class="message-nickname">{{ message.nickname }}</span>
          <span class="message-date">{{ formatDate(message.message_date) }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
        
        <div v-if="message.replies && message.replies.length > 0" class="message-replies">
          <div 
            v-for="reply in message.replies" 
            :key="reply.id"
            class="reply-item"
            :class="{ admin: reply.is_admin_reply }"
          >
            <span class="reply-nickname">{{ reply.nickname }}：</span>
            <span class="reply-content">{{ reply.content }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="messages.length === 0" class="empty-state">
      <span class="empty-icon">💌</span>
      <p>还没有祝福，快来写下第一条吧！</p>
    </div>
    
    <div v-if="showWriteModal" class="write-modal" @click="closeWriteModal">
      <div class="write-content" @click.stop>
        <h3 class="write-title">写下祝福</h3>
        <div class="form-group">
          <label class="form-label">昵称</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="newMessage.nickname" 
            :disabled="user"
            :placeholder="user ? user.nickname || user.username : '请输入您的昵称'"
          />
        </div>
        <div class="form-group">
          <label class="form-label">祝福内容</label>
          <textarea 
            class="form-textarea" 
            v-model="newMessage.content" 
            placeholder="写下您对宇安的祝福..."
            rows="4"
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" @click="closeWriteModal">取消</button>
          <button class="btn btn-primary" @click="submitMessage">发送祝福</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Messages',
  data() {
    return {
      messages: [],
      showWriteModal: false,
      newMessage: {
        nickname: '',
        content: ''
      },
      user: null
    }
  },
  computed: {
    canWrite() {
      return this.user && this.user.role !== 'guest'
    }
  },
  created() {
    this.loadMessages()
    this.loadUser()
  },
  methods: {
    loadUser() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
          if (this.user) {
            this.newMessage.nickname = this.user.nickname || this.user.username
          }
        } catch (e) {
          this.user = null
        }
      }
    },
    loadMessages() {
      this.axios.get('/api/messages').then(res => {
        if (res.data.status === 200) {
          this.messages = res.data.data
        }
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    getCardColor(index) {
      const colors = ['#FFF0F5', '#FFF8E1', '#E3F2FD', '#F1F8E9', '#FCE4EC']
      return colors[index % colors.length]
    },
    getRotation(index) {
      const rotations = [-2, -1, 0, 1, 2]
      return rotations[index % rotations.length]
    },
    closeWriteModal() {
      this.showWriteModal = false
      this.newMessage = { nickname: this.user ? this.user.nickname || this.user.username : '', content: '' }
    },
    submitMessage() {
      if (!this.newMessage.nickname.trim()) {
        this.$message.warning('请输入昵称')
        return
      }
      if (!this.newMessage.content.trim()) {
        this.$message.warning('请输入祝福内容')
        return
      }
      
      const data = {
        nickname: this.newMessage.nickname,
        content: this.newMessage.content
      }
      if (this.user) {
        data.user_id = this.user.id
      }
      
      this.axios.post('/api/messages', data).then(res => {
        if (res.data.status === 200) {
          this.$message.success('祝福已发送')
          this.loadMessages()
          this.closeWriteModal()
        } else {
          this.$message.error('发送失败')
        }
      }).catch(() => {
        this.$message.error('发送失败')
      })
    }
  }
}
</script>

<style scoped>
.messages-page {
  position: relative;
  padding: 80px 20px 40px;
}

.decoration-cloud,
.decoration-star {
  position: fixed;
  font-size: 36px;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.page-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.write-btn {
  font-size: 16px;
  padding: 14px 30px;
}

.login-hint {
  font-size: 14px;
  color: var(--color-text-light);
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  margin-left: 8px;
}

.login-link:hover {
  text-decoration: underline;
}

.messages-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.message-card {
  width: 280px;
  padding: 20px;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.message-card:hover {
  transform: rotate(0deg) translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.message-nickname {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.message-date {
  font-size: 12px;
  color: var(--color-text-light);
}

.message-content {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.message-replies {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed var(--border-color);
}

.reply-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.reply-item.admin {
  background: rgba(142, 184, 217, 0.1);
  padding: 8px;
  border-radius: var(--radius-sm);
}

.reply-nickname {
  font-weight: 500;
  color: var(--color-primary);
}

.reply-content {
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state p {
  color: var(--color-text-secondary);
}

.write-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.write-content {
  background: white;
  padding: 30px;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 450px;
}

.write-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  text-align: center;
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

.form-input:disabled {
  background: var(--bg-secondary);
  color: var(--color-text-light);
}

.form-textarea {
  resize: none;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .messages-container {
    gap: 15px;
    flex-direction: column;
    align-items: center;
  }
  
  .message-card {
    width: 100%;
    max-width: 340px;
    padding: 18px;
  }
  
  .message-content {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .message-card {
    max-width: 100%;
    transform: none !important;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  }
  
  .message-card:hover {
    transform: translateY(-3px) !important;
  }
  
  .write-content {
    padding: 24px;
    margin: 15px;
  }
  
  .write-title {
    font-size: 20px;
  }
}
</style>