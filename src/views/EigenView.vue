<script setup lang="ts">
import { ref, computed } from 'vue'
import { Activity } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// State
const order = ref<2 | 3>(2)

// 2x2 Matrix (Symmetric)
const m2 = ref({ a: 2, b: 0, d: 1 })

// 3x3 Matrix (Diagonal for simplicity in 3D visualization)
const m3 = ref({ l1: 2, l2: 1, l3: 0.5 })

// Test vector v (controlled by angle)
const angle = ref(45) // degrees
const vLen = 2

// Grid config
const gridSize = 40
const width = 600
const height = 400
const centerX = width / 2
const centerY = height / 2

// Calculate vectors
const v2 = computed(() => {
  const rad = angle.value * Math.PI / 180
  return {
    x: Math.cos(rad) * vLen,
    y: Math.sin(rad) * vLen
  }
})

// Av = [a b; b d] * [x; y]
const Av2 = computed(() => {
  const x = v2.value.x
  const y = v2.value.y
  return {
    x: m2.value.a * x + m2.value.b * y,
    y: m2.value.b * x + m2.value.d * y
  }
})

// Check if parallel (cross product is near 0)
const isEigen2 = computed(() => {
  const cross = v2.value.x * Av2.value.y - v2.value.y * Av2.value.x
  return Math.abs(cross) < 0.1
})

// Calculate eigenvalues for display (for symmetric matrix)
const eigenvalues2 = computed(() => {
  const tr = m2.value.a + m2.value.d
  const det = m2.value.a * m2.value.d - m2.value.b * m2.value.b
  const delta = Math.sqrt(tr * tr - 4 * det)
  return {
    l1: (tr + delta) / 2,
    l2: (tr - delta) / 2
  }
})

// SVG Coordinates
const toSvg = (p: {x: number, y: number}) => ({
  x: centerX + p.x * gridSize,
  y: centerY - p.y * gridSize
})

