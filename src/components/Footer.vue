<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="days-born">
        <span class="label">{{ aboutInfo.baby_name }}来到世界的第</span>
        <span class="days-number">{{ aboutInfo.days_born || 0 }}</span>
        <span class="label">天</span>
      </div>
      <div class="footer-message">{{ aboutInfo.footer_message || '慢慢长大，岁岁平安' }}</div>
      <div class="footer-copyright">
        © 2026 {{ aboutInfo.baby_name }}的成长日记 | 建站日期：2026年7月1日
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    aboutInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  padding: 40px 20px 30px;
  text-align: center;
  margin-top: auto;
}

.footer-container {
  max-width: 800px;
  margin: 0 auto;
}

.days-born {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.days-number {
  font-size: 36px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: var(--font-family-number);
}

.footer-message {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  display: inline-block;
}

.footer-copyright {
  font-size: 12px;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .days-number {
    font-size: 28px;
  }
  
  .label {
    font-size: 13px;
  }
  
  .footer-message {
    font-size: 15px;
  }
  
  .footer {
    padding: 30px 15px 25px;
  }
}
</style>