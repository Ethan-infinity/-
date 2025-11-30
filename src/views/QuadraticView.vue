<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shapes } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// Quadratic Form: Ax^2 + 2Bxy + Cy^2 = 1
// Matrix M = [[A, B], [B, C]]

const A = ref(1)
const B = ref(0)
const C = ref(1)
const constant = ref(1)

// Grid config
const gridSize = 40
const width = 600
const height = 400
const centerX = width / 2
const centerY = height / 2

// Generate points for the contour plot
const contourPoints = computed(() => {
  const points = []
  const steps = 360
  // We can't just iterate angle because radius varies.
  // Instead, let's scan a grid or use a parametric approach if possible.
  // For general implicit function f(x,y) = c, marching squares is robust but complex.
  // Let's try polar coordinates: r^2 (A cos^2 t + 2B cos t sin t + C sin^2 t) = 1
  // r = sqrt(1 / (A cos^2 t + 2B cos t sin t + C sin^2 t))
  
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const denom = A.value * cosT * cosT + 2 * B.value * cosT * sinT + C.value * sinT * sinT
    
    if (denom > 0) {
      const r = Math.sqrt(constant.value / denom)
      // Limit r to avoid drawing lines to infinity or way off screen
      if (r < 20) { 
        points.push({
          x: r * cosT,
          y: r * sinT
        })
      } else {
        points.push(null) // Break the line
      }
    } else {
      points.push(null)
    }
  }
  return points
})

// Convert to SVG path
const contourPath = computed(() => {
  let d = ''
  let moving = false
  
  contourPoints.value.forEach(p => {
    if (p) {
      const sx = centerX + p.x * gridSize
      const sy = centerY - p.y * gridSize
      if (!moving) {
        d += `M ${sx} ${sy} `
        moving = true
      } else {
        d += `L ${sx} ${sy} `
      }
    } else {
      moving = false
    }
  })
  
  return d
})

// Determine type
const formType = computed(() => {
  const det = A.value * C.value - B.value * B.value
  if (det > 0) {
    return A.value > 0 ? '正定 (椭圆)' : '负定 (无实图形)'
  } else if (det < 0) {
    return '不定 (双曲线)'
  } else {
    return '半正定/半负定 (平行线/抛物线)'
  }
})

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shapes class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          二次型可视化
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          二次型 $f(x,y) = Ax^2 + 2Bxy + Cy^2 = k$ 的等值线图。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Controls -->
      <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Equation -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center font-mono text-lg text-indigo-600 dark:text-indigo-400">
          {{ A }}x² + {{ 2*B }}xy + {{ C }}y² = {{ constant }}
        </div>

        <!-- Sliders -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">系数 A (x²)</label>
            <input type="range" v-model.number="A" min="-5" max="5" step="0.1" class="w-full accent-indigo-600" />
            <div class="text-right text-xs text-gray-500">{{ A }}</div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">系数 B (xy 的一半)</label>
            <input type="range" v-model.number="B" min="-5" max="5" step="0.1" class="w-full accent-indigo-600" />
            <div class="text-right text-xs text-gray-500">{{ B }}</div>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">系数 C (y²)</label>
            <input type="range" v-model.number="C" min="-5" max="5" step="0.1" class="w-full accent-indigo-600" />
            <div class="text-right text-xs text-gray-500">{{ C }}</div>
          </div>
        </div>

        <!-- Type Info -->
        <div class="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 space-y-3">
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">形状类型</div>
            <div class="font-bold text-indigo-700 dark:text-indigo-300 text-lg">{{ formType }}</div>
          </div>
          
          <div class="text-xs text-indigo-800 dark:text-indigo-200">
            <p class="font-bold mb-1">小白理解：</p>
            <p class="mb-2">
              二次型其实就是高中学的椭圆、双曲线方程的“歪”版本（有 $xy$ 交叉项）。
            </p>
            <p>
              <strong>考研核心任务：</strong> “化标准形”。
              <br>
              意思就是：找一个坐标系旋转一下，把这个歪的图形摆正，消灭掉 $xy$ 项，只剩下 $x^2$ 和 $y^2$ 项。
            </p>
          </div>

          <div class="bg-white/50 dark:bg-black/20 p-2 rounded text-xs">
            <span class="font-bold text-red-500">正定性判定：</span>
            <br>
            如果图形是椭圆（封闭），就是正定（或负定）。
            <br>
            如果图形是双曲线（开口），就是不定。
          </div>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none">
          <!-- Grid -->
          <g class="stroke-gray-100 dark:stroke-gray-800">
            <line v-for="i in 21" :key="'v'+i" :x1="(i-1)*gridSize" :y1="0" :x2="(i-1)*gridSize" :y2="height" />
            <line v-for="i in 15" :key="'h'+i" :x1="0" :y1="(i-1)*gridSize" :x2="width" :y2="(i-1)*gridSize" />
          </g>

          <!-- Axes -->
          <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-gray-300" stroke-width="2" />
          <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-gray-300" stroke-width="2" />

          <!-- Contour -->
          <path :d="contourPath" fill="none" stroke="#4f46e5" stroke-width="3" />

        </svg>
      </div>
    </div>
  </div>
</template>
