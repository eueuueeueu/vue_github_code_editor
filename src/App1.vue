<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col box-border select-none">
    <div class="relative px-[5px] w-full h-[35px] bg-[#3c3c3c] flex justify-between items-center">
      <Icon icon="svg-spinners:bars-scale" class="text-[20px]" />
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
    <div class="flex-1 flex overflow-hidden">
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
        class="relative w-[307px] bg-[#252526] flex flex-col overflow-hidden"
      >
        <div class="flex justify-between p-[8px] items-center text-[#bbbbbb]">
          <span class="text-[12px] cursor-default select-none">EXPLORER</span>
          <div
            class="relative inline-block w-[18px] text-center leading-[18px] h-[18px] rounded-sm hover:bg-[#363737]"
          >
            <!-- 提示框 -->
            <div
              v-show="tooltipvisible"
              class="absolute top-[130%] text-[12px] w-[100px] p-[2px] left-[50%] -translate-x-[50%] z-20 rounded-md border-[1px] border-[#454545]"
            >
              我是提示
            </div>
            <!-- 下拉菜单 -->
            <Dropdown @checked="triggerEvent" :data="dropdownList1">
              <!-- 插槽slot -->
              <span
                @mouseenter="showtip_dropdown"
                @mouseout="hidetip_dropdown"
                class="select-none cursor-pointer"
                >···</span
              >
            </Dropdown>
          </div>
        </div>
        <div class="fileResource flex-1 overflow-auto scrollbar">
          <tree :data="data" :expandKeys="expandPaths" @node-click="expandList" />
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
        <div
          v-show="setting?.layout?.bottomBar.visible"
          class="relative w-full min-h-[4px] h-[200px] bg-[#1e1e1e] border-t-2 border-t-[#414141]"
          :style="{ height: setting?.layout?.bottomBar.height + 'px' }"
        >
          <i
            ref="bottomBarPointer"
            class="absolute top-[-3px] left-0 w-full h-[4px] cursor-row-resize transition-all hover:bg-[#007fd4]"
          ></i>
          <div class="flex h-[30px]">
            <div class="w-[50%] flex justify-start">
              <span
                class="mx-[10px] h-full flex items-center text-[10px] text-[#ffffff] hover:text-[#fff] cursor-pointer border-b border-white"
                >PROBLEMS</span
              >
              <span
                class="mx-[10px] h-full flex items-center text-[10px] text-[#8f9797] hover:text-[#fff] cursor-pointer"
                >OUTPUT</span
              >
              <span
                class="mx-[10px] h-full flex items-center text-[10px] text-[#8f9797] hover:text-[#fff] cursor-pointer"
                >TERMINAL</span
              >
            </div>
            <div class="w-[50%] flex">
              <div class="relative flex-1 flex items-center rounded-md">
                <input
                  type="text"
                  placeholder="Filter (e.g. text, **/*ts,!**/node_modules/**)"
                  class="w-full h-[80%] indent-[5px] text-[10px] text-white rounded-md focus:border focus:border-[#007fd4] outline-none bg-[#3c3c3c]"
                />
                <Icon
                  class="absolute top-[50%] -translate-y-[50%] right-[5px] text-[#c0bdc0] text-[18px]"
                  icon="iconamoon:funnel-thin"
                />
              </div>
              <div class="flex h-full items-center">
                <Icon
                  class="text-[22px] mx-[3px] text-[#c0bdc0] hover:bg-[#313232] px-[3px]"
                  icon="codicon:collapse-all"
                />
                <Icon
                  class="text-[22px] mx-[3px] text-[#c0bdc0] hover:bg-[#313232] px-[3px]"
                  icon="codicon:list-flat"
                />
                <Icon
                  class="text-[22px] mx-[3px] text-[#c0bdc0] hover:bg-[#313232] px-[3px]"
                  icon="uiw:up"
                />
                <Icon
                  class="text-[22px] mx-[3px] text-[#c0bdc0] hover:bg-[#313232] px-[3px]"
                  icon="ic:twotone-close"
                  @click.stop="
                    updateLayoutSetting({
                      bottomBar: { visible: !setting?.layout.bottomBar.visible },
                    })
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="setting?.layout?.rightBar.visible"
        class="relative w-[307px] bg-[#252526] flex flex-col justify-between items-center pb-[20px]"
        :style="{ width: setting?.layout?.rightBar.width + 'px' }"
      >
        <i
          ref="rightBarPointer"
          class="absolute top-0 left-0 w-[4px] h-full cursor-col-resize transition-all hover:bg-[#007fd4]"
        ></i>
        <div class="flex w-full justify-between items-center px-[7px] pt-[5px] text-[#787879]">
          <div class="flex">
            <Icon
              class="text-[21px] text-[#c0bdc0] hover:bg-[#313232] px-[3px] pb-[5px] mr-[3px] border-b border-white"
              icon="fluent-mdl2:office-chat"
            />
            <Icon
              class="text-[23px] hover:bg-[#313232] px-[3px] pb-[6px]"
              icon="mynaui:book-plus"
            />
          </div>
          <div class="flex">
            <Icon
              class="text-[25px] hover:bg-[#313232] px-[3px] pb-[5px]"
              icon="clarity:add-line"
            />
            <Icon
              class="text-[25px] hover:bg-[#313232] px-[3px] pb-[5px]"
              icon="material-symbols-light:history-rounded"
            />
            <Icon
              class="text-[25px] hover:bg-[#313232] px-[3px] pb-[5px]"
              icon="mingcute:more-1-line"
            />
            <Icon
              class="text-[25px] text-[#c0bdc0] hover:bg-[#313232] px-[3px] pb-[5px]"
              icon="ic:twotone-close"
              @click.stop="
                updateLayoutSetting({
                  rightBar: { visible: !setting?.layout.rightBar.visible },
                })
              "
            />
          </div>
        </div>
        <div
          contenteditable="true"
          class="relative w-[90%] text-[16px] pb-[30px] indent-[5px] pt-[5px] outline-0 focus:border text-[#aeafad] min-h-[50px] max-h-[500px] break-words overflow-y-auto focus:border-[#007fd4] rounded-md bg-[#3c3c3c]"
        >
          <!-- ！！！任务：把字体图标找到放在这里就好了 -->
        </div>
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
  <!-- 右键菜单 -->
  <ul
    v-show="menuIsblock"
    :style="{ top: topDistance + 'px', left: leftDistance + 'px' }"
    class="menuContext flex flex-col justify-center items-center rounded-md fixed z-[999] bg-[#252526] text-[#b7b7b8] py-[8px] border-[1px] border-[#454545]"
  >
    <template v-for="(item, index) in menuDate" :key="item">
      <li
        class="w-[96%] py-[4px] flex justify-between px-[20px] cursor-pointer hover:bg-[#0078d4] rounded-md"
      >
        <span
          v-text="item.name"
          class="w-[50%] text-[13px] overflow-hidden whitespace-nowrap text-ellipsis"
        ></span>
        <span
          v-if="item.shortcutKey"
          v-text="item.shortcutKey"
          class="text-[13px] whitespace-nowrap"
        ></span>
      </li>
      <i
        v-if="index === 1 || index === 5 || index === 6"
        class="w-full h-[1px] bg-[#454545] my-[4px]"
      ></i>
    </template>
  </ul>
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
import { useApi, useSetting, useMenuContext } from '@/hooks'
import axios from 'axios'
import Dropdown from './components/dropdown.vue'
import Tree from './components/Tree.vue'

