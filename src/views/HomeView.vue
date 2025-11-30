<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white shadow-2xl">
      <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-3xl">
        <h1 class="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          探索线性代数的<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">几何之美</span>
        </h1>
        <p class="text-xl text-indigo-100 mb-8 leading-relaxed">
          告别枯燥的公式推导。通过交互式可视化，直观理解向量、矩阵、特征值等核心概念。让抽象的数学变得触手可及。
        </p>
        <div class="flex gap-4">
          <RouterLink to="/vectors" class="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
            从向量开始
          </RouterLink>
          <!-- Removed View Source button -->
        </div>
      </div>
    </div>

    <!-- Modules Grid -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
        <span class="w-1 h-8 bg-indigo-500 rounded-full"></span>
        学习模块
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(card, index) in cards" :key="index" 
          class="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-2"
        >
          <!-- Hover Gradient Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <component :is="card.icon" class="w-7 h-7" />
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {{ card.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm">
              {{ card.description }}
            </p>
            
            <RouterLink :to="card.path" class="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              开始学习 <ArrowRight class="w-4 h-4 ml-1" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { 
  Move, 
  Grid3X3, 
  BoxSelect, 
  Sigma, 
  Activity, 
  Shapes, 
  Network 
} from 'lucide-vue-next'

const cards = [
  { title: '向量', description: '探索向量的加减法、数乘及其几何意义', path: '/vectors', icon: Move },
  { title: '矩阵', description: '理解矩阵变换、乘法及其对空间的影响', path: '/matrices', icon: Grid3X3 },
  { title: '行列式', description: '可视化行列式作为面积或体积的缩放因子', path: '/determinants', icon: BoxSelect },
  { title: '线性方程组', description: '观察直线与平面的交点，理解解的结构', path: '/systems', icon: Sigma },
  { title: '特征值与特征向量', description: '发现变换中的不变量与主方向', path: '/eigen', icon: Activity },
  { title: '二次型', description: '通过图形理解二次型的正定性与标准形', path: '/quadratic', icon: Shapes },
  { title: '知识图谱', description: '查看各知识点之间的内在联系', path: '/relations', icon: Network },
]
</script>
