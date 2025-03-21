import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useListStore } from '@/stores/list'

// 从 store 获取前后端交互用函数
const listStore = useListStore();
const fetchUpdateList = listStore.fetchUpdateList;

export const useSettingStore = defineStore('setting', () => {
  const setting = reactive({
    // 1: 黑棋, -1: 白棋;
    firstPlayer: 1,
    size: 15,
    whiteRegretControl: 3,
    blackRegretControl: 3,
  });

  const changeFirstPlayer = (payload) => {
    setting.firstPlayer = payload;
  }

  const changeSize = (payload) => {
    setting.size = payload;
  }

  const changeRegretControl = (payload) => {
    setting.whiteRegretControl = payload;
    setting.blackRegretControl = payload;
  }

  const changeToDefault = () => {
    changeFirstPlayer(1);
    changeSize(15);
    changeRegretControl(3);
  }

  // 保存设置
  const saveSetting = () => {
    const changeSave = '' + setting.firstPlayer + ' ' + setting.size + ' ' + setting.blackRegretControl;
    const payload = {
      content: changeSave,
      over: false,
      create_time: "2025-01-01 12:12:12",
      resolves_time: "2024-01-01 12:12:12",
    }
    fetchUpdateList(65, payload);
  }

  // 获取保存的设置
  const loadSetting = async () => {
    if(listStore.list.at(-1).content === '例子') {
      listStore.getToken();
      await listStore.fetchList();
    }
    const newLoad = listStore.list.at(-1).content.trim().split(' ');
    changeFirstPlayer(newLoad[0]);
    changeSize(newLoad[1]);
    changeRegretControl(newLoad[2]);
  }
  // const changeLoad = changeSave.split(' ');
  // console.log(changeLoad);
  loadSetting();
  return { setting, changeFirstPlayer, changeSize, changeRegretControl, changeToDefault, saveSetting, loadSetting};
})