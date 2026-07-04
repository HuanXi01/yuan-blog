<template>
  <div class="growth-page">
    <div class="decoration-star" style="top: 120px; left: 5%;">⭐</div>
    
    <div class="page-header">
      <h1 class="page-title">成长小曲线</h1>
      <p class="page-desc">记录身高体重的变化轨迹</p>
    </div>
    
    <div class="chart-container card">
      <div class="chart-header">
        <h3 class="chart-title">生长曲线</h3>
      </div>
      <div ref="chartRef" class="chart-content"></div>
    </div>
    
    <div class="data-table card">
      <div class="table-header">
        <h3 class="table-title">历史数据</h3>
      </div>
      <table class="growth-table">
        <thead>
          <tr>
            <th>测量日期</th>
            <th>身高(cm)</th>
            <th>体重(kg)</th>
            <th>头围(cm)</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in growthData" :key="item.id">
            <td>{{ formatDate(item.measure_date) }}</td>
            <td>{{ item.height }}</td>
            <td>{{ item.weight }}</td>
            <td>{{ item.head_circumference || '-' }}</td>
            <td>{{ item.note || '-' }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="growthData.length === 0" class="empty-table">
        <span class="empty-icon">📏</span>
        <p>还没有测量数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Growth',
  data() {
    return {
      growthData: [],
      chartInstance: null
    }
  },
  mounted() {
    this.loadData()
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    loadData() {
      this.axios.get('/api/growth').then(res => {
        if (res.data.status === 200) {
          this.growthData = res.data.data
          this.initChart()
        }
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    initChart() {
      if (!this.$refs.chartRef) return
      
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      
      this.chartInstance = echarts.init(this.$refs.chartRef)
      
      const dates = this.growthData.map(item => this.formatDate(item.measure_date))
      const heights = this.growthData.map(item => item.height)
      const weights = this.growthData.map(item => item.weight)
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#E8E4DF',
          borderWidth: 1,
          textStyle: {
            color: '#3D3D3D'
          },
          formatter: (params) => {
            let result = `<strong>${this.growthData[params[0].dataIndex].measure_date}</strong><br/>`
            params.forEach(item => {
              result += `${item.seriesName}: ${item.value}${item.seriesName === '身高' ? 'cm' : 'kg'}<br/>`
            })
            return result
          }
        },
        legend: {
          data: ['身高', '体重'],
          bottom: 0,
          textStyle: {
            color: '#888888'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: {
            lineStyle: {
              color: '#E8E4DF'
            }
          },
          axisLabel: {
            color: '#888888'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '身高(cm)',
            nameTextStyle: {
              color: '#8EB8D9'
            },
            axisLine: {
              lineStyle: {
                color: '#E8E4DF'
              }
            },
            axisLabel: {
              color: '#888888'
            },
            splitLine: {
              lineStyle: {
                color: '#F5F2EE',
                type: 'dashed'
              }
            }
          },
          {
            type: 'value',
            name: '体重(kg)',
            nameTextStyle: {
              color: '#FFD93D'
            },
            axisLine: {
              lineStyle: {
                color: '#E8E4DF'
              }
            },
            axisLabel: {
              color: '#888888'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '身高',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#8EB8D9',
              width: 3
            },
            itemStyle: {
              color: '#8EB8D9',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(142, 184, 217, 0.3)' },
                { offset: 1, color: 'rgba(142, 184, 217, 0.05)' }
              ])
            },
            data: heights
          },
          {
            name: '体重',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#FFD93D',
              width: 3
            },
            itemStyle: {
              color: '#FFD93D',
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 217, 61, 0.3)' },
                { offset: 1, color: 'rgba(255, 217, 61, 0.05)' }
              ])
            },
            data: weights
          }
        ]
      }
      
      this.chartInstance.setOption(option)
      
      window.addEventListener('resize', this.handleResize)
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.growth-page {
  position: relative;
  padding: 80px 20px 40px;
}

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

.chart-container,
.data-table {
  max-width: 1000px;
  margin: 0 auto 30px;
  padding: 30px;
}

.chart-header,
.table-header {
  margin-bottom: 20px;
}

.chart-title,
.table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.chart-content {
  height: 400px;
}

.growth-table {
  width: 100%;
  border-collapse: collapse;
}

.growth-table th {
  padding: 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
}

.growth-table td {
  padding: 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.growth-table tbody tr:hover {
  background: rgba(142, 184, 217, 0.05);
}

.empty-table {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-table p {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-desc {
    font-size: 15px;
  }
  
  .chart-container,
  .data-table {
    padding: 20px;
    overflow-x: auto;
  }
  
  .chart-content {
    height: 300px;
  }
  
  .growth-table th,
  .growth-table td {
    padding: 10px 8px;
    font-size: 13px;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .chart-content {
    height: 250px;
  }
  
  .growth-table {
    font-size: 12px;
  }
  
  .growth-table th,
  .growth-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
}
</style>