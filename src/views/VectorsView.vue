<script setup lang="ts">
import { ref, computed } from 'vue'
import { Move, Plus, Minus, X } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// State
const v1 = ref({ x: 3, y: 1 })
const v2 = ref({ x: 1, y: 2 })
const s1 = ref(1)
const s2 = ref(1)
const showSum = ref(true)
const showDifference = ref(false)

// Computed
const v1Scaled = computed(() => ({ x: v1.value.x * s1.value, y: v1.value.y * s1.value }))
const v2Scaled = computed(() => ({ x: v2.value.x * s2.value, y: v2.value.y * s2.value }))
const vSum = computed(() => ({ x: v1Scaled.value.x + v2Scaled.value.x, y: v1Scaled.value.y + v2Scaled.value.y }))
const vDiff = computed(() => ({ x: v1Scaled.value.x - v2Scaled.value.x, y: v1Scaled.value.y - v2Scaled.value.y }))

// Grid configuration
const gridSize = 40
const range = 10
const width = 600
const height = 400
const centerX = width / 2
const centerY = height / 2

// Helper to convert math coordinates to SVG coordinates
const toSvg = (point: { x: number, y: number }) => ({
  x: centerX + point.x * gridSize,
  y: centerY - point.y * gridSize
})

const v1Svg = computed(() => toSvg(v1Scaled.value))
const v2Svg = computed(() => toSvg(v2Scaled.value))
const vSumSvg = computed(() => toSvg(vSum.value))
const vDiffSvg = computed(() => toSvg(vDiff.value))
const originSvg = { x: centerX, y: centerY }

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Move class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          向量运算可视化
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          调整向量的分量和标量系数，观察向量加法、减法和数乘的几何意义。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Controls -->
      <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Vector 1 -->
        <div class="space-y-4">
          <h3 class="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            向量 <span class="font-mono">v₁</span> (蓝色)
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">X 分量</label>
              <input type="number" v-model="v1.x" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Y 分量</label>
              <input type="number" v-model="v1.y" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">标量系数 (数乘)</label>
            <input type="range" v-model.number="s1" min="-3" max="3" step="0.1" class="w-full accent-indigo-600" />
            <div class="text-right text-xs font-mono text-gray-500">{{ s1 }}</div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-700" />

        <!-- Vector 2 -->
        <div class="space-y-4">
          <h3 class="font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-2">
            向量 <span class="font-mono">v₂</span> (粉色)
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">X 分量</label>
              <input type="number" v-model="v2.x" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Y 分量</label>
              <input type="number" v-model="v2.y" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">标量系数 (数乘)</label>
            <input type="range" v-model.number="s2" min="-3" max="3" step="0.1" class="w-full accent-pink-600" />
            <div class="text-right text-xs font-mono text-gray-500">{{ s2 }}</div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-700" />

        <!-- Operations -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="showSum" class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
            <span class="text-sm text-gray-700 dark:text-gray-300">显示和 <span class="font-mono">v₁ + v₂</span> (紫色)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="showDifference" class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
            <span class="text-sm text-gray-700 dark:text-gray-300">显示差 <span class="font-mono">v₁ - v₂</span> (橙色)</span>
          </label>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none">
          <defs>
            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#4f46e5" />
            </marker>
            <marker id="arrow-pink" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#db2777" />
            </marker>
            <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#9333ea" />
            </marker>
            <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ea580c" />
            </marker>
          </defs>

          <!-- Grid -->
          <g class="stroke-gray-200 dark:stroke-gray-700" stroke-width="1">
            <line v-for="i in 21" :key="'v'+i" 
              :x1="(i-1) * gridSize" :y1="0" 
              :x2="(i-1) * gridSize" :y2="height" 
            />
            <line v-for="i in 15" :key="'h'+i" 
              :x1="0" :y1="(i-1) * gridSize" 
              :x2="width" :y2="(i-1) * gridSize" 
            />
          </g>

          <!-- Axes -->
          <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-gray-400 dark:stroke-gray-500" stroke-width="2" />
          <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-gray-400 dark:stroke-gray-500" stroke-width="2" />

          <!-- Parallelogram Lines for Sum -->
          <g v-if="showSum" class="stroke-gray-400 dark:stroke-gray-500" stroke-dasharray="4 4">
            <line :x1="v1Svg.x" :y1="v1Svg.y" :x2="vSumSvg.x" :y2="vSumSvg.y" />
            <line :x1="v2Svg.x" :y1="v2Svg.y" :x2="vSumSvg.x" :y2="vSumSvg.y" />
          </g>

          <!-- Vectors -->
          <!-- v1 -->
          <line :x1="originSvg.x" :y1="originSvg.y" :x2="v1Svg.x" :y2="v1Svg.y" 
            stroke="#4f46e5" stroke-width="3" marker-end="url(#arrow-blue)" />
          
          <!-- v2 -->
          <line :x1="originSvg.x" :y1="originSvg.y" :x2="v2Svg.x" :y2="v2Svg.y" 
            stroke="#db2777" stroke-width="3" marker-end="url(#arrow-pink)" />

          <!-- Sum -->
          <line v-if="showSum" :x1="originSvg.x" :y1="originSvg.y" :x2="vSumSvg.x" :y2="vSumSvg.y" 
            stroke="#9333ea" stroke-width="3" marker-end="url(#arrow-purple)" />

          <!-- Difference -->
          <line v-if="showDifference" :x1="v2Svg.x" :y1="v2Svg.y" :x2="v1Svg.x" :y2="v1Svg.y" 
            stroke="#ea580c" stroke-width="3" marker-end="url(#arrow-orange)" />
            
        </svg>
        
        <!-- Coordinates Display -->
        <div class="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow text-xs font-mono space-y-1 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div class="text-indigo-600">v₁ = ({{ v1Scaled.x.toFixed(1) }}, {{ v1Scaled.y.toFixed(1) }})</div>
          <div class="text-pink-600">v₂ = ({{ v2Scaled.x.toFixed(1) }}, {{ v2Scaled.y.toFixed(1) }})</div>
          <div v-if="showSum" class="text-purple-600">v₁ + v₂ = ({{ vSum.x.toFixed(1) }}, {{ vSum.y.toFixed(1) }})</div>
          <div v-if="showDifference" class="text-orange-600">v₁ - v₂ = ({{ vDiff.x.toFixed(1) }}, {{ vDiff.y.toFixed(1) }})</div>
        </div>
      </div>
    </div>
    
    <!-- Explanation -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
        <h3 class="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
          <span class="text-xl">💡</span> 小白理解：向量加法
        </h3>
        <p class="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
          想象你在走路：
          <br>
          <span class="font-mono">v₁</span> 是“先往东走3步，再往北走1步”。
          <br>
          <span class="font-mono">v₂</span> 是“接着往东走1步，再往北走2步”。
          <br>
          <span class="font-bold">加法结果</span>就是你最终离起点的位移。
        </p>
        <div class="bg-white/50 dark:bg-black/20 p-3 rounded-lg text-xs text-indigo-900 dark:text-indigo-100">
          <span class="font-bold text-red-500">考研重点：</span> 向量线性运算（加减数乘）是所有线性代数的基础。记住“平行四边形法则”：两个向量从同一点出发，它们的和就是以它们为邻边的平行四边形的对角线。
        </div>
      </div>
      
      <div class="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border border-pink-100 dark:border-pink-800">
        <h3 class="font-bold text-pink-900 dark:text-pink-300 mb-2 flex items-center gap-2">
          <span class="text-xl">🔍</span> 小白理解：数乘向量
        </h3>
        <p class="text-sm text-pink-800 dark:text-pink-200 mb-3">
          数乘就是“缩放”：
          <br>
          <span class="font-mono">2v₁</span> 就是把 <span class="font-mono">v₁</span> 的长度拉长一倍，方向不变。
          <br>
          <span class="font-mono">-1v₁</span> 就是把 <span class="font-mono">v₁</span> 掉个头，方向相反。
        </p>
        <div class="bg-white/50 dark:bg-black/20 p-3 rounded-lg text-xs text-pink-900 dark:text-pink-100">
          <span class="font-bold text-red-500">考研重点：</span> 线性相关性。如果一个向量能被另一个向量“数乘”得到（即共线），它们就是线性相关的。
        </div>
      </div>
    </div>
  </div>
</template>
