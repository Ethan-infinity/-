
<script setup lang="ts">
import { ref } from 'vue'
import { Network } from 'lucide-vue-next'
import MathEquation from '@/components/MathEquation.vue'

// Nodes
const nodes = [
  { id: 'matrix', label: '矩阵', x: 300, y: 200, color: '#4f46e5' },
  { id: 'vector', label: '向量', x: 100, y: 200, color: '#db2777' },
  { id: 'system', label: '线性方程组', x: 300, y: 50, color: '#ea580c' },
  { id: 'det', label: '行列式', x: 500, y: 200, color: '#16a34a' },
  { id: 'eigen', label: '特征值/向量', x: 300, y: 350, color: '#9333ea' },
  { id: 'quad', label: '二次型', x: 500, y: 350, color: '#ca8a04' },
]

// Edges
const edges = [
  { from: 'vector', to: 'matrix', label: '变换对象' },
  { from: 'matrix', to: 'system', label: '系数矩阵' },
  { from: 'matrix', to: 'det', label: '特征数字' },
  { from: 'matrix', to: 'eigen', label: '特征分析' },
  { from: 'eigen', to: 'quad', label: '主轴定理' },
  { from: 'det', to: 'system', label: '克拉默法则' },
  { from: 'det', to: 'eigen', label: '特征方程' },
]

const selectedNode = ref<any>(null)

