<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  formula: string
  displayMode?: boolean
}>()

const container = ref<HTMLElement | null>(null)

const render = () => {
  if (container.value) {
    katex.render(props.formula, container.value, {
      displayMode: props.displayMode || false,
      throwOnError: false
    })
  }
}

onMounted(render)
watch(() => props.formula, render)
</script>

<template>
  <span ref="container" class="math-equation"></span>
</template>

<style>
.math-equation .katex {
  font-size: 1.1em;
}
</style>