// 指定在目录展开哪个
const expandPaths = ref([])

watchEffect(() => {
  console.log(expandPaths.value)
})

// 因为fullPath是data中唯一不重复的值，所以拿path当id
function expandList(fullPathId) {
  const index = expandPaths.value.indexOf(fullPathId)
  if (index > -1) {
    expandPaths.value.splice(index, 1)
  } else {
    expandPaths.value.push(fullPathId)
  }
}
const { setting, updateSetting: updateLayoutSetting } = useSetting('layout')
// 请求文件列表数据
const { loading, error, data, run } = useApi(() => axios.get('/api/fileDirectory'), {
  defaultData: [],
  manual: true,
})

// 右键菜单
const [menuIsblock, topDistance, leftDistance] = [ref(false), ref(0), ref(0)]
useMenuContext(menuIsblock, topDistance, leftDistance)
const menuDate = [
  {
    name: 'New Text File',
    shortcutKey: 'Ctrl+K N',
  },
  {
    name: 'Open File Search Box',
    shortcutKey: 'Ctrl+P',
  },
  {
    name: 'Split Up',
    shortcutKey: 'Ctrl+K Ctrl+\\',
  },
  {
    name: 'Split Down',
    shortcutKey: null,
  },
  {
    name: 'Split Left',
    shortcutKey: null,
  },
  {
    name: 'Split Right',
    shortcutKey: null,
  },
  {
    name: 'New Window',
    shortcutKey: null,
  },
  {
    name: 'Lock Group',
    shortcutKey: null,
  },
]
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
// const dropdownList1 = ['Open Editors', 'Folders', 'Outline', 'Timeline']
const dropdownList1 = [
  {
    name: 'Open Editors',
    disable: false,
    code: 1,
  },
  {
    name: 'Folders',
    disable: true,
    code: 2,
  },
  {
    name: 'Outline',
    disable: false,
    code: 3,
  },
  {
    name: 'Timeline',
    disable: false,
    code: 4,
  },
]
const dropdownList2 = ['1111', '2222', '3333', '4444']
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

// function actionDropdown() {
//   // 获取页面上的节点
//   const domRef = ref(null)
//   const menuVisible = ref(false)
//   const tipvisible = ref(false)
//   function open() {
//     menuVisible.value = !menuVisible.value
//     tipvisible.value = false
//   }
//   function showtip() {
//     if (!menuVisible.value) tipvisible.value = true
//   }
//   function hidetip() {
//     tipvisible.value = false
//   }
//   return { menuVisible, tipvisible, domRef, open, showtip, hidetip }
// }
// const {
//   menuVisible: dropdownVisible,
//   tipvisible: tooltipvisible,
//   domRef: dropdownContainerRef,
//   open: opendropdown,
//   showtip: showtip_dropdown,
//   hidetip: hidetip_dropdown,
// } = actionDropdown()

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
let rightBarWidth = setting.value.layout.rightBar.width
const { distanceX: rightBar_distanceX } = useMoveDistance(rightBarPointer, () => {
  rightBarWidth = setting.value.layout.rightBar.width
})
watch([rightBar_distanceX], () => {
  updateLayoutSetting({
    rightBar: { width: rightBarWidth - rightBar_distanceX.value },
  })
})

function triggerEvent(arg) {
  switch (arg.code) {
    case 1:
      console.log(arg.name)
      break
    case 2:
      console.log(arg.name)
      break
    case 3:
      console.log(arg.name)
      break
    case 4:
      console.log(arg.name)
      break
    default:
      break
  }
}

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
.scrollbar::-webkit-scrollbar,
.scrollbar::-webkit-scrollbar-thumb {
  width: 10px;
  background-color: #252526;
}
.scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #464647;
}
</style>
