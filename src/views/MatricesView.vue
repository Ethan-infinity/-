<script setup lang="ts">
import { ref, computed } from 'vue'
import { Grid3X3 } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// State
const order = ref<2 | 3>(2)

// 2x2 Matrix
const m2 = ref({
  a: 1, b: 0,
  c: 0, d: 1
})

// 3x3 Matrix
const m3 = ref({
  a11: 1, a12: 0, a13: 0,
  a21: 0, a22: 1, a23: 0,
  a31: 0, a32: 0, a33: 1
})

// Presets
const applyPreset = (type: string) => {
  if (order.value === 2) {
    switch (type) {
      case 'identity': m2.value = { a: 1, b: 0, c: 0, d: 1 }; break;
      case 'scale': m2.value = { a: 2, b: 0, c: 0, d: 2 }; break;
      case 'rotate90': m2.value = { a: 0, b: -1, c: 1, d: 0 }; break;
      case 'shearX': m2.value = { a: 1, b: 1, c: 0, d: 1 }; break;
      case 'singular': m2.value = { a: 1, b: 2, c: 2, d: 4 }; break; // Rank 1
    }
  } else {
    // 3x3 Presets
    switch (type) {
      case 'identity': 
        m3.value = { a11: 1, a12: 0, a13: 0, a21: 0, a22: 1, a23: 0, a31: 0, a32: 0, a33: 1 }; break;
      case 'scale': 
        m3.value = { a11: 2, a12: 0, a13: 0, a21: 0, a22: 2, a23: 0, a31: 0, a32: 0, a33: 2 }; break;
      case 'singular': // Rank 2 (Plane)
        m3.value = { a11: 1, a12: 0, a13: 0, a21: 0, a22: 1, a23: 0, a31: 0, a32: 0, a33: 0 }; break;
      case 'rank1': // Rank 1 (Line)
        m3.value = { a11: 1, a12: 1, a13: 1, a21: 1, a22: 1, a23: 1, a31: 1, a32: 1, a33: 1 }; break;
    }
  }
}

// Grid configuration
const gridSize = 40
const width = 600
const height = 400
const centerX = width / 2
const centerY = height / 2

// 2D Transform
const transform2D = (x: number, y: number) => {
  const nx = m2.value.a * x + m2.value.b * y
  const ny = m2.value.c * x + m2.value.d * y
  return {
    x: centerX + nx * gridSize,
    y: centerY - ny * gridSize
  }
}

// 3D Projection
const project3D = (x: number, y: number, z: number) => {
  const isoX = (x - y) * Math.cos(Math.PI / 6)
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z
  return {
    x: centerX + isoX * gridSize * 0.8,
    y: centerY + isoY * gridSize * 0.8
  }
}

// 3D Transform
const transform3D = (x: number, y: number, z: number) => {
  const { a11, a12, a13, a21, a22, a23, a31, a32, a33 } = m3.value
  const nx = a11 * x + a12 * y + a13 * z
  const ny = a21 * x + a22 * y + a23 * z
  const nz = a31 * x + a32 * y + a33 * z
  return project3D(nx, ny, nz)
}

// 2D Grid Points
const gridPoints2D = computed(() => {
  const points = []
  const range = 5
  for (let i = -range; i <= range; i++) {
    points.push({ x1: i, y1: -range, x2: i, y2: range, type: i === 0 ? 'axis' : 'grid' })
    points.push({ x1: -range, y1: i, x2: range, y2: i, type: i === 0 ? 'axis' : 'grid' })
  }
  return points
})

// 3D Grid Lines (Simplified: just axes and a box)
const origin3D = computed(() => transform3D(0, 0, 0))
const iHat3 = computed(() => transform3D(1, 0, 0))
const jHat3 = computed(() => transform3D(0, 1, 0))
const kHat3 = computed(() => transform3D(0, 0, 1))

