<template>
  <nav 
    class="navbar" 
    :class="{ 'navbar-solid': isScrolled }"
    @scroll="handleScroll"
  >
    <div class="navbar-container">
      <div class="navbar-left" @click="goHome">
        <span class="footprint-icon">👣</span>
        <span class="site-name">{{ aboutInfo.baby_name }}的小世界</span>
      </div>
      
      <div class="navbar-menu">
        <router-link 
          v-for="item in visibleMenuItems" 
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: currentPath === item.path }"
          exact
        >
          {{ item.name }}
        </router-link>
      </div>
      
      <div class="navbar-right">
        <template v-if="user">
          <span class="user-nickname">{{ user.nickname || user.username }}</span>
          <router-link to="/admin" v-if="isAdmin" class="menu-item admin-item">管理后台</router-link>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <router-link to="/login" class="menu-item login-item">登录</router-link>
        </template>
      </div>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="menu-icon">☰</span>
      </button>
    </div>
    
    <div class="mobile-menu-overlay" v-if="showMobileMenu" @click="toggleMobileMenu">
      <div class="mobile-menu-content" @click.stop>
        <button class="close-btn" @click="toggleMobileMenu">✕</button>
        <div class="mobile-baby-name">
          <span class="footprint-icon">👣</span>
          <span>{{ aboutInfo.baby_name }}的小世界</span>
        </div>
        <router-link 
          v-for="item in visibleMenuItems" 
          :key="item.path"
          :to="item.path"
          class="mobile-menu-item"
          :class="{ active: currentPath === item.path }"
          @click.native="toggleMobileMenu"
          exact
        >
          {{ item.name }}
        </router-link>
        <div class="mobile-user-section">
          <template v-if="user">
            <div class="user-info">
              <span class="user-icon">👤</span>
              <span>{{ user.nickname || user.username }}</span>
            </div>
            <router-link to="/admin" v-if="isAdmin" class="mobile-menu-item admin-link" @click.native="toggleMobileMenu">管理后台</router-link>
            <button class="logout-btn" @click="handleLogout">退出登录</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-menu-item login-link" @click.native="toggleMobileMenu">登录</router-link>
            <router-link to="/register" class="mobile-menu-item register-link" @click.native="toggleMobileMenu">注册</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    aboutInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isScrolled: false,
      showMobileMenu: false,
      currentPath: '',
      user: null,
      menuItems: [
        { path: '/home', name: '首页' },
        { path: '/timeline', name: '时光轴' },
        { path: '/milestones', name: '里程碑' },
        { path: '/diaries', name: '成长日记' },
        { path: '/growth', name: '成长数据' },
        { path: '/messages', name: '留言墙' },
        { path: '/about', name: '关于' }
      ]
    }
  },
  computed: {
    isAdmin() {
      return this.user && (this.user.role === 'admin' || this.user.is_admin)
    },
    visibleMenuItems() {
      return this.menuItems
    }
  },
  created() {
    this.currentPath = this.$route.path
    this.loadUser()
    window.addEventListener('scroll', this.handleScroll)
    this.$router.beforeEach((to, from, next) => {
      this.showMobileMenu = false
      next()
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    '$route.path' (newPath) {
      this.currentPath = newPath
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
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    goHome() {
      this.$router.push('/home')
    },
    handleLogout() {
      localStorage.removeItem('user')
      this.user = null
      this.$message.success('退出成功')
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  background: rgba(250, 248, 245, 0.7);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(232, 228, 223, 0.5);
}

.navbar-solid {
  background: rgba(250, 248, 245, 0.98);
  box-shadow: 0 2px 12px rgba(142, 184, 217, 0.08);
}

.navbar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.footprint-icon {
  font-size: 24px;
}

.site-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.navbar-menu {
  display: flex;
  gap: 24px;
}

.menu-item {
  text-decoration: none;
  font-size: 15px;
  color: var(--color-text-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.menu-item:hover {
  color: var(--color-primary);
  background: rgba(142, 184, 217, 0.1);
}

.menu-item.active {
  color: var(--color-primary);
  font-weight: 500;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-nickname {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
}

.admin-item {
  background: rgba(142, 184, 217, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.admin-item:hover {
  background: rgba(142, 184, 217, 0.2);
}

.login-item {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.login-item:hover {
  background: #7BA8C9;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.logout-btn:hover {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-primary);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.mobile-menu-content {
  background: var(--bg-primary);
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border-radius: var(--radius-xl);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.mobile-baby-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: var(--color-text-primary);
}

.mobile-menu-item {
  display: block;
  text-align: center;
  padding: 16px;
  margin-bottom: 8px;
  font-size: 20px;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.mobile-menu-item:hover,
.mobile-menu-item.active {
  color: var(--color-primary);
  background: rgba(142, 184, 217, 0.1);
}

.mobile-user-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #E8E4DF;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 15px;
}

.user-icon {
  font-size: 18px;
}

.admin-link {
  background: rgba(142, 184, 217, 0.1);
  color: var(--color-primary);
  font-weight: 500;
}

.login-link {
  background: var(--color-primary);
  color: white;
  font-weight: 500;
}

.login-link:hover {
  background: #7BA8C9;
  color: white;
}

.register-link {
  background: rgba(107, 203, 119, 0.1);
  color: #6BCB77;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .navbar-right {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .site-name {
    font-size: 18px;
  }
}
</style>