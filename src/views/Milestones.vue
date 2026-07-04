<template>
  <div class="milestones-page">
    <div class="decoration-star" style="top: 120px; left: 8%;">⭐</div>
    <div class="decoration-moon" style="top: 300px; right: 5%;">🌙</div>
    
    <div class="page-header">
      <h1 class="page-title">成长里程碑</h1>
      <p class="page-desc">每一个第一次都值得纪念</p>
    </div>
    
    <div class="milestones-grid">
      <div 
        v-for="milestone in milestones" 
        :key="milestone.id"
        class="milestone-card card"
        :class="{ unlocked: milestone.is_unlocked, locked: !milestone.is_unlocked }"
        @click="showDetail(milestone)"
      >
        <div class="card-icon" :style="{ background: milestone.is_unlocked ? milestone.color : '#E8E4DF' }">
          {{ getIcon(milestone.icon) }}
        </div>
        <div class="card-title">{{ milestone.title }}</div>
        <div class="card-date" v-if="milestone.actual_date">
          {{ formatDate(milestone.actual_date) }}
        </div>
        <div class="card-date locked-date" v-else>
          {{ formatDate(milestone.target_date) }} 待解锁
        </div>
        <div class="card-desc">{{ milestone.description }}</div>
      </div>
    </div>
    
    <div v-if="showDetailModal" class="detail-modal" @click="closeDetail">
      <div class="detail-content" @click.stop>
        <button class="close-btn" @click="closeDetail">✕</button>
        <div class="detail-icon" :style="{ background: selectedMilestone?.is_unlocked ? selectedMilestone.color : '#E8E4DF' }">
          {{ getIcon(selectedMilestone?.icon) }}
        </div>
        <h2 class="detail-title">{{ selectedMilestone?.title }}</h2>
        <div class="detail-status" :class="{ unlocked: selectedMilestone?.is_unlocked }">
          {{ selectedMilestone?.is_unlocked ? '已达成' : '待解锁' }}
        </div>
        <div class="detail-date-info">
          <div v-if="selectedMilestone?.actual_date">
            <span class="info-label">达成日期：</span>
            <span>{{ formatDate(selectedMilestone.actual_date) }}</span>
          </div>
          <div v-else>
            <span class="info-label">目标日期：</span>
            <span>{{ formatDate(selectedMilestone.target_date) }}</span>
          </div>
        </div>
        <div class="detail-desc">{{ selectedMilestone?.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Milestones',
  data() {
    return {
      milestones: [],
      showDetailModal: false,
      selectedMilestone: null
    }
  },
  created() {
    this.loadMilestones()
  },
  methods: {
    loadMilestones() {
      this.axios.get('/api/milestones').then(res => {
        if (res.data.status === 200) {
          this.milestones = res.data.data
        }
      }).catch(() => {})
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
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    showDetail(milestone) {
      this.selectedMilestone = milestone
      this.showDetailModal = true
    },
    closeDetail() {
      this.showDetailModal = false
      this.selectedMilestone = null
    }
  }
}
</script>

<style scoped>
.milestones-page {
  position: relative;
  padding: 80px 20px 40px;
}

.decoration-star,
.decoration-moon {
  position: fixed;
  font-size: 32px;
  opacity: 0.15;
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

.milestones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.milestone-card {
  padding: 24px;
  text-align: center;
  cursor: pointer;
}

.milestone-card.locked {
  opacity: 0.6;
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 20px;
  transition: transform 0.3s ease;
}

.milestone-card:hover .card-icon {
  transform: scale(1.1);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.card-date {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.locked-date {
  color: var(--color-text-light);
}

.card-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.detail-modal {
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

.detail-content {
  background: white;
  padding: 40px;
  border-radius: var(--radius-xl);
  text-align: center;
  max-width: 450px;
  width: 90%;
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

.detail-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  margin: 0 auto 24px;
}

.detail-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.detail-status {
  display: inline-block;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-light);
  background: var(--bg-secondary);
  margin-bottom: 20px;
}

.detail-status.unlocked {
  color: #6BCB77;
  background: rgba(107, 203, 119, 0.1);
}

.detail-date-info {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.info-label {
  font-weight: 500;
}

.detail-desc {
  font-size: 16px;
  color: var(--color-text-primary);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .milestones-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .milestone-card {
    padding: 20px;
  }
  
  .card-icon {
    width: 65px;
    height: 65px;
    font-size: 28px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-desc {
    font-size: 13px;
  }
  
  .detail-content {
    padding: 30px 24px;
    margin: 15px;
  }
  
  .detail-title {
    font-size: 24px;
  }
  
  .detail-icon {
    width: 80px;
    height: 80px;
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .milestones-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .milestone-card {
    padding: 16px;
  }
  
  .card-icon {
    width: 55px;
    height: 55px;
    font-size: 24px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-desc {
    font-size: 12px;
  }
}
</style>