import { ref, onMounted, toValue, watch, reactive, toRef, toRaw } from 'vue'
import defaultSetting from '../../config/setting.json'
import _ from 'lodash'
import store from 'store'
// 组合式API hooks
// 基于vue提供的api自定义clickOutside API
export function clickOutside(domRef, callback) {
  // 获取DOM节点使用
  // 某些操作需要template渲染完成后执行
  // 执行的时机是在template挂载到页面之后(渲染完成之后)
  onMounted(function () {
    document.addEventListener('click', (e) => {
      if (!domRef.value?.contains(e.target)) {
        callback()
      }
    })
  })
}
export function useApi(api, option = {}) {
  // 状态
  const data = ref(option.defaultData ?? null)
  const error = ref(null)
  const loading = ref(true)
  const run = () => {
    api()
      .then((res) => {
        data.value = res.data
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })
  }
  if (option.manual) {
    return { data, error, loading, run }
  }
  run()
  return { data, error, loading }
}

export function useSetting(key) {
  const config = reactive({ setting: null })
  const settingFromChche = store.get('setting')
  if (!settingFromChche) {
    config.setting = defaultSetting
    store.set('setting', defaultSetting)
  } else {
    config.setting = settingFromChche
  }
  const updateSetting = (params) => {
    const setting = _.merge(config.setting, { layout: { ...params } })
    config.setting = setting
    store.set('setting', setting)
  }
  return { setting: toRef(config, 'setting'), updateSetting }
}
// 右键菜单
// function useMenucontext(){}