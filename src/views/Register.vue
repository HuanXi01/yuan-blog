<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="logo">🍼</div>
        <h1 class="title">创建新账号</h1>
        <p class="subtitle">加入我们，一起见证宇安的成长</p>
      </div>
      
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="username" 
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">密码</label>
          <input 
            type="password" 
            class="form-input" 
            v-model="password" 
            placeholder="请输入密码"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input 
            type="password" 
            class="form-input" 
            v-model="confirmPassword" 
            placeholder="请再次输入密码"
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">昵称（选填）</label>
          <input 
            type="text" 
            class="form-input" 
            v-model="nickname" 
            placeholder="请输入昵称"
          >
        </div>
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading" class="loading-icon">👣</span>
          {{ loading ? '注册中...' : '注 册' }}
        </button>
      </form>
      
      <div class="register-links">
        <span>已有账号？</span>
        <router-link to="/login" class="link">去登录</router-link>
      </div>
      
      <div class="role-info">
        <p class="info-title">角色说明</p>
        <div class="info-list">
          <div class="info-item">
            <span class="info-icon">👤</span>
            <div class="info-content">
              <span class="info-name">普通用户</span>
              <span class="info-desc">可查看页面、发布留言</span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">👁️</span>
            <div class="info-content">
              <span class="info-name">访客</span>
              <span class="info-desc">仅能查看页面，不可留言</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="decoration">
      <span class="decor-item" style="top: 15%; right: 10%;">⭐</span>
      <span class="decor-item" style="top: 30%; left: 15%;">☁️</span>
      <span class="decor-item" style="bottom: 25%; right: 20%;">👣</span>
      <span class="decor-item" style="bottom: 15%; left: 10%;">🌙</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      loading: false
    }
  },
  methods: {
    handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      this.loading = true
      this.axios.post('/api/register', {
        username: this.username,
        password: this.password,
        nickname: this.nickname
      }).then(res => {
        if (res.data.status === 200) {
          this.$message.success('注册成功，请登录')
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        } else {
          this.$message.error(res.data.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('注册失败')
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F0F4FF 0%, #F5F0E6 100%);
  position: relative;
  padding: 20px;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 48px;
  margin-bottom: 15px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.register-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E8E4DF;
  border-radius: var(--radius-md);
  font-size: 15px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.register-links {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  margin-left: 5px;
}

.link:hover {
  text-decoration: underline;
}

.role-info {
  padding-top: 20px;
  border-top: 1px dashed #E8E4DF;
}

.info-title {
  font-size: 13px;
  color: var(--color-text-light);
  text-align: center;
  margin-bottom: 12px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon {
  font-size: 18px;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.info-desc {
  font-size: 12px;
  color: var(--color-text-light);
}

.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decor-item {
  position: absolute;
  font-size: 32px;
  opacity: 0.15;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.loading-icon {
  margin-right: 8px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .register-container {
    padding: 30px 20px;
  }
  
  .logo {
    font-size: 40px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 13px;
  }
  
  .form-input {
    padding: 10px 14px;
    font-size: 14px;
  }
  
  .btn-block {
    padding: 12px;
    font-size: 15px;
  }
  
  .decor-item {
    font-size: 24px;
  }
  
  .info-name {
    font-size: 13px;
  }
  
  .info-desc {
    font-size: 11px;
  }
}
</style>