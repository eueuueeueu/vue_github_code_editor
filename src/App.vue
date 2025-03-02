<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col box-border select-none">
    <div class="relative px-[5px] w-full h-[35px] bg-[#3c3c3c] flex justify-between items-center">
      <Icon icon="token-branded:imgnai" class="text-[30px]" />
      <!-- top-search -->
      <div
        class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center items-center w-[40%] max-w-[580px] h-[24px] text-[#cccccc] text-[12px] bg-[#4b4b4b] border-[1px] border-[#737373] rounded-md"
      >
        <div
          class="w-[50px] h-full flex justify-center items-center absolute -left-[55px] text-[#848484]"
        >
          <Icon icon="solar:arrow-left-linear" class="text-[18px] mr-[5px]" />
          <Icon icon="ep:right" class="text-[18px]" />
        </div>
        <Icon icon="quill:search" class="hover:text-[#fff] text-[18px] mr-[3px]" />
        <span v-text="reponame"></span>
      </div>
      <div class="flex items-center text-[18px] text-[#cccccc]">
        <Icon icon="codicon:layout" class="hover:text-[#fff] mx-[3px]" />
        <div
          class="flex"
          @click.stop="
            updateLayoutSetting({
              leftBar: { visible: !setting?.layout.leftBar.visible },
            })
          "
        >
          <Icon
            v-if="setting?.layout?.leftBar.visible"
            icon="ri:side-bar-fill"
            class="hover:text-[#fff] mx-[3px]"
          />
          <Icon v-else icon="ri:side-bar-line" class="hover:text-[#fff] mx-[3px]" />
        </div>
        <div
          class="flex"
          @click.stop="
            updateLayoutSetting({
              bottomBar: { visible: !setting?.layout.bottomBar.visible },
            })
          "
        >
          <Icon
            v-if="setting?.layout?.bottomBar.visible"
            icon="material-symbols:dock-to-bottom"
            class="hover:text-[#fff] mx-[3px]"
          />
          <Icon
            v-else
            icon="material-symbols:dock-to-bottom-outline"
            class="hover:text-[#fff] mx-[3px]"
          />
        </div>
        <div
          class="flex"
          @click.stop="
            updateLayoutSetting({
              rightBar: { visible: !setting?.layout.rightBar.visible },
            })
          "
        >
          <Icon
            v-if="setting?.layout?.rightBar.visible"
            icon="bxs:dock-right"
            class="hover:text-[#fff] mx-[3px]"
          />
          <Icon v-else icon="bx:dock-right" class="hover:text-[#fff] mx-[3px]" />
        </div>
      </div>
    </div>
    <div class="flex-1 flex">
      <div
        class="w-[48px] bg-[#333333] text-[26px] flex flex-col justify-between items-center text-[#858585]"
      >
        <div class="flex flex-col justify-between items-center pt-[10px]">
          <Icon icon="codicon:github" class="text-[#fff] my-[10px]" />
          <Icon icon="material-symbols:menu-rounded" class="hover:text-[#fff] my-[10px]" />
          <Icon
            v-for="(item, index) in menuIcons"
            :key="item"
            :icon="item"
            @click="activeMenuItemIndex = index"
            :class="[
              'hover:text-[#fff] my-[10px]',
              { 'text-white': activeMenuItemIndex === index },
            ]"
          />
        </div>
        <div class="flex flex-col justify-between items-center pt-[10px]">
          <Icon icon="solar:user-circle-linear" class="hover:text-[#fff] text-[28px] my-[10px]" />
          <Icon icon="weui:setting-outlined" class="hover:text-[#fff] text-[30px] my-[10px]" />
        </div>
      </div>
      <div
        v-show="setting?.layout?.leftBar.visible"
        :style="{ width: setting?.layout?.leftBar.width + 'px' }"
        class="relative w-[307px] bg-[#252526]"
      >
        <div class="flex justify-between p-[8px] items-center text-[#bbbbbb]">
          <span class="text-[12px] cursor-default select-none">EXPLORER</span>
          <div
            @click.stop="opendropdown"
            class="relative cursor-pointer inline-block w-[18px] text-center leading-[18px] h-[18px] rounded-sm hover:bg-[#363737]"
          >
            <span @mouseenter="showtip_dropdown" @mouseout="hidetip_dropdown" class="select-none"
              >···</span
            >
            <!-- 提示框 -->
            <div
              v-show="tooltipvisible"
              class="absolute top-[130%] text-[12px] w-[100px] p-[2px] left-[50%] -translate-x-[50%] z-20 rounded-md border-[1px] border-[#454545]"
            >
              我是提示
            </div>
            <!-- 下拉菜单 -->
            <div
              ref="dropdownContainerRef"
              v-show="dropdownVisible"
              class="p-[4px] rounded-md absolute z-30 w-[160px] bg-[#252526] border-[1px] border-[#454545]"
            >
              <div
                v-for="item in dropdownList"
                v-bind:key="item"
                class="h-[28px] leading-[28px] rounded-md text-[14px] hover:bg-[#0078d4]"
                v-text="item"
              ></div>
            </div>
          </div>
        </div>
        <div class="FileResource">
          <ul>
            <li
              v-for="file in data"
              :key="file.name"
              v-text="file.name"
              class="text-[#fff] overflow-hidden whitespace-nowrap text-ellipsis"
            ></li>
          </ul>
        </div>
        <i
          ref="leftBarPointer"
          class="absolute top-0 right-0 w-[4px] h-full cursor-col-resize transition-all hover:bg-[#007fd4]"
        ></i>
      </div>
      <div class="flex-1 bg-[#1e1e1e] flex flex-col justify-between items-center">
        <div class="flex flex-col items-center flex-1">
          <Icon
            v-if="setting?.layout?.bottomBar.height < 500"
            icon="ix:book"
            class="flex-1 max-w-[300px] max-h-[300px] w-fit text-[#151515]"
          />
          <div
            v-if="setting?.layout?.bottomBar.height < 300"
            class="text-[#707070] w-[280px] select-none h-[156px] flex justify-between items-center flex-col"
          >
            <div
              v-for="item in shortcutKey"
              v-bind:key="item"
              class="flex justify-between items-center w-full"
            >
              <p class="mr-[15px] w-[130px] text-[13px] text-right" v-text="item.name"></p>
              <div class="flex flex-1 justify-start">
                <template v-for="i in item.keywords" v-bind:key="i">
                  <span
                    class="px-[5px] text-[#a9a9a9] bg-[#2c2c2c] flex justify-center items-center text-[12px]"
                    v-text="i"
                  ></span>
                  <span v-if="i !== item.keywords[item.keywords.length - 1]">&nbsp;+&nbsp;</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- v-if="setting?.layout?.bottomBar.height >50" -->
        <div
          v-show="setting?.layout?.bottomBar.visible"
          class="relative w-full min-h-[4px] h-[200px] bg-[#1e1e1e] border-t-2 border-t-[#414141]"
          :style="{ height: setting?.layout?.bottomBar.height + 'px' }"
        >
          <i
            ref="bottomBarPointer"
            class="absolute top-0 left-0 w-full h-[4px] cursor-row-resize transition-all hover:bg-[#007fd4]"
          ></i>
        </div>
      </div>
      <div
        v-show="setting?.layout?.rightBar.visible"
        class="relative w-[307px] bg-[#252526]"
        :style="{ width: setting?.layout?.rightBar.width + 'px' }"
      >
        <i
          ref="rightBarPointer"
          class="absolute top-0 left-0 w-[4px] h-full cursor-col-resize transition-all hover:bg-[#007fd4]"
        ></i>
      </div>
    </div>
    <div class="w-full h-[22px] bg-[#007acc] flex justify-between text-[#fff] text-[12px]">
      <div class="flex">
        <div class="bg-[#16825d] flex justify-center items-center px-[15px]">
          <Icon
            icon="streamline:interface-arrows-expand-5-expand-small-bigger-retract-smaller-big"
            class="text-[12px] mr-[5px]"
          />
          <span v-text="reponame"></span>
        </div>
        <div class="flex justify-center items-center px-[7px]">
          <Icon icon="pajamas:branch" class="text-[15px] mr-[3px]" />
          <span v-text="branch"></span>
        </div>
        <div class="flex justify-center items-center px-[2px] mx-[4px]">
          <Icon icon="weui:refresh-outlined" class="text-[16px] mr-[3px]" />
        </div>
        <div class="flex justify-center items-center px-[7px]">
          <Icon icon="proicons:cancel-circle" class="text-[16px] mr-[3px]" />
          <span v-text="error_count" class="translate-y-[1px]"></span>
          <Icon icon="material-symbols-light:warning-outline" class="text-[18px] mr-[3px]" />
          <span v-text="warning_count" class="translate-y-[1px]"></span>
        </div>
        <div class="flex justify-center items-center px-[7px]">
          <Icon icon="prime:heart" class="text-[18px]" />
          <span>Sponsors:</span>
          <span class="ml-[10px]" v-text="sponsors"></span>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>
