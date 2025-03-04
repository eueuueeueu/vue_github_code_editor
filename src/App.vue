<template>
  <div>
    <h1>Tree组件测试页面</h1>
    <Tree2 :data="data" :expandKeys="expandIds" @node-click="fn" />
  </div>
</template>
<script setup>
import Tree2 from './components/Tree2.vue'
import { ref } from 'vue'
const expandIds = ref([])
function fn(id) {
  const index = expandIds.value.indexOf(id)
  if (index > -1) {
    expandIds.value.splice(index, 1)
  } else {
    expandIds.value.push(id)
  }
}
const data = [
  {
    label: '一级 1',
    id: 1,
    children: [
      {
        label: '二级 1-1',
        id: 2,
        children: [
          {
            label: '三级 1-1-1',
            id: 3,
          },
        ],
      },
    ],
  },
  {
    label: '一级 2',
    id: 4,
    children: [
      {
        label: '二级 2-1',
        id: 5,
        children: [
          {
            label: '三级 2-1-1',
            id: 6,
          },
        ],
      },
      {
        label: '二级 2-2',
        id: 7,
        children: [
          {
            label: '三级 2-2-1',
            id: 8,
          },
        ],
      },
    ],
  },
  {
    label: '一级 3',
    id: 9,
    children: [
      {
        label: '二级 3-1',
        id: 10,
        children: [
          {
            label: '三级 3-1-1',
            id: 11,
          },
        ],
      },
      {
        label: '二级 3-2',
        id: 12,
        children: [
          {
            label: '三级 3-2-1',
            id: 13,
            children: [
              {
                label: '四级 3-2-1',
                id: 14,
              },
            ],
          },
        ],
      },
    ],
  },
]
</script>