const selectNode = (node: any) => {
  selectedNode.value = node
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Network class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          知识图谱
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          线性代数各知识点之间的内在联系。点击节点查看详情。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Graph Area -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[500px] relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 600 400">
          <defs>
            <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="15" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#9ca3af" />
            </marker>
          </defs>

          <!-- Edges -->
          <g v-for="(edge, i) in edges" :key="i">
            <line 
              :x1="nodes.find(n => n.id === edge.from)?.x" 
              :y1="nodes.find(n => n.id === edge.from)?.y" 
              :x2="nodes.find(n => n.id === edge.to)?.x" 
              :y2="nodes.find(n => n.id === edge.to)?.y" 
              stroke="#e5e7eb" 
              stroke-width="2"
              marker-end="url(#arrow-gray)"
            />
            <!-- Edge Label -->
            <text 
              :x="(nodes.find(n => n.id === edge.from)!.x + nodes.find(n => n.id === edge.to)!.x) / 2" 
              :y="(nodes.find(n => n.id === edge.from)!.y + nodes.find(n => n.id === edge.to)!.y) / 2 - 5"
              text-anchor="middle"
              class="text-[10px] fill-gray-400"
            >
              {{ edge.label }}
            </text>
          </g>

          <!-- Nodes -->
          <g 
            v-for="node in nodes" 
            :key="node.id" 
            @click="selectNode(node)"
            class="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <circle 
              :cx="node.x" 
              :cy="node.y" 
              r="30" 
              :fill="node.color" 
              class="shadow-lg"
            />
            <text 
              :x="node.x" 
              :y="node.y" 
              dy="4" 
              text-anchor="middle" 
              fill="white" 
              class="text-xs font-bold pointer-events-none"
            >
              {{ node.label }}
            </text>
          </g>
        </svg>
      </div>

      <!-- Info Panel -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div v-if="selectedNode" class="flex-1">
          <h3 class="text-2xl font-bold mb-4" :style="{ color: selectedNode.color }">{{ selectedNode.label }}</h3>
          
          <div class="prose dark:prose-invert text-sm mb-6">
            <p v-if="selectedNode.id === 'vector'">
              <strong>小白定义：</strong> 既有大小又有方向的量。比如“向东走5米”。
              <br>
              <strong>考研地位：</strong> 基础中的基础。所有线性代数问题最后都可以转化为向量问题。
            </p>
            <p v-else-if="selectedNode.id === 'matrix'">
              <strong>小白定义：</strong> 一个装数字的表格，本质上是一个“空间变形机”。
              <br>
              <strong>考研地位：</strong> 核心工具。研究矩阵的秩、逆、初等变换是解题的关键。
            </p>
            <p v-else-if="selectedNode.id === 'system'">
              <strong>小白定义：</strong> 一堆方程凑在一起。
              <br>
              <strong>考研地位：</strong> 最终目的。大部分题目最后都是在解方程组 $Ax=0$ 或 $Ax=b$。
            </p>
            <p v-else-if="selectedNode.id === 'det'">
              <strong>小白定义：</strong> 一个数字，代表矩阵变换的“缩放比例”。
              <br>
              <strong>考研地位：</strong> 判定工具。判定矩阵是否可逆，方程组是否有解。
            </p>
            <p v-else-if="selectedNode.id === 'eigen'">
              <strong>小白定义：</strong> 变换中的“不倒翁”向量和它的伸缩倍数。
              <br>
              <strong>考研地位：</strong> 难点与高频考点。用于矩阵对角化，简化计算。
            </p>
            <p v-else-if="selectedNode.id === 'quad'">
              <strong>小白定义：</strong> 变量全是二次项的函数。
              <br>
              <strong>考研地位：</strong> 综合应用。通常结合特征值考察“化标准形”和“正定性”。
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-2">它和谁有关系？</h4>
            <ul class="space-y-2 text-sm">
              <li v-for="edge in edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id)" :key="edge.label" class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                <span class="text-gray-600 dark:text-gray-300">
                  {{ edge.label }}
                </span>
                <span class="text-xs text-gray-400">
                  ({{ edge.from === selectedNode.id ? '指向 -> ' + nodes.find(n => n.id === edge.to)?.label : '来自 <- ' + nodes.find(n => n.id === edge.from)?.label }})
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
          <Network class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg font-medium mb-2">点击左侧节点</p>
          <p class="text-sm">查看该知识点的通俗解释和考研地位</p>
        </div>
      </div>
    </div>

    <!-- Core Theorem Loop -->
    <!-- Core Theorem Loop -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white shadow-xl">
      <!-- Background Pattern -->
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"></div>

      <h2 class="relative z-10 text-2xl font-bold mb-8 flex items-center gap-3">
        <span class="text-3xl filter drop-shadow-md">🔥</span> 
        <span class="tracking-wide">核心定理闭环：<span class="text-indigo-200">秩串联一切</span></span>
      </h2>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left overflow-x-auto pb-4 custom-scrollbar">
        <div class="flex-1 min-w-[140px] group hover:-translate-y-1 transition-transform duration-300">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/20 transition-colors">
            <div class="text-xl font-mono font-bold mb-2 text-indigo-100">
              <MathEquation formula="R(A) = n" />
            </div>
            <div class="text-sm font-medium text-indigo-200">满秩矩阵</div>
          </div>
        </div>

        <div class="text-2xl text-indigo-300/50 font-light">⇔</div>

        <div class="flex-1 min-w-[140px] group hover:-translate-y-1 transition-transform duration-300">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/20 transition-colors">
            <div class="text-xl font-mono font-bold mb-2 text-indigo-100">
              <MathEquation formula="|A| \neq 0" />
            </div>
            <div class="text-sm font-medium text-indigo-200">A 可逆</div>
          </div>
        </div>

        <div class="text-2xl text-indigo-300/50 font-light">⇔</div>

        <div class="flex-1 min-w-[140px] group hover:-translate-y-1 transition-transform duration-300">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/20 transition-colors">
            <div class="text-xl font-mono font-bold mb-2 text-indigo-100">
              <MathEquation formula="Ax=0" />
            </div>
            <div class="text-sm font-medium text-indigo-200">只有零解</div>
          </div>
        </div>

        <div class="text-2xl text-indigo-300/50 font-light">⇔</div>

        <div class="flex-1 min-w-[140px] group hover:-translate-y-1 transition-transform duration-300">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/20 transition-colors">
            <div class="text-xl font-mono font-bold mb-2 text-indigo-100">
              <MathEquation formula="\alpha_i" />
            </div>
            <div class="text-sm font-medium text-indigo-200">线性无关</div>
          </div>
        </div>

        <div class="text-2xl text-indigo-300/50 font-light">⇔</div>

        <div class="flex-1 min-w-[140px] group hover:-translate-y-1 transition-transform duration-300">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/20 transition-colors">
            <div class="text-xl font-mono font-bold mb-2 text-indigo-100">
              <MathEquation formula="\lambda_i \neq 0" />
            </div>
            <div class="text-sm font-medium text-indigo-200">0 不是特征值</div>
          </div>
        </div>
      </div>
      
      <div class="relative z-10 mt-6 text-sm text-indigo-100/80 text-center border-t border-white/10 pt-4 font-medium tracking-wide">
        <p>这个闭环是线性代数考试中<strong class="text-white bg-indigo-500/50 px-2 py-0.5 rounded mx-1">最常考</strong>的逻辑链条。题目常给其中一个条件，你要瞬间反应出其他所有性质！</p>
      </div>
    </div>
  </div>
</template>
