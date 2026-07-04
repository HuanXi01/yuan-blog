<template>
  <div class="about-page">
    <div class="decoration-moon" style="top: 150px; left: 5%;">🌙</div>
    <div class="decoration-star" style="top: 400px; right: 8%;">⭐</div>
    
    <div class="page-header">
      <h1 class="page-title">关于</h1>
      <p class="page-desc">了解更多关于宇安的故事</p>
    </div>
    
    <div class="info-card card">
      <div class="card-header">
        <div class="baby-photo">
          <img src="/pImages/微信图片_20260704191311_311_92.jpg" alt="宇安">
        </div>
        <div class="baby-name">{{ aboutInfo.baby_name }}</div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-icon">📅</span>
          <div class="info-content">
            <span class="info-label">出生日期</span>
            <span class="info-value">{{ formatDate(aboutInfo.birth_date) }}</span>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">⚖️</span>
          <div class="info-content">
            <span class="info-label">出生体重</span>
            <span class="info-value">{{ aboutInfo.birth_weight }}kg</span>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">📏</span>
          <div class="info-content">
            <span class="info-label">出生身高</span>
            <span class="info-value">{{ aboutInfo.birth_height }}cm</span>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">👣</span>
          <div class="info-content">
            <span class="info-label">小名寓意</span>
            <span class="info-value">{{ aboutInfo.nickname_meaning }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="story-card card">
      <div class="card-title">建站初衷</div>
      <div class="story-content">
        <p>想把你成长的点点滴滴都记下来，等你长大慢慢讲给你听。</p>
        <p>从你来到这个世界的第一天起，每一个微笑、每一次哭泣、每一步成长，都是爸爸妈妈心中最珍贵的礼物。</p>
        <p>这个小小的博客，就是为了记录这些美好瞬间而存在的。希望多年以后，当你翻开这些记录，能感受到我们对你深深的爱。</p>
      </div>
    </div>
    
    <div class="wish-card">
      <div class="wish-text">
        <span class="wish-quote">"</span>
        <span>愿你一生明朗，万物可爱。愿你眼里有光，心中有爱，脚下有路。</span>
        <span class="wish-quote">"</span>
      </div>
      <div class="wish-author">—— 爸爸妈妈</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  props: {
    aboutInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
  }
}
</script>

<style scoped>
.about-page {
  position: relative;
  padding: 80px 20px 40px;
}

.decoration-moon,
.decoration-star {
  position: fixed;
  font-size: 32px;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
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
}

.info-card,
.story-card {
  max-width: 700px;
  margin: 0 auto 30px;
  padding: 30px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.baby-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 15px rgba(142, 184, 217, 0.2);
}

.baby-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.baby-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  font-size: 24px;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-primary);
}

.story-content {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.story-content p {
  margin-bottom: 16px;
}

.wish-card {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(142, 184, 217, 0.1) 0%, rgba(255, 217, 61, 0.1) 100%);
  border-radius: var(--radius-xl);
}

.wish-text {
  font-size: 20px;
  color: var(--color-text-primary);
  line-height: 1.8;
  font-weight: 500;
}

.wish-quote {
  font-size: 36px;
  color: var(--color-primary);
  margin: 0 10px;
}

.wish-author {
  margin-top: 24px;
  font-size: 14px;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .info-card,
  .story-card {
    padding: 20px;
  }
  
  .baby-photo {
    width: 120px;
    height: 120px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .wish-text {
    font-size: 18px;
  }
  
  .story-content {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .baby-photo {
    width: 100px;
    height: 100px;
  }
  
  .baby-name {
    font-size: 20px;
  }
  
  .info-card,
  .story-card {
    padding: 16px;
  }
  
  .wish-text {
    font-size: 16px;
    line-height: 1.6;
  }
  
  .wish-quote {
    font-size: 28px;
  }
  
  .wish-card {
    padding: 25px 15px;
  }
}
</style>