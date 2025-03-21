<template>
    <el-page-header :icon="Back" @back="pause">
        <template #content>
            <span> 游戏设置 </span>
        </template>
    </el-page-header>
    <el-form>
      <span class="tips">当前先手:
        <span v-show="setting.firstPlayer > 0"> 黑棋</span>
        <span v-show="setting.firstPlayer < 0"> 白棋</span>
      </span>
      <el-form-item label="先手方选择" style="width: 475px;">
        <el-select placeholder="请调整先手方" v-model="setting.firstPlayer" @change="changeFirstPlayer">
            <el-option label="黑棋先手" value = 1 />
            <el-option label="白棋先手" value = -1 />
        </el-select>
      </el-form-item>
      <span class="tips">当前尺寸: {{ setting.size }}</span>
      <el-form-item label="棋盘尺寸调整" style="width: 475px;">
        <!-- 对 min 及 max 传入数字, 使用动态绑定以方便字符串转化 -->
        <el-slider v-model="size" :min="5" :max="20" @change="changeSize"/>
      </el-form-item>
      <span class="tips">当前悔棋次数设置:
        <span v-if="setting.blackRegretControl < 0"> 不限次</span>
        <span v-else> {{ setting.blackRegretControl }} 次</span>
      </span>
      <el-form-item label="设置悔棋次数限制">
        <el-radio-group size="large" @change="changeRegretControl">
          <el-radio-button label="不限次数" value="-1" />
          <el-radio-button label="禁止悔棋" value="0" />
          <el-radio-button label="1次" value="1" />
          <el-radio-button label="3次" value="3" />
          <el-radio-button label="5次" value="5" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 200px; margin: 0 auto;margin-bottom: -30px;" type="info" @click="toDefault">
          恢复默认
        </el-button>
      </el-form-item>
    </el-form>
    <!-- <p>{{ setting }}</p> -->
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { Back } from '@element-plus/icons-vue';
import { useSettingStore } from '@/stores/setting'
import { useListStore } from '@/stores/list'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';

// store
const settingStore = useSettingStore();
const listStore = useListStore();
const setting = settingStore.setting;
// 滑块必须使用 ref 对象
const size = ref(+setting.size);

// router
const router = useRouter();

// 回首页
const goBack = () => {
    router.back();
}

// 先手改变
const changeFirstPlayer = (val) => {
  settingStore.changeFirstPlayer(val);
}

// 棋盘尺寸改变
const changeSize = (val) => {
  settingStore.changeSize(val);
}

// 悔棋次数设置改变
const changeRegretControl = (val) => {
  settingStore.changeRegretControl(val);
}

// 默认函数
const changeToDefault = () => {
  settingStore.changeToDefault();
}

// 暂停
const pause = () => {
  ElMessageBox.confirm(
    '要返回主菜单吗',
    'info',
    {
      cancelButtonText: '继续更改设置',
      confirmButtonText: '保存并返回主菜单',
      type: 'info',
    }
  )
  .then( () => {
    settingStore.saveSetting();
    goBack();
  })
  .catch( () => {
    return;
  })
}

// 回到默认
const toDefault = () => {
  ElMessageBox.confirm(
    '要使用默认设置吗',
    'info',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'info',
    }
  )
  .then( () => {
    changeToDefault();
  })
  .catch( () => {
    return;
  })
}

onMounted(async () => {
  if(setting.size === undefined || setting.blackRegretControl === undefined) {
    await listStore.fetchList();
    // console.log(listStore.token);
    // console.log(listStore.list);
    settingStore.loadSetting();
  }
  // console.log(setting.size);
})
</script>

<style scoped>
.el-page-header {
  padding-top: 10px;
  height: 40px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #000;
}

.el-form {
  width: 600px;
  margin: 200px auto;
  padding: 30px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #fff;
  .el-form-item {
    margin-bottom: 30px;
  }
  .tips {
    position: relative;
    bottom: 5px;
  }
}
</style>