<script setup>
// 禁止DOM操作 转而使用指令来间接实现DOM操作
// 在vue.js中指令是操作DOM的唯一方法
// 指令是以v-开头的一种特殊的标签的自定义属性，它具有DOM操作的能力
// 在vue.js中 数据变化(响应式数据) => 视图更新
// 响应式API的作用：将js数据转换为响应式数据
// v-text 给元素绑定内容文本
// v-on   给元素绑定事件
// v-show 控制元素显示/隐藏的 原理：display:none/block
// v-for  循环渲染 注意点：v-for指令一定要搭配v-bind:key="当前列表中唯一不变的值,一般绑定id" 用来提升性能
// v-bind 是给所有标签属性(官方、自定义)绑定值的
// 指令：v-指令名:参数.修饰符=绑定的值
// v-指令名=绑定的值 v-text v-show
// v-指令名:参数=绑定的值 v-on v-bind
// v-指令名:参数,修饰符=绑定的值 v-on

// 命名规范：组合式函数的名称必须以use开头
// 普通函数和组合式函数有什么区别？
// 组合式函数需要有组合式API的参与 (ref、onMounted、watchEffect...)的参与
// 为什么要封装组合式函数？为了对状态的复用
// 组合式函数如何正确的使用？
// 组合式菌数只能使用在两个位置:组件的script标签的顶层。其它组合式函数中。

