import Vue from'vue'
import App from'./App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip=false
axios.defaults.baseURL=process.env.VUE_APP_BASE_API || 'http://127.0.0.1:3000'
axios.defaults.timeout = 60000
Vue.prototype.axios=axios
Vue.use(ElementUI)
new Vue({
router,
render:h => h(App)
}).$mount('#app')