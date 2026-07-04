<template>
  <div class="timeline-page">
    <div class="page-header">
      <h1 class="page-title">成长时光轴</h1>
      <p class="page-desc">记录每一个珍贵的成长瞬间</p>
    </div>
    
    <div class="timeline-container">
      <div class="timeline-main">
        <div class="timeline-line"></div>
        
        <div 
          v-for="record in records" 
          :key="record.id"
          class="timeline-card-wrapper"
          :class="{ left: record.id % 2 === 0, right: record.id % 2 === 1 }"
        >
          <div class="timeline-card card">
            <div class="card-date">
              <span class="date-day">{{ formatDay(record.record_date) }}</span>
              <span class="date-month">{{ formatMonth(record.record_date) }}</span>
            </div>
            <div class="card-body">
              <div class="card-title">{{ record.title }}</div>
              <div class="card-content">{{ record.content }}</div>
              <div v-if="record.imageUrls && record.imageUrls.length" class="card-images">
                <img 
                  v-for="(img, idx) in record.imageUrls" 
                  :key="idx"
                  :src="img" 
                  :alt="record.title"
                  class="card-image-item"
                  @click="showImageModal(img)"
                >
              </div>
              <div v-if="record.videoUrls && record.videoUrls.length" class="card-videos">
                <div 
                  v-for="(video, idx) in record.videoUrls" 
                  :key="idx" 
                  class="video-wrapper"
                  @click="openVideoModal(video)"
                >
                  <video 
                    controls 
                    class="card-video-item"
                    playsinline
                    webkit-playsinline
                    preload="auto"
                    width="100%"
                    height="auto"
                    @error="handleVideoError($event, video)"
                    @loadedmetadata="handleVideoLoaded($event)"
                  >
                    <source :src="video" type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'">
                    <source :src="video" type="video/webm; codecs='vp8, vorbis'">
                    您的浏览器不支持视频播放
                  </video>
                  <div class="video-play-overlay">
                    <span class="play-icon">▶</span>
                  </div>
                </div>
              </div>
              <div class="card-meta">
                <span class="meta-age">{{ record.month_age }}</span>
              </div>
            </div>
          </div>
          <div class="timeline-node"></div>
        </div>
        
        <div v-if="loading" class="loading-more">
          <span class="loading-icon">👣</span>
          <span>加载中...</span>
        </div>
        
        <div v-if="records.length === 0" class="empty-state">
          <span class="empty-icon">📸</span>
          <p>还没有成长记录</p>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="image-modal" @click="closeImageModal">
      <img :src="selectedImage" :alt="''" @click.stop>
      <div class="modal-close" @click="closeImageModal">✕</div>
    </div>
    
    <div v-if="showVideoModal" class="video-modal" @click="closeVideoModal">
      <video 
        :src="selectedVideo" 
        controls 
        class="video-modal-player"
        autoplay
        playsinline
        webkit-playsinline
      >
        您的浏览器不支持视频播放
      </video>
      <div class="modal-close" @click="closeVideoModal">✕</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  data() {
    return {
      records: [],
      loading: false,
      showModal: false,
      selectedImage: '',
      showVideoModal: false,
      selectedVideo: ''
    }
  },
  created() {
    this.loadRecords()
  },
  methods: {
    loadRecords() {
      this.loading = true
      this.axios.get('/api/timeline?page=1&pageSize=20').then(res => {
        if (res.data.status === 200) {
          this.records = res.data.data.map(r => ({
            ...r,
            imageUrls: r.images ? r.images.split(',').filter(img => img.trim()) : [],
            videoUrls: r.videos ? r.videos.split(',').filter(v => v.trim()) : []
          }))
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatDay(dateStr) {
      return dateStr ? dateStr.substring(8, 10) : ''
    },
    formatMonth(dateStr) {
      return dateStr ? dateStr.substring(5, 7) + '月' : ''
    },
    showImageModal(img) {
      this.selectedImage = img
      this.showModal = true
    },
    closeImageModal() {
      this.showModal = false
      this.selectedImage = ''
    },
    handleVideoError(event, videoUrl) {
      console.error('视频加载错误:', event.target.error, videoUrl)
    },
    handleVideoLoaded(event) {
      const video = event.target
      if (video.videoWidth && video.videoHeight) {
        video.style.height = 'auto'
      }
    },
    openVideoModal(video) {
      this.selectedVideo = video
      this.showVideoModal = true
    },
    closeVideoModal() {
      this.showVideoModal = false
      this.selectedVideo = ''
    }
  }
}
</script>

<style scoped>
.timeline-page {
  padding: 80px 20px 40px;
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

.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-main {
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 10px,
    #E8E4DF 10px,
    #E8E4DF 20px
  );
  transform: translateX(-50%);
}

.timeline-card-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}

.timeline-card-wrapper.left {
  justify-content: flex-start;
}

.timeline-card-wrapper.right {
  justify-content: flex-end;
}

.timeline-card {
  width: 45%;
  padding: 24px;
  position: relative;
}

.card-date {
  position: absolute;
  top: -15px;
  left: -25px;
  text-align: center;
}

.timeline-card-wrapper.right .card-date {
  left: auto;
  right: -25px;
}

.date-day {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
}

.date-month {
  display: block;
  font-size: 12px;
  color: var(--color-text-light);
}

.card-body {
  margin-left: 20px;
}

.timeline-card-wrapper.right .card-body {
  margin-left: 0;
  margin-right: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.card-content {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
}

.card-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.card-image-item {
  width: calc(50% - 4px);
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.card-videos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.video-wrapper {
  width: 100%;
  min-height: 240px;
  background: #000;
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}

.card-video-item {
  width: 100%;
  height: auto;
  min-height: 240px;
  max-height: 400px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.video-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.video-wrapper:hover .video-play-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 48px;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.card-meta {
  display: flex;
  gap: 10px;
}

.meta-age {
  font-size: 12px;
  color: var(--color-text-light);
  padding: 4px 10px;
  background: rgba(142, 184, 217, 0.1);
  border-radius: var(--radius-sm);
}

.timeline-node {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  transform: translateX(-50%);
  box-shadow: 0 0 0 4px rgba(142, 184, 217, 0.2);
}

.loading-more {
  text-align: center;
  padding: 30px;
}

.loading-icon {
  font-size: 28px;
  animation: rotate 2s linear infinite;
}

@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
    transform: none;
  }
  
  .timeline-card-wrapper {
    justify-content: flex-end;
    margin-bottom: 24px;
  }
  
  .timeline-card-wrapper.left,
  .timeline-card-wrapper.right {
    justify-content: flex-end;
  }
  
  .timeline-card {
    width: calc(100% - 50px);
    padding: 20px;
  }
  
  .card-date {
    left: -45px;
    top: 0;
  }
  
  .timeline-card-wrapper.right .card-date {
    right: auto;
    left: -45px;
  }
  
  .card-body {
    margin-left: 0;
  }
  
  .timeline-card-wrapper.right .card-body {
    margin-right: 0;
    margin-left: 0;
  }
  
  .timeline-node {
    left: 20px;
    transform: translateX(-50%);
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .card-images {
    flex-direction: column;
  }
  
  .card-image-item {
    width: 100%;
    height: auto;
    min-height: 150px;
  }
  
  .video-wrapper {
    min-height: 180px;
  }
  
  .card-video-item {
    min-height: 180px;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.video-modal-player {
  max-width: 90%;
  max-height: 90%;
  width: 100%;
}

@media (max-width: 768px) {
  .timeline-line {
    left: 30px;
  }
  
  .timeline-card-wrapper {
    justify-content: flex-end !important;
  }
  
  .timeline-card {
    width: calc(100% - 60px);
  }
  
  .card-date {
    left: -35px !important;
    right: auto !important;
  }
  
  .timeline-node {
    left: 30px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .card-video-item {
    height: 120px;
  }
}
</style>