import {
  ref,
  watchEffect,
  watch,
  isRef,
  unref,
  onMounted,
  reactive,
  toRef,
  toRefs,
  toRaw,
  toValue,
} from 'vue'
import { Icon } from '@iconify/vue'
import { clickOutside, useApi, useSetting } from '@/hooks'
import axios from 'axios'
// 导入拖拽库的组件和 CSS
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const { setting, updateSetting: updateLayoutSetting } = useSetting('layout')
// 请求文件列表数据
const { loading, error, data, run } = useApi(() => axios.get('/api/fileDirectory'), {
  defaultData: [],
  manual: true,
})

function actionMenu(callback) {
  const menuIcons = [
    'fa-regular:copy',
    'quill:search',
    'pajamas:branch',
    'codicon:debug-alt',
    'codicon:extensions',
    'mage:robot-wink',
  ]
  const activeMenuItemIndex = ref(0)
  watchEffect(() => callback(activeMenuItemIndex.value))
  return { menuIcons, activeMenuItemIndex }
}
const { menuIcons, activeMenuItemIndex } = actionMenu(function (key) {
  switch (key) {
    case 0:
      run()
      break
    case 1:
      console.log('111')
      break
    default:
      break
  }
})

// 视图和更多操作数据
const dropdownList = ['Open Editors', 'Folders', 'Outline', 'Timeline']
// 快捷键数据
const shortcutKey = [
  {
    name: 'Show All Commands',
    keywords: ['Ctrl', 'Shift', 'P'],
  },
  {
    name: 'Go to File',
    keywords: ['Ctrl', 'P'],
  },
  {
    name: 'Find in Files',
    keywords: ['Ctrl', 'Shift', 'F'],
  },
  {
    name: 'Open Settings',
    keywords: ['Ctrl', ','],
  },
]
// 动态的数据 ———— 路径
const reponame = ref('JinJieTan/Peter-')
const branch = ref('master')
const sponsors = ref('Sourcegraph')
const error_count = ref('0')
const warning_count = ref('0')

