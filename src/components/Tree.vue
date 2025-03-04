<template>
  <div v-for="item in props.data" :key="item.name">
    <div
      class="text-[#cccccc] hover:bg-[#2a2d2e] overflow-hidden whitespace-nowrap text-ellipsis"
      :style="{ paddingLeft: `${props.padding ?? 0}px` }"
    >
      {{ item.name }}
    </div>
    <Tree
      baz="b"
      v-if="item.children && item.children.length > 0"
      :data="item.children"
      :padding="props.padding + 10"
    >
    </Tree>
  </div>
</template>
<script setup>
// 如何获取组件属性传递的数据？
// useAttrs、defineProps
// attributes property 都是表达属性
// useAttrs 侧重表达的是HTML属性 出现在HTML标签中
// defineProps 侧重表达的是DOM属性 不会在HTML标签中
// useAttrs 可以直接使用 没有数据检验和默认值的功能（不严谨但方便）
// defineProps 不能直接使用 需要通过数据检验还具备默认值的功能（严谨但不方便）【强烈推荐】
import { data } from 'autoprefixer'
import { useAttrs, defineProps, defineOptions } from 'vue'
// 通过defineOptions来规定组件的名称
defineOptions({ name: 'Tree' })
// 先define定义
// const props = defineProps(['data','padding']) 不推荐写法
// 只能规范数据类型 不能给默认值
// const props = defineProps({
//   data: Array,
//   padding: Number,
// })
// 【强烈推荐的写法】
const props = defineProps({
  data: {
    type: Array, //规定数据类型
    required: true, //规定属性是必须传递的
  },
  padding: {
    type: Number, //规定数据类型
    default: 0, //默认值     默认值 和 必传 是互斥的
  },
  baz: {
    required: true,
    // 自定义验证器 函数 返回布尔值
    validator(value) {
      // console.log(value)
      return ['a', 'b', 'c'].includes(value)
    },
  },
})
</script>
