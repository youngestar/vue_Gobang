<template>
    <el-page-header :icon="Back" @back="pause">
        <template #content>
            <span> 历史记录 </span>
        </template>
    </el-page-header>
    <!-- {{ store.list }} -->
    <el-table :data="store.list.slice(0,store.list.length - 1)" style="width: 100%" stripe max-height="1000">
      <el-table-column prop="over" label="收藏对局" width="100">
        <template #default="scope">
            <el-icon v-if="scope.row.over"><svg t="1738745501198" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4166" width="200" height="200"><path d="M508.3392 883.712C200.7296 1100.2112 101.2224 1023.6928 209.792 654.1056c-292.9408-237.4912-253.7472-359.6544 117.5808-366.3872 126.5152-363.3408 250.2912-362.2656 371.2 3.0976 371.0976 12.9792 408.448 135.8336 111.8976 368.384C913.2032 1030.5024 812.4928 1105.408 508.3392 883.712L508.3392 883.712zM508.3392 883.712" fill="#efb336" p-id="4167"></path></svg></el-icon>
            <el-icon v-else><svg t="1738745474481" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4004" width="200" height="200"><path d="M751.6928 1007.8464c-57.344 0-137.088-36.864-243.4304-112.6656-106.1376 73.0112-185.6512 108.5696-242.8416 108.5696l0 0c-33.8176 0-61.2096-12.7488-79.2576-36.8128-38.3488-51.2512-34.9952-150.3488 10.7008-311.168-143.3856-118.5024-199.2192-205.8752-175.6416-274.3296 23.2192-67.4304 118.0416-101.4272 297.9072-106.5728 63.2832-176.384 125.5168-258.688 195.2768-258.688 70.2976 0 131.712 83.3536 192.6912 261.9392 179.7888 8.1664 274.0992 43.776 296.192 111.6416 22.4512 68.8384-34.7392 155.264-179.8912 271.2832 43.0592 160.896 44.9536 259.8144 6.2464 310.6816C811.6992 995.3536 784.7424 1007.8464 751.6928 1007.8464zM508.7488 835.4048l14.1056 10.2656c128.6912 93.7984 195.5072 113.5104 228.8384 113.5104 23.6032 0 33.6896-9.6768 39.2448-16.9472 19.9936-26.3168 33.0496-96.9216-18.6624-283.8016l-4.352-15.6416 12.7488-10.0096c173.6448-136.1664 185.0112-201.2928 176.3072-227.968-8.4992-26.2144-54.7584-71.296-268.4928-78.7712l-16.896-0.5888-5.3504-16.0768c-70.4-212.7872-125.3632-244.5568-151.8592-244.5568-26.3936 0-81.6128 31.4368-154.9568 241.9712l-5.5808 16.0256-16.9472 0.3072c-213.7856 3.8656-260.736 48.1024-269.696 74.1376-9.1136 26.5216 1.2032 91.776 172.8 230.9376l12.5952 10.1632-4.5824 15.5648c-54.8352 186.624-42.7264 257.3568-22.912 283.8272 5.5808 7.3984 15.7696 17.3056 40.2688 17.3056l0 0c33.4592 0 100.3776-19.0464 229.0944-109.6192L508.7488 835.4048z" fill="#272636" p-id="4005"></path></svg></el-icon>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="content" label="对局信息" width="400"/> -->
      <el-table-column prop="setting" label="设置信息" width="300"/>
      <el-table-column prop="boardState" label="对局信息" width="400"/>
      <el-table-column prop="create_time" label="开始时间" width="250" />
      <el-table-column prop="resolves_time" label="结束时间" width="250"/>
      <el-table-column prop="id" label="操作列表">
        <template #default="scope">
          <el-button type="warning" circle @click="changeStar(scope.row)"><el-icon><Star /></el-icon></el-button>
          <el-button type="danger" circle @click="delHistory(scope.row.id, scope.$index)" ><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { Back } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useListStore } from '@/stores/list';
import { computed, onMounted, h } from 'vue';

const router = useRouter();

// store 获取
const store = useListStore();
const fetchList = store.fetchList;
const fetchUpdateList = store.fetchUpdateList;
const fetchDelList = store.fetchDelList;

// 回首页
const goBack = () => {
    router.back();
}

// 暂停
const pause = () => {
  ElMessageBox.confirm(
    '要返回主菜单吗',
    'info',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'info',
    }
  )
  .then( () => {
    goBack();
  })
  .catch( () => {
    return;
  })
}

// 消息提示方法 
const alertMess = (msg, val = 1) => {
    let type;
    switch (val) {
        case 1: type = 'info';break;
        case 2: type = 'warning';break;
        case 3: type = 'success';break;
        case 4: type = 'error';break;
    }
    ElMessage({
        type:type,
        message: msg,
    })
    // console.log(val);
}

// 修改收藏
const changeStar = (listRow) => {
  listRow.over = !listRow.over;
  const listDate = {
    content: listRow.content,
    over: listRow.over,
    create_time: listRow.create_time,
    resolves_time: listRow.resolves_time,
  }
  fetchUpdateList(listRow.id, listDate);
}

// 删除记录
const delHistory = async (id, index) => {
  try {
    await ElMessageBox.confirm(
    '确定要删除这条记录吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center:true,
    })
    const msg = await fetchDelList(id, index);
    alertMess(msg);
  } catch (error) {
    return;
  }
}

onMounted( async () => {
  // 异步操作,先 await
  await fetchList();
  // 获取数据, 将 content 拆解为两部分
  store.list.forEach((item) => {
    const reContent = item.content.split('-');
    // console.log(reContent);
    item.boardState = reContent[0];
    item.setting = reContent[1];
  })
})
</script>

<style scoped>
.el-page-header {
  padding-top: 10px;
  height: 40px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #000;
}
</style>