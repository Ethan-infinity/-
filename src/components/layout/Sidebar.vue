<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Move, 
  Grid3X3, 
  BoxSelect, 
  Sigma, 
  Activity, 
  Shapes, 
  Network 
} from 'lucide-vue-next'

const route = useRoute()

const menuItems = [
  { name: '首页', path: '/', icon: LayoutDashboard },
  { name: '向量', path: '/vectors', icon: Move },
  { name: '矩阵', path: '/matrices', icon: Grid3X3 },
  { name: '行列式', path: '/determinants', icon: BoxSelect },
  { name: '线性方程组', path: '/systems', icon: Sigma },
  { name: '特征值与特征向量', path: '/eigen', icon: Activity },
  { name: '二次型', path: '/quadratic', icon: Shapes },
  { name: '知识图谱', path: '/relations', icon: Network },
]
</script>

<template>
  <aside class="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shadow-2xl overflow-hidden relative">
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
    </div>

    <div class="p-8 z-10">
      <h1 class="text-2xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        <div class="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
          <Shapes class="w-6 h-6 text-indigo-400" />
        </div>
        <span>线性代数<br><span class="text-sm font-medium text-gray-400 tracking-wider">VISUALIZATION</span></span>
      </h1>
    </div>
    
    <nav class="flex-1 overflow-y-auto py-4 px-4 z-10 custom-scrollbar">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink 
            :to="item.path"
            class="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
            :class="[
              route.path === item.path 
                ? 'bg-indigo-600/20 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            ]"
          >
            <!-- Active Indicator -->
            <div v-if="route.path === item.path" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-r-full shadow-[0_0_10px_#818cf8]"></div>

            <component 
              :is="item.icon" 
              class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              :class="route.path === item.path ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-300'" 
            />
            <span class="font-medium tracking-wide">{{ item.name }}</span>
            
            <!-- Hover Glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </RouterLink>
        </li>
      </ul>
    </nav>
    
    <div class="p-6 border-t border-white/5 z-10 bg-slate-900/50 backdrop-blur-md">
      <div class="flex items-center gap-3 text-xs text-gray-500">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>系统运行正常</span>
      </div>
      <div class="mt-2 text-[10px] text-gray-600 uppercase tracking-widest text-center">
        © 2025 Linear Algebra Viz
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