function actionDropdown() {
  // 获取页面上的节点
  const domRef = ref(null)
  const menuVisible = ref(false)
  const tipvisible = ref(false)
  function open() {
    menuVisible.value = !menuVisible.value
    tipvisible.value = false
  }
  function showtip() {
    if (!menuVisible.value) tipvisible.value = true
  }
  function hidetip() {
    tipvisible.value = false
  }
  clickOutside(domRef, () => (menuVisible.value = false))
  return { menuVisible, tipvisible, domRef, open, showtip, hidetip }
}
const {
  menuVisible: dropdownVisible,
  tipvisible: tooltipvisible,
  domRef: dropdownContainerRef,
  open: opendropdown,
  showtip: showtip_dropdown,
  hidetip: hidetip_dropdown,
} = actionDropdown()

function useMoveDistance(elementRef, callback) {
  const distanceX = ref(0)
  const distanceY = ref(0)
  onMounted(() => {
    if (!(isRef(elementRef) && unref(elementRef) instanceof HTMLElement))
      throw new Error('ElementRef不是一个ref数据或其值不是一个HTML元素')
    unref(elementRef).addEventListener('mousedown', ({ x: startX, y: startY }) => {
      const onMousemove = ({ x: currentX, y: currentY }) => {
        distanceX.value = currentX - startX
        distanceY.value = currentY - startY
      }
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', () => {
        callback()
        document.removeEventListener('mousemove', onMousemove)
      })
    })
  })
  return { distanceX, distanceY }
}
const bottomBarPointer = ref(null)
let bottombarHeight = setting.value.layout.bottomBar.height
const { distanceY: bottomBar_distanceY } = useMoveDistance(bottomBarPointer, () => {
  bottombarHeight = setting.value.layout.bottomBar.height
})
watch([bottomBar_distanceY], () => {
  updateLayoutSetting({
    bottomBar: { height: bottombarHeight - bottomBar_distanceY.value },
  })
})
const leftBarPointer = ref(null)
let leftBarWidth = setting.value.layout.leftBar.width
const { distanceX: leftBar_distanceX } = useMoveDistance(leftBarPointer, () => {
  leftBarWidth = setting.value.layout.leftBar.width
})
watch([leftBar_distanceX], () => {
  updateLayoutSetting({
    leftBar: { width: leftBarWidth + leftBar_distanceX.value },
  })
})
const rightBarPointer = ref(null)
let rightBarWidth = setting.value.layout.leftBar.width
const { distanceX: rightBar_distanceX } = useMoveDistance(rightBarPointer, () => {
  rightBarWidth = setting.value.layout.rightBar.width
})
watch([rightBar_distanceX], () => {
  updateLayoutSetting({
    rightBar: { width: rightBarWidth - rightBar_distanceX.value },
  })
})

// reactive的参数只接受对象
// reactive在使用的时候 无论是在script块中 还是在template块中 都可以直接通过属性名访问
// ref的参数是任意类型
// ref在使用的时候 在script块中需要通过.value后跟属性名取值 在template块中可以直接通过属性名访问(不需要.value)
// 注意：reactive数据可以通过toRef、toRefs这两个API转换为ref响应式数据
// reactive还原原始数据 使用toRaw
// ref还原原始数据 SON.parse(JsON.stringify(toValue(ref数据)))
</script>
<!-- scoped是样式的隔离。代表这里的样式不会作用与其他的页面 -->
<style scoped>
@keyframes delay {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: transparent;
  }
  100% {
    background-color: #007fd4;
  }
}
.highlight {
  animation: delay 1s forwards;
}
</style>
