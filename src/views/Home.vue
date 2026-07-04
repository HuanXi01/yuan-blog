<template>
  <div class="home-page">
    <div class="decoration-cloud" style="top: 100px; left: 5%;">☁️</div>
    <div class="decoration-star" style="top: 200px; right: 10%;">⭐</div>
    <div class="decoration-moon" style="top: 350px; left: 8%;">🌙</div>
    
    <section class="banner-section">
      <div class="banner-bg"></div>
      <div class="banner-content">
        <h1 class="banner-title">{{ aboutInfo.baby_name }}的成长日记</h1>
        <p class="banner-subtitle">{{ aboutInfo.welcome_message || '欢迎来到我的小世界' }}</p>
        <div class="days-counter">
          <span class="counter-label">来到世界的第</span>
          <span class="counter-number">{{ aboutInfo.days_born || 0 }}</span>
          <span class="counter-label">天</span>
        </div>
        <div class="scroll-hint animate-float">
          <span>↓</span>
          <span>下滑浏览</span>
        </div>
      </div>
    </section>
    
    <section class="latest-section">
      <div class="section-title">
        <h2>最近的小变化</h2>
        <div class="decoration-line"></div>
      </div>
      <div class="latest-cards">
        <div 
          v-for="(record, index) in latestRecords" 
          :key="record.id" 
          class="latest-card card animate-fadeInUp"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="goToTimeline(record.id)"
        >
          <div class="card-image">
            <img 
              :src="record.images || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20baby%20photo%20soft%20warm%20light&image_size=square_hd'" 
              :alt="record.title"
            >
          </div>
          <div class="card-content">
            <div class="card-date">{{ formatDate(record.record_date) }}</div>
            <div class="card-title">{{ record.title }}</div>
            <div class="card-summary">{{ record.content || '暂无描述' }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="milestones-section">
      <div class="section-title">
        <h2>成长小脚印</h2>
        <div class="decoration-line"></div>
      </div>
      <div class="milestones-row">
        <div 
          v-for="milestone in unlockedMilestones" 
          :key="milestone.id" 
          class="milestone-item"
          :class="{ unlocked: milestone.is_unlocked }"
          @click="goToMilestones"
        >
          <div class="milestone-icon" :style="{ background: milestone.is_unlocked ? milestone.color : '#E8E4DF' }">
            {{ getIcon(milestone.icon) }}
          </div>
          <div class="milestone-name">{{ milestone.title }}</div>
          <div class="milestone-date" v-if="milestone.actual_date">{{ formatDate(milestone.actual_date) }}</div>
        </div>
      </div>
      <div class="view-more" @click="goToMilestones">
        查看全部里程碑 →
      </div>
    </section>
    
    <section class="wish-section">
      <div class="wish-content">
        <span class="wish-line"></span>
        <p class="wish-text">愿你一生明朗，万物可爱</p>
        <span class="wish-line"></span>
      </div>
    </section>
    
    <div v-if="showAnniversaryModal" class="modal-overlay" @click="closeModal">
      <div class="anniversary-modal" @click.stop>
        <div class="modal-icon" :style="{ background: anniversaryColor }">🎉</div>
        <h3 class="modal-title">{{ anniversaryText }}</h3>
        <p class="modal-desc">{{ anniversaryDesc }}</p>
        <button class="btn btn-primary" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    aboutInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      latestRecords: [],
      unlockedMilestones: [],
      showAnniversaryModal: false,
      anniversaryText: '',
      anniversaryDesc: '',
      anniversaryColor: '#8EB8D9'
    }
  },
  created() {
    this.loadData()
    this.checkAnniversary()
  },
  methods: {
    loadData() {
      this.axios.get('/api/timeline/latest?limit=4').then(res => {
        if (res.data.status === 200) {
          this.latestRecords = res.data.data
        }
      }).catch(() => {})
      
      this.axios.get('/api/milestones/unlocked').then(res => {
        if (res.data.status === 200) {
          this.unlockedMilestones = res.data.data.slice(0, 6)
        }
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    getIcon(iconName) {
      const icons = {
        'moon': '🌙',
        'cake': '🎂',
        'smile': '😊',
        'arrow-up': '⬆️',
        'refresh-cw': '🔄',
        'tooth': '🦷',
        'user': '👶',
        'footprints': '👣',
        'accessibility': '🦵',
        'volume-2': '🗣️',
        'gift': '🎁',
        'star': '⭐'
      }
      return icons[iconName] || '⭐'
    },
    goToTimeline(id) {
      this.$router.push(`/timeline`)
    },
    goToMilestones() {
      this.$router.push('/milestones')
    },
    checkAnniversary() {
      const birthDate = new Date(this.aboutInfo.birth_date || '2026-01-01')
      const today = new Date()
      const diffTime = Math.abs(today - birthDate)
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (days === 30) {
        this.showAnniversaryModal = true
        this.anniversaryText = `${this.aboutInfo.baby_name}满30天啦！`
        this.anniversaryDesc = '恭喜宝贝满月啦，健康快乐成长！'
        this.anniversaryColor = '#FFD93D'
      } else if (days === 100) {
        this.showAnniversaryModal = true
        this.anniversaryText = `${this.aboutInfo.baby_name}满100天啦！`
        this.anniversaryDesc = '百天快乐，愿你每一天都充满阳光！'
        this.anniversaryColor = '#FF6B9D'
      } else if (days === 365) {
        this.showAnniversaryModal = true
        this.anniversaryText = `${this.aboutInfo.baby_name}一周岁啦！`
        this.anniversaryDesc = '生日快乐！愿你健康快乐成长！'
        this.anniversaryColor = '#FF6B6B'
      } else if (days > 0 && days % 30 === 0) {
        const months = days / 30
        this.showAnniversaryModal = true
        this.anniversaryText = `${this.aboutInfo.baby_name}满${months}个月啦！`
        this.anniversaryDesc = '又长大了一个月，继续加油哦！'
        this.anniversaryColor = '#6BCB77'
      }
    },
    closeModal() {
      this.showAnniversaryModal = false
    }
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
}

.decoration-cloud,
.decoration-star,
.decoration-moon {
  position: fixed;
  font-size: 32px;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.banner-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #FAF8F5 0%, #F0EBE6 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 20px;
}

.banner-title {
  font-size: 48px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.banner-subtitle {
  font-size: 20px;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
}

.days-counter {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
}

.counter-label {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.counter-number {
  font-size: 80px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: var(--font-family-number);
}

.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-light);
  font-size: 14px;
}

.latest-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.latest-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.latest-card {
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.latest-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-date {
  font-size: 12px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.card-summary {
  font-size: 14px;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.milestones-section {
  padding: 60px 20px;
  background: var(--bg-secondary);
}

.milestones-row {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.milestone-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.milestone-item.unlocked {
  opacity: 1;
}

.milestone-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  transition: transform 0.3s ease;
}

.milestone-item:hover .milestone-icon {
  transform: scale(1.1);
}

.milestone-name {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.milestone-date {
  font-size: 12px;
  color: var(--color-text-light);
}

.view-more {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
}

.wish-section {
  padding: 60px 20px;
  text-align: center;
}

.wish-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.wish-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.wish-text {
  font-size: 24px;
  color: var(--color-text-primary);
  font-weight: 500;
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
  z-index: 3000;
}

.anniversary-modal {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  margin: 0 auto 24px;
}

.modal-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.modal-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 32px;
  }
  
  .banner-subtitle {
    font-size: 17px;
  }
  
  .counter-number {
    font-size: 56px;
  }
  
  .counter-label {
    font-size: 15px;
  }
  
  .wish-text {
    font-size: 20px;
  }
  
  .milestones-row {
    gap: 20px;
  }
  
  .milestone-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
  
  .latest-section,
  .milestones-section,
  .wish-section {
    padding: 40px 15px;
  }
}
</style>