<template>
  <div class="diaries-page">
    <div class="decoration-cloud" style="top: 100px; right: 8%;">☁️</div>
    
    <div class="page-header">
      <h1 class="page-title">成长日记</h1>
      <p class="page-desc">记录每一个美好的成长故事</p>
    </div>
    
    <div class="diaries-list">
      <div 
          v-for="diary in diaries" 
          :key="diary.id"
          class="diary-card card"
          @click="goToDetail(diary.id)"
        >
        <div class="diary-image">
          <img 
            :src="diary.cover_image && diary.cover_image.startsWith('http') ? diary.cover_image : (diary.cover_image ? baseUrl + diary.cover_image : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=baby%20journal%20notebook%20soft%20warm&image_size=square_hd')" 
            :alt="diary.title"
          >
        </div>
        <div class="diary-content">
          <div class="diary-header">
            <h3 class="diary-title">{{ diary.title }}</h3>
            <span class="diary-age">{{ diary.month_age }}</span>
          </div>
          <div class="diary-date">{{ formatDate(diary.publish_date) }}</div>
          <div class="diary-summary">{{ diary.summary }}</div>
          <div class="diary-footer">
            <span class="media-icons">
              <span v-if="hasImages(diary.images)" class="media-icon">📷</span>
              <span v-if="hasVideos(diary.videos)" class="media-icon">🎬</span>
            </span>
            <span class="view-count">👁️ {{ diary.view_count }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="diaries.length === 0" class="empty-state">
      <span class="empty-icon">📖</span>
      <p>还没有成长日记</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Diaries',
  data() {
    return {
      diaries: [],
      baseUrl: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:3000'
    }
  },
  created() {
    this.loadDiaries()
  },
  methods: {
    loadDiaries() {
      this.axios.get('/api/diaries').then(res => {
        if (res.data.status === 200) {
          this.diaries = res.data.data
        }
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    hasImages(images) {
      return images && images.trim() !== '' && images.split(',').filter(i => i.trim()).length > 0
    },
    hasVideos(videos) {
      return videos && videos.trim() !== '' && videos.split(',').filter(v => v.trim()).length > 0
    },
    goToDetail(id) {
      console.log('[DEBUG] 点击日记卡片，id:', id)
      console.log('[DEBUG] this.$router:', this.$router)
      console.log('[DEBUG] 当前路由:', this.$route.path)
      try {
        this.$router.push(`/diaries/${id}`).then(() => {
          console.log('[DEBUG] 路由跳转成功')
        }).catch(err => {
          console.error('[DEBUG] 路由跳转失败:', err)
        })
      } catch (e) {
        console.error('[DEBUG] 路由跳转异常:', e)
      }
    }
  }
}
</script>

<style scoped>
.diaries-page {
  position: relative;
  padding: 80px 20px 40px;
}

.decoration-cloud {
  position: fixed;
  font-size: 40px;
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
}

.diaries-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.diary-card {
  display: flex;
  gap: 24px;
  padding: 20px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.diary-image {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.diary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.diary-card:hover .diary-image img {
  transform: scale(1.05);
}

.diary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.diary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.diary-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.diary-age {
  font-size: 12px;
  color: var(--color-primary);
  padding: 4px 10px;
  background: rgba(142, 184, 217, 0.1);
  border-radius: var(--radius-sm);
}

.diary-date {
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 12px;
}

.diary-summary {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.media-icons {
  display: flex;
  gap: 6px;
}

.media-icon {
  font-size: 14px;
}

.view-count {
  font-size: 13px;
  color: var(--color-text-light);
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

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .diaries-list {
    gap: 16px;
  }
  
  .diary-card {
    flex-direction: column;
    padding: 16px;
  }
  
  .diary-image {
    width: 100%;
    height: 200px;
  }
  
  .diary-title {
    font-size: 18px;
  }
  
  .diary-summary {
    font-size: 14px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .diary-image {
    height: 160px;
  }
  
  .diary-title {
    font-size: 16px;
  }
  
  .diary-summary {
    font-size: 13px;
  }
}
</style>