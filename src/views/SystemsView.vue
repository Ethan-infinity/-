<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sigma } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// System:
// a1*x + b1*y = c1
// a2*x + b2*y = c2

const a1 = ref(1)
const b1 = ref(1)
const c1 = ref(4)

const a2 = ref(1)
const b2 = ref(-1)
const c2 = ref(2)

// Grid config
const gridSize = 40
const width = 600
const height = 400
const centerX = width / 2
const centerY = height / 2

// Calculate intersection (Cramer's rule or substitution)
const solution = computed(() => {
  const det = a1.value * b2.value - a2.value * b1.value
  if (Math.abs(det) < 0.001) return null // Parallel or coincident
  
  const x = (c1.value * b2.value - c2.value * b1.value) / det
  const y = (a1.value * c2.value - a2.value * c1.value) / det
  return { x, y }
})

// Helper to get line coordinates for SVG
const getLineCoords = (a: number, b: number, c: number) => {
  // ax + by = c
  // if b != 0, y = (c - ax) / b
  // if b == 0, x = c / a
  
  const points = []
  const range = 10 // Visible range in grid units
  
  if (Math.abs(b) > 0.01) {
    // Calculate y for x = -range and x = range
    const x1 = -range
    const y1 = (c - a * x1) / b
    const x2 = range
    const y2 = (c - a * x2) / b
    points.push({ x: x1, y: y1 }, { x: x2, y: y2 })
  } else {
    // Vertical line x = c/a
    const x = c / a
    points.push({ x: x, y: -range }, { x: x, y: range })
  }
  
  return {
    x1: centerX + points[0].x * gridSize,
    y1: centerY - points[0].y * gridSize,
    x2: centerX + points[1].x * gridSize,
    y2: centerY - points[1].y * gridSize
  }
}

const line1 = computed(() => getLineCoords(a1.value, b1.value, c1.value))
const line2 = computed(() => getLineCoords(a2.value, b2.value, c2.value))

const solutionSvg = computed(() => {
  if (!solution.value) return null
  return {
    x: centerX + solution.value.x * gridSize,
    y: centerY - solution.value.y * gridSize
  }
})

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sigma class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          线性方程组可视化
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          二元一次方程组的解对应于两条直线的交点。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Controls -->
      <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Equation 1 -->
        <div class="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 class="font-semibold text-blue-700 dark:text-blue-300">方程 1 (蓝色)</h3>
          <div class="flex items-center gap-2 flex-wrap">
            <input type="number" v-model="a1" class="w-14 px-2 py-1 rounded border border-blue-200 text-center" />
            <span>x +</span>
            <input type="number" v-model="b1" class="w-14 px-2 py-1 rounded border border-blue-200 text-center" />
            <span>y =</span>
            <input type="number" v-model="c1" class="w-14 px-2 py-1 rounded border border-blue-200 text-center" />
          </div>
          <div class="text-sm text-blue-600 dark:text-blue-400 font-mono">
            {{ a1 }}x + {{ b1 }}y = {{ c1 }}
          </div>
        </div>

        <!-- Equation 2 -->
        <div class="space-y-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
          <h3 class="font-semibold text-red-700 dark:text-red-300">方程 2 (红色)</h3>
          <div class="flex items-center gap-2 flex-wrap">
            <input type="number" v-model="a2" class="w-14 px-2 py-1 rounded border border-red-200 text-center" />
            <span>x +</span>
            <input type="number" v-model="b2" class="w-14 px-2 py-1 rounded border border-red-200 text-center" />
            <span>y =</span>
            <input type="number" v-model="c2" class="w-14 px-2 py-1 rounded border border-red-200 text-center" />
          </div>
          <div class="text-sm text-red-600 dark:text-red-400 font-mono">
            {{ a2 }}x + {{ b2 }}y = {{ c2 }}
          </div>
        </div>

        <!-- Solution Info -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center space-y-3">
          <div v-if="solution">
            <div class="text-sm text-gray-500 mb-1">唯一解 (两条线相交于一点)</div>
            <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              x = {{ solution.x.toFixed(2) }}, y = {{ solution.y.toFixed(2) }}
            </div>
            <div class="text-xs text-gray-400 mt-2">
              对应考研概念：系数行列式 D ≠ 0，克拉默法则适用。
            </div>
          </div>
          <div v-else class="space-y-2">
            <div class="text-orange-500 font-bold text-lg">
              无解 或 无穷多解
            </div>
            <p class="text-xs text-gray-500">
              两条线<strong>平行</strong>（无解）或<strong>重合</strong>（无穷多解）。
            </p>
            <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-xs text-orange-800 dark:text-orange-200 text-left">
              <span class="font-bold">考研重点：</span>
              <br>
              这就是非齐次线性方程组解的判定：
              <br>
              1. 秩(A) ≠ 秩(A,b) → 无解
              <br>
              2. 秩(A) = 秩(A,b) < n → 无穷多解
            </div>
          </div>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none">
          <defs>
            <pattern id="grid-sys" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-sys)" />
          
          <!-- Axes -->
          <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-gray-300" stroke-width="2" />
          <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-gray-300" stroke-width="2" />

          <!-- Lines -->
          <line :x1="line1.x1" :y1="line1.y1" :x2="line1.x2" :y2="line1.y2" 
            stroke="#3b82f6" stroke-width="3" />
          
          <line :x1="line2.x1" :y1="line2.y1" :x2="line2.x2" :y2="line2.y2" 
            stroke="#ef4444" stroke-width="3" />

          <!-- Intersection Point -->
          <circle v-if="solutionSvg" :cx="solutionSvg.x" :cy="solutionSvg.y" r="6" fill="#4f46e5" stroke="white" stroke-width="2" />

        </svg>
      </div>
    </div>
  </div>
</template>