// 2D Basis
const iHat2 = computed(() => transform2D(1, 0))
const jHat2 = computed(() => transform2D(0, 1))
const origin2D = computed(() => transform2D(0, 0))

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Grid3X3 class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          矩阵变换可视化
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          矩阵不仅是数字的表格，它描述了空间的线性变换。
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
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">变换矩阵 A</h3>
          
          <!-- 2x2 -->
          <div v-if="order === 2" class="mb-6">
            <div class="flex justify-center gap-8 text-xs text-gray-500 mb-1 font-mono">
              <span class="text-green-600 font-bold">î 变换后</span>
              <span class="text-red-600 font-bold">ĵ 变换后</span>
            </div>
            <div class="flex items-center gap-2 justify-center mb-4">
              <span class="text-4xl font-light text-gray-400">[</span>
              <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                <div class="relative group">
                  <input type="number" v-model="m2.a" class="w-16 text-center px-2 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded focus:ring-2 focus:ring-green-500 outline-none" step="0.5" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    î 的新 x 坐标
                  </div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m2.b" class="w-16 text-center px-2 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded focus:ring-2 focus:ring-red-500 outline-none" step="0.5" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    ĵ 的新 x 坐标
                  </div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m2.c" class="w-16 text-center px-2 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded focus:ring-2 focus:ring-green-500 outline-none" step="0.5" />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    î 的新 y 坐标
                  </div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m2.d" class="w-16 text-center px-2 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded focus:ring-2 focus:ring-red-500 outline-none" step="0.5" />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    ĵ 的新 y 坐标
                  </div>
                </div>
              </div>
              <span class="text-4xl font-light text-gray-400">]</span>
            </div>
            
            <!-- Element Legend -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-green-50 dark:bg-green-900/10 p-2 rounded border border-green-100 dark:border-green-800/30">
                <div class="font-bold text-green-700 dark:text-green-400 mb-1">第一列 (î)</div>
                <div class="space-y-1 text-gray-600 dark:text-gray-400">
                  <div class="flex justify-between"><span>a:</span> <span>î 的水平拉伸</span></div>
                  <div class="flex justify-between"><span>c:</span> <span>î 的垂直倾斜</span></div>
                </div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-800/30">
                <div class="font-bold text-red-700 dark:text-red-400 mb-1">第二列 (ĵ)</div>
                <div class="space-y-1 text-gray-600 dark:text-gray-400">
                  <div class="flex justify-between"><span>b:</span> <span>ĵ 的水平倾斜</span></div>
                  <div class="flex justify-between"><span>d:</span> <span>ĵ 的垂直拉伸</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3x3 -->
          <div v-else class="mb-6">
            <div class="flex justify-center gap-6 text-xs text-gray-500 mb-1 font-mono pl-4">
              <span class="text-green-600 font-bold">î 变换后</span>
              <span class="text-red-600 font-bold">ĵ 变换后</span>
              <span class="text-blue-600 font-bold">k̂ 变换后</span>
            </div>
            <div class="flex items-center gap-2 justify-center mb-4">
              <span class="text-6xl font-light text-gray-400">[</span>
              <div class="grid grid-cols-3 gap-x-2 gap-y-2">
                <!-- Row 1: X coordinates -->
                <div class="relative group">
                  <input type="number" v-model="m3.a11" class="w-14 text-center px-1 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded focus:ring-2 focus:ring-green-500 outline-none" step="1" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">î 的 x 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a12" class="w-14 text-center px-1 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded focus:ring-2 focus:ring-red-500 outline-none" step="1" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">ĵ 的 x 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a13" class="w-14 text-center px-1 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded focus:ring-2 focus:ring-blue-500 outline-none" step="1" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">k̂ 的 x 坐标</div>
                </div>
                
                <!-- Row 2: Y coordinates -->
                <div class="relative group">
                  <input type="number" v-model="m3.a21" class="w-14 text-center px-1 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded focus:ring-2 focus:ring-green-500 outline-none" step="1" />
                  <div class="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">î 的 y 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a22" class="w-14 text-center px-1 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded focus:ring-2 focus:ring-red-500 outline-none" step="1" />
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">ĵ 的 y 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a23" class="w-14 text-center px-1 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded focus:ring-2 focus:ring-blue-500 outline-none" step="1" />
                  <div class="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">k̂ 的 y 坐标</div>
                </div>
                
                <!-- Row 3: Z coordinates -->
                <div class="relative group">
                  <input type="number" v-model="m3.a31" class="w-14 text-center px-1 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded focus:ring-2 focus:ring-green-500 outline-none" step="1" />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">î 的 z 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a32" class="w-14 text-center px-1 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded focus:ring-2 focus:ring-red-500 outline-none" step="1" />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">ĵ 的 z 坐标</div>
                </div>
                <div class="relative group">
                  <input type="number" v-model="m3.a33" class="w-14 text-center px-1 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded focus:ring-2 focus:ring-blue-500 outline-none" step="1" />
                  <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-24 bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">k̂ 的 z 坐标</div>
                </div>
              </div>
              <span class="text-6xl font-light text-gray-400">]</span>
            </div>

            <!-- Row Legend -->
            <div class="flex flex-col gap-1 text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-500 w-12">第一行:</span>
                <span class="text-gray-600 dark:text-gray-400">基向量的 <span class="font-bold text-indigo-500">x</span> 坐标</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-500 w-12">第二行:</span>
                <span class="text-gray-600 dark:text-gray-400">基向量的 <span class="font-bold text-indigo-500">y</span> 坐标</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-500 w-12">第三行:</span>
                <span class="text-gray-600 dark:text-gray-400">基向量的 <span class="font-bold text-indigo-500">z</span> 坐标</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">常用变换</h3>
          <div class="grid grid-cols-2 gap-2">
            <button @click="applyPreset('identity')" class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left">
              单位矩阵 (Identity)
            </button>
            <button @click="applyPreset('scale')" class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left">
              放大 2x (Scale)
            </button>
            <button v-if="order === 2" @click="applyPreset('rotate90')" class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left">
              旋转 90° (Rotate)
            </button>
            <button @click="applyPreset('singular')" class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left">
              {{ order === 2 ? '压扁成线 (Rank 1)' : '压扁成面 (Rank 2)' }}
            </button>
            <button v-if="order === 3" @click="applyPreset('rank1')" class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left">
              压扁成线 (Rank 1)
            </button>
          </div>
        </div>

        <!-- Basis Vectors Info -->
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400">
              <MathEquation :formula="order === 2 ? '\\hat{i}' : '\\hat{i}'" /> 变换后
            </span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400">
              <MathEquation :formula="order === 2 ? '\\hat{j}' : '\\hat{j}'" /> 变换后
            </span>
          </div>
          <div v-if="order === 3" class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400">
              <MathEquation formula="\hat{k}" /> 变换后
            </span>
          </div>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none transition-all duration-300">
          <defs>
            <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
            </marker>
            <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
          </defs>

          <!-- 2D Visualization -->
          <g v-if="order === 2" class="transition-all duration-500 ease-out">
            <line v-for="(line, idx) in gridPoints2D" :key="idx"
              :x1="transform2D(line.x1, line.y1).x" 
              :y1="transform2D(line.x1, line.y1).y" 
              :x2="transform2D(line.x2, line.y2).x" 
              :y2="transform2D(line.x2, line.y2).y"
              :stroke="line.type === 'axis' ? '#9ca3af' : '#e5e7eb'"
              :stroke-width="line.type === 'axis' ? 2 : 1"
            />
            
            <!-- Basis Vectors -->
            <line :x1="origin2D.x" :y1="origin2D.y" :x2="iHat2.x" :y2="iHat2.y" 
              stroke="#22c55e" stroke-width="4" marker-end="url(#arrow-green)" />
            <line :x1="origin2D.x" :y1="origin2D.y" :x2="jHat2.x" :y2="jHat2.y" 
              stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-red)" />
          </g>

          <!-- 3D Visualization -->
          <g v-else>
            <!-- Axes (Projected) -->
            <line :x1="origin3D.x" :y1="origin3D.y" :x2="iHat3.x" :y2="iHat3.y" stroke="#22c55e" stroke-width="3" marker-end="url(#arrow-green)" />
            <line :x1="origin3D.x" :y1="origin3D.y" :x2="jHat3.x" :y2="jHat3.y" stroke="#ef4444" stroke-width="3" marker-end="url(#arrow-red)" />
            <line :x1="origin3D.x" :y1="origin3D.y" :x2="kHat3.x" :y2="kHat3.y" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow-blue)" />
            
            <!-- Helper Box (Wireframe) -->
            <!-- Just showing basis vectors is often enough for 3D to avoid clutter -->
          </g>
            
        </svg>
      </div>
    </div>
    
    <!-- Explanation -->
    <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
      <h3 class="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
        <span class="text-xl">🤖</span> 小白理解：矩阵是“空间变形机”
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
            不要把矩阵看成一堆数字，把它看成一个<strong>函数</strong>或<strong>动作</strong>。
            <br>
            当你把一个向量乘上矩阵，就是把这个向量“扔进”变形机里，出来的就是变形后的新向量。
          </p>
          <p class="text-sm text-indigo-800 dark:text-indigo-200">
            <strong>核心秘诀：</strong> 盯着基向量（坐标轴单位向量）看！
            <br>
            矩阵的第一列就是原来的 <MathEquation formula="\hat{i}" /> 变到了哪里。
            <br>
            矩阵的第二列就是原来的 <MathEquation formula="\hat{j}" /> 变到了哪里。
            <span v-if="order === 3"><br>矩阵的第三列就是原来的 <MathEquation formula="\hat{k}" /> 变到了哪里。</span>
          </p>
        </div>
        <div class="bg-white/50 dark:bg-black/20 p-4 rounded-lg text-xs text-indigo-900 dark:text-indigo-100">
          <span class="font-bold text-red-500 text-sm block mb-1">考研重点：矩阵秩 (Rank)</span>
          <p class="mb-2">
            秩的几何意义就是“变换后空间的维度”。
          </p>
          <ul class="list-disc pl-4 space-y-1">
            <li><strong>满秩 (Rank {{ order }}):</strong> 空间没有被压扁，{{ order }}维还是{{ order }}维。</li>
            <li><strong>秩 {{ order - 1 }}:</strong> 空间被压扁了一个维度（面变线，体变面）。</li>
            <li><strong>秩 0:</strong> 缩成一个点（原点）。</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
