<template>
  <div id="app" class="page-container">
    <NavBar v-if="showNavBar" :about-info="aboutInfo" />
    <main class="main-content">
      <router-view :about-info="aboutInfo" @update-about="handleUpdateAbout" />
    </main>
    <Footer v-if="showFooter" :about-info="aboutInfo" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      aboutInfo: {
        baby_name: '宇安',
        birth_date: '2026-04-27',
        days_born: 0,
        footer_message: '慢慢长大，岁岁平安'
      }
    }
  },
  computed: {
    showNavBar() {
      return !['/login', '/register'].includes(this.$route.path)
    },
    showFooter() {
      return !['/login', '/register', '/admin'].includes(this.$route.path)
    }
  },
  created() {
    this.loadAboutInfo()
  },
  methods: {
    loadAboutInfo() {
      this.axios.get('/api/about').then(res => {
        if (res.data.status === 200) {
          this.aboutInfo = res.data.data
        }
      }).catch(() => {})
    },
    handleUpdateAbout() {
      this.loadAboutInfo()
    }
  }
}
</script>

<style>
@import "assets/css/base.css";
</style>