const vSvg = computed(() => toSvg(v2.value))
const AvSvg = computed(() => toSvg(Av2.value))
const originSvg = { x: centerX, y: centerY }

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Activity class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          特征值与特征向量
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          特征向量是在变换下方向保持不变（或反向）的向量。<MathEquation formula="A\vec{v} = \lambda\vec{v}" />
        </p>
      </div>
      <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button 
          @click="order = 2"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          :class="order === 2 ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          2阶 (平面)
        </button>
        <button 
          @click="order = 3"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          :class="order === 3 ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          3阶 (空间)
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Controls -->
      <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Matrix Input -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ order === 2 ? '对称矩阵 A' : '对角矩阵 A (简化)' }}
          </h3>
          
          <div v-if="order === 2" class="flex items-center gap-2 mb-6">
            <span class="text-4xl font-light text-gray-400">[</span>
            <div class="grid grid-cols-2 gap-2">
              <input type="number" v-model="m2.a" class="w-16 text-center px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 outline-none" step="0.5" />
              <input type="number" v-model="m2.b" class="w-16 text-center px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 outline-none" step="0.5" />
              <input type="number" v-model="m2.b" class="w-16 text-center px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 outline-none" disabled />
              <input type="number" v-model="m2.d" class="w-16 text-center px-2 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 outline-none" step="0.5" />
            </div>
            <span class="text-4xl font-light text-gray-400">]</span>
          </div>

          <div v-else class="space-y-4">
            <p class="text-sm text-gray-500">3阶可视化仅展示对角矩阵，其特征向量就是坐标轴。</p>
            <div class="flex items-center gap-2">
              <label class="w-8 text-sm">λ₁</label>
              <input type="range" v-model.number="m3.l1" min="-2" max="3" step="0.1" class="flex-1 accent-indigo-600" />
              <span class="text-xs w-8 text-right">{{ m3.l1 }}</span>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-8 text-sm">λ₂</label>
              <input type="range" v-model.number="m3.l2" min="-2" max="3" step="0.1" class="flex-1 accent-indigo-600" />
              <span class="text-xs w-8 text-right">{{ m3.l2 }}</span>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-8 text-sm">λ₃</label>
              <input type="range" v-model.number="m3.l3" min="-2" max="3" step="0.1" class="flex-1 accent-indigo-600" />
              <span class="text-xs w-8 text-right">{{ m3.l3 }}</span>
            </div>
          </div>
        </div>

        <!-- Vector Control (Only for 2D) -->
        <div v-if="order === 2">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">旋转向量 <MathEquation formula="\vec{v}" /></h3>
          <input type="range" v-model.number="angle" min="0" max="360" class="w-full accent-indigo-600" />
          <div class="text-right text-xs text-gray-500">{{ angle }}°</div>
        </div>

        <!-- Status -->
        <div v-if="order === 2" class="p-4 rounded-lg text-center transition-colors duration-300 border"
          :class="isEigen2 ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500'">
          <div class="font-bold text-lg">
            {{ isEigen2 ? '🎉 找到特征向量了!' : '继续旋转寻找...' }}
          </div>
          <div v-if="isEigen2" class="text-sm mt-2">
            <p>特征值 <MathEquation :formula="`\\lambda \\approx ${(Math.sqrt(Av2.x*Av2.x + Av2.y*Av2.y) / vLen * (Math.sign(Av2.x*v2.x) || 1)).toFixed(2)}`" /></p>
          </div>
        </div>

        <div v-if="order === 2" class="text-sm text-gray-500 mt-4">
          <p>矩阵的特征值:</p>
          <p><MathEquation :formula="`\\lambda_1 = ${eigenvalues2.l1.toFixed(2)}`" /></p>
          <p><MathEquation :formula="`\\lambda_2 = ${eigenvalues2.l2.toFixed(2)}`" /></p>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 mt-4">
          <h4 class="font-bold text-purple-900 dark:text-purple-300 text-sm mb-2">小白理解：特征值</h4>
          <p class="text-xs text-purple-800 dark:text-purple-200 mb-2">
            大多数向量在矩阵变换下都会改变方向（旋转）。
            <br>
            但总有几个“顽固”的向量，它们<strong>方向不变</strong>，只是变长或变短了。
            <br>
            这些“顽固”的向量就是<strong>特征向量</strong>。
            <br>
            变长变短的倍数，就是<strong>特征值</strong>。
          </p>
          <div class="text-xs text-purple-800 dark:text-purple-200 font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
            考研必背：<MathEquation formula="A\alpha = \lambda\alpha" />
          </div>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none">
          <defs>
            <marker id="arrow-blue-e" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-red-e" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
          </defs>
          
          <g v-if="order === 2">
            <!-- Grid -->
            <g class="stroke-gray-100 dark:stroke-gray-800">
              <line v-for="i in 21" :key="'v'+i" :x1="(i-1)*gridSize" :y1="0" :x2="(i-1)*gridSize" :y2="height" />
              <line v-for="i in 15" :key="'h'+i" :x1="0" :y1="(i-1)*gridSize" :x2="width" :y2="(i-1)*gridSize" />
            </g>

            <!-- Axes -->
            <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-gray-300" stroke-width="2" />
            <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-gray-300" stroke-width="2" />

            <!-- Vectors -->
            <!-- v (Input) -->
            <line :x1="originSvg.x" :y1="originSvg.y" :x2="vSvg.x" :y2="vSvg.y" 
              stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow-blue-e)" />
            
            <!-- Av (Output) -->
            <line :x1="originSvg.x" :y1="originSvg.y" :x2="AvSvg.x" :y2="AvSvg.y" 
              stroke="#ef4444" stroke-width="3" marker-end="url(#arrow-red-e)" 
              class="transition-all duration-75" />
          </g>

          <g v-else>
             <!-- 3D Axes -->
             <line :x1="centerX" :y1="centerY" :x2="centerX + 150" :y2="centerY + 75" stroke="#e5e7eb" stroke-width="1" />
             <line :x1="centerX" :y1="centerY" :x2="centerX - 150" :y2="centerY + 75" stroke="#e5e7eb" stroke-width="1" />
             <line :x1="centerX" :y1="centerY" :x2="centerX" :y2="centerY - 150" stroke="#e5e7eb" stroke-width="1" />

             <!-- Eigenvectors (Axes) scaled by eigenvalues -->
             <!-- X axis (Red) -->
             <line :x1="centerX" :y1="centerY" 
               :x2="centerX + 100 * m3.l1 * Math.cos(Math.PI/6)" 
               :y2="centerY + 100 * m3.l1 * Math.sin(Math.PI/6)" 
               stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-red-e)" />
             
             <!-- Y axis (Green) -->
             <line :x1="centerX" :y1="centerY" 
               :x2="centerX - 100 * m3.l2 * Math.cos(Math.PI/6)" 
               :y2="centerY + 100 * m3.l2 * Math.sin(Math.PI/6)" 
               stroke="#22c55e" stroke-width="4" marker-end="url(#arrow-green)" />

             <!-- Z axis (Blue) -->
             <line :x1="centerX" :y1="centerY" 
               :x2="centerX" 
               :y2="centerY - 100 * m3.l3" 
               stroke="#3b82f6" stroke-width="4" marker-end="url(#arrow-blue-e)" />
          </g>

        </svg>
      </div>
    </div>
  </div>
</template>
