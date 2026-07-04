<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">👶</div>
        <h1 class="title">宇安的小世界</h1>
        <p class="subtitle">欢迎回来，一起记录成长的美好</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
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
        
        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading" class="loading-icon">👣</span>
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
      
      <div class="login-links">
        <span>还没有账号？</span>
        <router-link to="/register" class="link">去注册</router-link>
      </div>
    </div>
    
    <div class="decoration">
      <span class="decor-item" style="top: 10%; left: 10%;">⭐</span>
      <span class="decor-item" style="top: 20%; right: 15%;">👣</span>
      <span class="decor-item" style="bottom: 30%; left: 20%;">☁️</span>
      <span class="decor-item" style="bottom: 20%; right: 10%;">🌙</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.axios.post('/api/login', {
        username: this.username,
        password: this.password
      }).then(res => {
        if (res.data.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data.data))
          this.$message.success('登录成功')
          setTimeout(() => {
            const user = res.data.data
            if (user.role === 'admin' || user.is_admin) {
              this.$router.push('/admin-select')
            } else {
              this.$router.push('/home')
            }
          }, 500)
        } else {
          this.$message.error(res.data.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('登录失败')
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF8F0 0%, #F5F0E6 100%);
  position: relative;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-header {
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

.login-form {
  margin-bottom: 20px;
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

.login-links {
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

.demo-info {
  padding-top: 20px;
  border-top: 1px dashed #E8E4DF;
}

.demo-title {
  font-size: 13px;
  color: var(--color-text-light);
  text-align: center;
  margin-bottom: 12px;
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-item {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.demo-label {
  color: var(--color-text-light);
}

.demo-value {
  font-weight: 500;
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
  .login-container {
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
}
</style>