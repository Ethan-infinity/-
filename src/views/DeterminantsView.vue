<script setup lang="ts">
import { ref, computed } from 'vue'
import { BoxSelect } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// State
const order = ref<2 | 3>(2)

// 2x2 Matrix
const m2 = ref({
  a: 2, b: 0,
  c: 0, d: 1
})

// 3x3 Matrix
const m3 = ref({
  a11: 2, a12: 0, a13: 0,
  a21: 0, a22: 2, a23: 0,
  a31: 0, a32: 0, a33: 1
})

// Computed Determinants
const det2 = computed(() => m2.value.a * m2.value.d - m2.value.b * m2.value.c)

const det3 = computed(() => {
  const { a11, a12, a13, a21, a22, a23, a31, a32, a33 } = m3.value
  return a11 * (a22 * a33 - a23 * a32) -
         a12 * (a21 * a33 - a23 * a31) +
         a13 * (a21 * a32 - a22 * a31)
})

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

// 2D Points
const p0 = computed(() => transform2D(0, 0))
const p1 = computed(() => transform2D(1, 0))
const p2 = computed(() => transform2D(1, 1))
const p3 = computed(() => transform2D(0, 1))

// Unit square points (for reference)
const u0 = computed(() => ({ x: centerX, y: centerY }))
const u1 = computed(() => ({ x: centerX + gridSize, y: centerY }))
const u2 = computed(() => ({ x: centerX + gridSize, y: centerY - gridSize }))
const u3 = computed(() => ({ x: centerX, y: centerY - gridSize }))

