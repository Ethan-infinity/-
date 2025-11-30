<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans selection:bg-indigo-500/30">
    <Sidebar />
    <main class="flex-1 overflow-x-hidden relative">
      <!-- Global Background Pattern -->
      <div class="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 32px 32px;">
      </div>
      
      <div class="container mx-auto px-8 py-10 relative z-10 max-w-7xl">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>
