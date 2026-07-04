<template>
  <div class="admin-select-page">
    <div class="select-container">
      <div class="select-header">
        <div class="logo">👑</div>
        <h1 class="title">欢迎回来，{{ user.nickname || user.username }}</h1>
        <p class="subtitle">请选择您要进入的界面</p>
      </div>
      
      <div class="select-buttons">
        <button class="btn btn-primary btn-large" @click="goToUser">
          <span class="btn-icon">🏠</span>
          <span class="btn-text">用户界面</span>
          <span class="btn-desc">查看宇安的成长记录</span>
        </button>
        
        <button class="btn btn-secondary btn-large" @click="goToAdmin">
          <span class="btn-icon">⚙️</span>
          <span class="btn-text">管理后台</span>
          <span class="btn-desc">进行数据管理操作</span>
        </button>
      </div>
      
      <div class="decoration">
        <span class="decor-item" style="top: 10%; left: 10%;">⭐</span>
        <span class="decor-item" style="top: 20%; right: 15%;">👣</span>
        <span class="decor-item" style="bottom: 30%; left: 20%;">☁️</span>
        <span class="decor-item" style="bottom: 20%; right: 10%;">🌙</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSelect',
  data() {
    return {
      user: null
    }
  },
  created() {
    this.loadUser()
    if (!this.user || (this.user.role !== 'admin' && !this.user.is_admin)) {
      this.$router.push('/home')
    }
  },
  methods: {
    loadUser() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch (e) {
          this.user = null
        }
      }
    },
    goToUser() {
      this.$router.push('/home')
    },
    goToAdmin() {
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
.admin-select-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF8F0 0%, #F5F0E6 100%);
  position: relative;
  padding: 20px;
}

.select-container {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
}

.select-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 56px;
  margin-bottom: 15px;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.select-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn-large {
  padding: 20px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.btn-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 28px;
}

.btn-text {
  font-weight: 600;
  font-size: 18px;
}

.btn-desc {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
  display: block;
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
</style>