// 3D Projection for 3x3 Visualization (Simple Isometric-like)
const project3D = (x: number, y: number, z: number) => {
  // x goes right-down, y goes right-up, z goes up
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

// 3D Basis Vectors Transformed
const v1 = computed(() => transform3D(1, 0, 0))
const v2 = computed(() => transform3D(0, 1, 0))
const v3 = computed(() => transform3D(0, 0, 1))
const origin3D = computed(() => transform3D(0, 0, 0))

// Parallelepiped vertices
const v12 = computed(() => transform3D(1, 1, 0))
const v13 = computed(() => transform3D(1, 0, 1))
const v23 = computed(() => transform3D(0, 1, 1))
const v123 = computed(() => transform3D(1, 1, 1))

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BoxSelect class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          行列式 (Determinants)
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          行列式的值代表了线性变换对面积（二维）或体积（三维）的缩放比例。
        </p>
      </div>
      <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button 
          @click="order = 2"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          :class="order === 2 ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          2阶 (面积)
        </button>
        <button 
          @click="order = 3"
          class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          :class="order === 3 ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
        >
          3阶 (体积)
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Controls -->
      <div class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        <!-- Matrix Input -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">变换矩阵</h3>
          
          <!-- 2x2 Input -->
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

          <!-- 3x3 Input -->
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

          <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">行列式 (Determinant)</div>
            <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {{ order === 2 ? det2.toFixed(2) : det3.toFixed(2) }}
            </div>
            <div class="text-xs text-gray-400 mt-2 overflow-x-auto whitespace-nowrap">
              <MathEquation v-if="order === 2" :formula="`det = (${m2.a} \\times ${m2.d}) - (${m2.b} \\times ${m2.c})`" />
              <span v-else>按第一行展开计算</span>
            </div>
          </div>
        </div>

        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-4">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800">
            <p class="font-bold text-yellow-800 dark:text-yellow-200 mb-1">小白理解：</p>
            <p>
              行列式就是一个<strong>“缩放倍数”</strong>。
              <br>
              它告诉我们，经过矩阵变换后，原来的{{ order === 2 ? '面积' : '体积' }}扩大或缩小了多少倍。
            </p>
          </div>

          <div>
            <p class="font-semibold mb-1">试试看：</p>
            <ul class="list-disc pl-4 space-y-1">
              <li>
                <span class="text-indigo-600 font-medium">det = 1</span>: {{ order === 2 ? '面积' : '体积' }}不变。
              </li>
              <li>
                <span class="text-red-500 font-medium">det = 0</span>: <strong>考研必考！</strong> {{ order === 2 ? '面积' : '体积' }}变成了0。这意味着空间被压扁了（降维）。这时候矩阵<strong>不可逆</strong>。
              </li>
              <li>
                <span class="text-indigo-600 font-medium">det < 0</span>: 空间发生了翻转（手性改变）。
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Visualization Area -->
      <div class="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative flex items-center justify-center">
        <svg :width="width" :height="height" class="bg-white dark:bg-gray-800 select-none">
          
          <!-- 2D Visualization -->
          <g v-if="order === 2">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- Axes -->
            <line :x1="0" :y1="centerY" :x2="width" :y2="centerY" class="stroke-gray-300" stroke-width="2" />
            <line :x1="centerX" :y1="0" :x2="centerX" :y2="height" class="stroke-gray-300" stroke-width="2" />

            <!-- Original Unit Square (Ghost) -->
            <path 
              :d="`M ${u0.x} ${u0.y} L ${u1.x} ${u1.y} L ${u2.x} ${u2.y} L ${u3.x} ${u3.y} Z`"
              fill="none"
              stroke="#9ca3af"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
            <text :x="u2.x + 5" :y="u2.y - 5" class="text-xs fill-gray-400">面积 = 1</text>

            <!-- Transformed Area -->
            <path 
              :d="`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`"
              class="fill-indigo-500/20 stroke-indigo-600 transition-all duration-300"
              stroke-width="2"
            />

            <!-- Vectors -->
            <line :x1="p0.x" :y1="p0.y" :x2="p1.x" :y2="p1.y" stroke="#22c55e" stroke-width="2" />
            <line :x1="p0.x" :y1="p0.y" :x2="p3.x" :y2="p3.y" stroke="#ef4444" stroke-width="2" />
          </g>

          <!-- 3D Visualization -->
          <g v-else>
             <!-- Axes (Projected) -->
             <line :x1="centerX" :y1="centerY" :x2="centerX + 200" :y2="centerY + 100" stroke="#e5e7eb" stroke-width="1" /> <!-- X -->
             <line :x1="centerX" :y1="centerY" :x2="centerX - 200" :y2="centerY + 100" stroke="#e5e7eb" stroke-width="1" /> <!-- Y -->
             <line :x1="centerX" :y1="centerY" :x2="centerX" :y2="centerY - 200" stroke="#e5e7eb" stroke-width="1" /> <!-- Z -->

             <!-- Transformed Parallelepiped -->
             <!-- Faces -->
             <!-- Bottom: origin, v1, v12, v2 -->
             <path :d="`M ${origin3D.x} ${origin3D.y} L ${v1.x} ${v1.y} L ${v12.x} ${v12.y} L ${v2.x} ${v2.y} Z`" fill="rgba(79, 70, 229, 0.1)" stroke="#4f46e5" stroke-width="1" />
             <!-- Top: v3, v13, v123, v23 -->
             <path :d="`M ${v3.x} ${v3.y} L ${v13.x} ${v13.y} L ${v123.x} ${v123.y} L ${v23.x} ${v23.y} Z`" fill="rgba(79, 70, 229, 0.2)" stroke="#4f46e5" stroke-width="1" />
             <!-- Connecting lines -->
             <line :x1="origin3D.x" :y1="origin3D.y" :x2="v3.x" :y2="v3.y" stroke="#4f46e5" stroke-width="1" />
             <line :x1="v1.x" :y1="v1.y" :x2="v13.x" :y2="v13.y" stroke="#4f46e5" stroke-width="1" />
             <line :x1="v2.x" :y1="v2.y" :x2="v23.x" :y2="v23.y" stroke="#4f46e5" stroke-width="1" />
             <line :x1="v12.x" :y1="v12.y" :x2="v123.x" :y2="v123.y" stroke="#4f46e5" stroke-width="1" />

             <!-- Basis Vectors -->
             <line :x1="origin3D.x" :y1="origin3D.y" :x2="v1.x" :y2="v1.y" stroke="#22c55e" stroke-width="3" />
             <line :x1="origin3D.x" :y1="origin3D.y" :x2="v2.x" :y2="v2.y" stroke="#ef4444" stroke-width="3" />
             <line :x1="origin3D.x" :y1="origin3D.y" :x2="v3.x" :y2="v3.y" stroke="#3b82f6" stroke-width="3" />
          </g>

        </svg>
        
        <div class="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow text-xs font-mono backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div class="text-indigo-600 font-bold">当前{{ order === 2 ? '面积' : '体积' }} = {{ Math.abs(order === 2 ? det2 : det3).toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
