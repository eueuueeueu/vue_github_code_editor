<template>
  <div v-show="visible" class="z-40 top-0 left-0 fixed w-screen h-screen"></div>
  <div class="inline-block">
    <span class="inline-block" @click.stop="visible = !visible">
      <!-- 内置组件slot 它的作用是对你传递的子标签的引用 并且指定位置 -->
      <slot></slot>
    </span>
    <div
      ref="main"
      v-show="visible"
      class="p-[4px] rounded-md absolute z-50 w-[160px] bg-[#252526] border-[1px] border-[#454545]"
    >
      <div
        v-for="item in data"
        v-bind:key="item.name"
        @click="showControl(item)"
        class="h-[28px] leading-[28px] rounded-md text-[14px]"
        :class="{
          'text-[#686868] cursor-not-allowed': item.disable,
          'hover:bg-[#0078d4] cursor-pointer': !item.disable,
        }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
// script setup属性的作用：可以使用组合式API
import { ref, useAttrs, defineEmits } from 'vue'
import { useClickOutside } from '@/hooks'
const visible = ref(false)
const tipVisible = ref(false)
const { data } = useAttrs()
const main = ref(null)

// const emit = defineEmits(['abc'])
const showControl = (item) => {
  if (!item.disable) {
    // emit
    visible.value = false
  }
}
useClickOutside(main, () => (visible.value = false))
</script>
