<template>
  <div class="diary-detail-page">
    <div class="page-container">
      <div class="diary-header">
        <div class="back-btn" @click="goBack">← 返回</div>
        <div class="header-content">
          <h1 class="diary-title">{{ diary?.title }}</h1>
          <div class="diary-meta">
            <span class="meta-date">{{ formatDate(diary?.publish_date) }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-age">{{ diary?.month_age }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-view">👁️ {{ diary?.view_count }}</span>
          </div>
        </div>
      </div>
      
      <div class="diary-body">
        <div class="diary-content">
          <p v-for="(paragraph, index) in splitContent" :key="index" class="content-paragraph">
            {{ paragraph }}
          </p>
        </div>
        
        <div v-if="diary?.cover_image" class="diary-image">
          <img :src="diary.cover_image" :alt="diary.title">
        </div>

        <div v-if="imageList.length > 0" class="media-section">
          <h3 class="media-title">📷 图片</h3>
          <div class="image-grid">
            <div 
              v-for="(img, index) in imageList" 
              :key="index"
              class="image-item"
              @click="showImageModal(img)"
            >
              <img :src="img" :alt="`图片${index + 1}`">
            </div>
          </div>
        </div>

        <div v-if="videoList.length > 0" class="media-section">
          <h3 class="media-title">🎬 视频</h3>
          <div class="video-list">
            <div v-for="(video, index) in videoList" :key="index" class="video-item">
              <video :src="video" controls class="video-player">
                您的浏览器不支持视频播放
              </video>
            </div>
          </div>
        </div>
      </div>
      
      <div class="nav-buttons">
        <button 
          class="nav-btn prev" 
          v-if="prevNext?.prev_id" 
          @click="goToDiary(prevNext.prev_id)"
        >
          ← {{ prevNext.prev_title }}
        </button>
        <button 
          class="nav-btn next" 
          v-if="prevNext?.next_id" 
          @click="goToDiary(prevNext.next_id)"
        >
          {{ prevNext.next_title }} →
        </button>
      </div>
    </div>

    <div v-if="showModal" class="image-modal" @click="closeImageModal">
      <img :src="selectedImage" :alt="''" @click.stop>
      <div class="modal-close" @click="closeImageModal">✕</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiaryDetail',
  data() {
    return {
      diary: null,
      prevNext: null,
      showModal: false,
      selectedImage: '',
      baseUrl: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:3000'
    }
  },
  computed: {
    splitContent() {
      if (!this.diary?.content) return []
      return this.diary.content.split(/[\n\r]+/).filter(p => p.trim())
    },
    imageList() {
      if (!this.diary?.images) return []
      return this.diary.images.split(',').filter(img => img.trim()).map(img => 
        img.startsWith('http') ? img : this.baseUrl + img
      )
    },
    videoList() {
      if (!this.diary?.videos) return []
      return this.diary.videos.split(',').filter(v => v.trim()).map(v => 
        v.startsWith('http') ? v : this.baseUrl + v
      )
    }
  },
  created() {
    this.loadDiary()
    this.loadPrevNext()
  },
  methods: {
    loadDiary() {
      const id = this.$route.params.id
      this.axios.get(`/api/diaries/${id}`).then(res => {
        if (res.data.status === 200) {
          this.diary = res.data.data
        }
      }).catch(() => {})
    },
    loadPrevNext() {
      const id = this.$route.params.id
      this.axios.get(`/api/diaries/${id}/prevnext`).then(res => {
        if (res.data.status === 200) {
          this.prevNext = res.data.data
        }
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    goBack() {
      this.$router.push('/diaries')
    },
    goToDiary(id) {
      this.$router.push(`/diaries/${id}`)
    },
    showImageModal(img) {
      this.selectedImage = img
      this.showModal = true
    },
    closeImageModal() {
      this.showModal = false
      this.selectedImage = ''
    }
  }
}
</script>

<style scoped>
.diary-detail-page {
  padding: 80px 20px 40px;
}

.page-container {
  max-width: 700px;
  margin: 0 auto;
}

.diary-header {
  margin-bottom: 40px;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.header-content {
  text-align: center;
}

.diary-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.diary-meta {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.meta-divider {
  margin: 0 8px;
  color: var(--color-text-light);
}

.diary-body {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
}

.diary-content {
  margin-bottom: 30px;
}

.content-paragraph {
  font-size: 17px;
  color: var(--color-text-primary);
  line-height: 1.9;
  margin-bottom: 20px;
}

.diary-image {
  margin-top: 30px;
}

.diary-image img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.media-section {
  margin-top: 40px;
}

.media-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.image-item {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
}

.image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.image-item:hover img {
  transform: scale(1.05);
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-item {
  width: 100%;
}

.video-player {
  width: 100%;
  max-height: 400px;
  border-radius: var(--radius-md);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 20px;
}

.nav-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn.prev {
  background: var(--bg-secondary);
  color: var(--color-text-primary);
}

.nav-btn.next {
  background: var(--color-primary);
  color: white;
}

.nav-btn.prev:hover {
  background: var(--border-color);
}

.nav-btn.next:hover {
  background: var(--color-primary-dark);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: zoom-out;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  border-radius: var(--radius-md);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 10px;
}

@media (max-width: 768px) {
  .diary-title {
    font-size: 26px;
  }
  
  .diary-body {
    padding: 24px;
  }
  
  .content-paragraph {
    font-size: 16px;
    line-height: 1.8;
  }
  
  .nav-buttons {
    flex-direction: column;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .image-item img {
    height: 100px;
  }
  
  .video-player {
    max-height: 300px;
  }
  
  .back-btn {
    font-size: 15px;
    padding: 8px 16px;
  }
}

@media (max-width: 480px) {
  .diary-title {
    font-size: 22px;
  }
  
  .diary-body {
    padding: 16px;
  }
  
  .content-paragraph {
    font-size: 15px;
    line-height: 1.7;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
  }
  
  .image-item img {
    height: auto;
    min-height: 120px;
  }
  
  .video-player {
    max-height: 220px;
  }
  
  .media-title {
    font-size: 16px;
  }
}
</style>