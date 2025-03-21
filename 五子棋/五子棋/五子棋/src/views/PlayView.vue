<template>
  <div>
    <el-container>
      <el-header>
        <el-page-header :icon="Back" @back="pause">
          <template #content>
            <span> 五子棋 </span>
          </template>
        </el-page-header>
      </el-header>
      <el-container>
        <el-main>
          <Chessboard @overgame-click="alertMess" @get-winner="changeWinner" v-model:boardState="boardState"
            v-model:setting="setting" ref="childRef"></Chessboard>
        </el-main>
        <el-aside width="400px">
          <div id="about">
            <h1>对局状态</h1>
            <h2>当前回合数: <span style="margin-left: 10px;">{{ boardState.paths }}</span></h2>
            <h2>游戏开始时间:<br />{{ beginTime }}</h2>
            <h2>棋手:</h2>
            <p>黑方: <span v-if="blackPlayer.playerName === ''">未登录,请返回登录</span> <span v-else>{{ blackPlayer.playerName
            }}</span></p>
            <p>白方: <span v-if="blackPlayer.playerName === ''">未登录,请返回登录</span> <span v-else>{{ whitePlayer.playerName
            }}</span></p>
            <h2>
              <div v-show="boardState.nowPlayer === 1">执子方: <span style="margin-left: 10px;">黑方</span></div>
              <div v-show="boardState.nowPlayer === -1">执子方: <span style="margin-left: 10px;">白方</span></div>
              <div v-show="boardState.nowPlayer === 0">本局已结束</div>
            </h2>
          </div>
          <div id="bottom">
            <div id="option">
              <h1>功能按钮</h1>
              <p><el-button plain @click="pause">暂停游戏</el-button></p>
              <p><el-button type="info" plain @click="callChildRefRegret"
                  :disabled="boardState.paths <= 2">悔棋</el-button></p>
              <p><el-button type="danger" plain @click="callChildRefNewPlay">重新开始</el-button></p>
              <p><el-button type="success" plain :disabled="boardState.nowPlayer === 0 ? false : true"
                  @click="fetchnoteResult">记录游戏结果</el-button></p>
            </div>
            <div id="afterRace">
              <h1>胜利结算</h1>
              <div v-if="boardState.nowPlayer !== 0" v-loading="true">
                <h2>游戏还在进行中...</h2>
                <img src="@/assets/ppcats.gif" alt="吃pp的猫猫.gif">
              </div>
              <div v-if="boardState.nowPlayer === 0">
                <h3>胜者:
                  <span v-if="winner === 1" style="margin-left: 10px;">黑方 {{ blackPlayer.playerName }}</span>
                  <span v-if="winner === -1" style="margin-left: 10px;">白方 {{ whitePlayer.playerName }}</span>
                </h3>
                <h3>本局总回合数: <span style="margin-left: 10px;">{{ boardState.paths }}</span></h3>
                <h3>游戏开始时间:</h3>
                <p>{{ beginTime }}</p>
                <h3>游戏结束时间:</h3>
                <p>{{ endTime }}</p>
              </div>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { Back } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'
import Chessboard from '@/components/Chessboard.vue'
import { h, reactive, ref, computed, watch, onMounted } from 'vue';
import { useSettingStore } from '@/stores/setting'
import { usePlayerStore } from '@/stores/player'
import { useListStore } from '@/stores/list'

// 引入 store
const settingStore = useSettingStore();
const playerStore = usePlayerStore();
const listStore = useListStore();
// 设置 及 用户 管理
// 从 store 获取数据(记得使用 computed )
const setting = computed(() => {
  return settingStore.setting;
})

const whitePlayer = playerStore.whitePlayer;
const blackPlayer = playerStore.blackPlayer;

const fetchAddList = listStore.fetchAddList;
// 记得对 ref 对象使用 vaule
// 本局状态管理
const boardState = reactive({
  // 步数
  paths: 0,
  // 0 : 未开始, 1 : 黑棋, -1 : 白棋
  nowPlayer: 1,
  // 悔棋
  whiteLast: [-1, -1],
  blackLast: [-1, -1],
  robot: null,
});

// 临时参数
const winner = ref(0);
const noteState = ref(0);
const beginTime = ref(getTime());
const endTime = ref(getTime());

// 路由管理
const router = useRouter();

// 子组件方法
const childRef = ref(null);

// 路由:返回主菜单
const goBack = () => {
  router.back();
}

// 消息提示方法 
const alertMess = (msg, val = 1) => {
  let type;
  switch (val) {
    case 1: type = 'info'; break;
    case 2: type = 'warning'; break;
    case 3: type = 'success'; break;
    case 4: type = 'error'; break;
  }
  ElMessage({
    type: type,
    message: msg,
  })
  // console.log(val);
}

// 机器人检测
const isRobot = () => {
  if (playerStore.blackPlayer.playerPassword === '') boardState.robot = 1;
  else if (playerStore.whitePlayer.playerPassword === '') boardState.robot = -1;
  else boardState.robot = null;
}

// 暂停
const pause = () => {
  ElMessageBox.confirm(
    '游戏已暂停,您现在想要...',
    'info',
    {
      cancelButtonText: '返回游戏',
      confirmButtonText: '返回主菜单',
      type: 'info',
    }
  )
    .then(() => {
      goBack();
    })
    .catch(() => {
      return;
    })
}

// 悔棋
const callChildRefRegret = () => {
  if (boardState.nowPlayer === 0) {
    alertMess('游戏已结束');
    return;
  }
  else {
    ElMessageBox.confirm(
      '确定要悔棋吗?',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    )
      .then(async () => {
        if (childRef.value) {
          // 真人对战悔棋
          if (!boardState.robot) {
            if (boardState.nowPlayer === -1) {
              childRef.value.regret(boardState.blackLast[0], boardState.blackLast[1]);
            }
            else if (boardState.nowPlayer === 1) {
              childRef.value.regret(boardState.whiteLast[0], boardState.whiteLast[1]);
            }
          }
          // 机器人对战悔棋
          else {
            childRef.value.regret(boardState.blackLast[0], boardState.blackLast[1]);
            childRef.value.regret(boardState.whiteLast[0], boardState.whiteLast[1]);
          }
        }
      }
      )
      .catch(() => {
        return;
      })
  }
}

// 重新开始
const callChildRefNewPlay = () => {
  ElMessageBox.confirm(
    '确定要重新开始吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
      center: true,
    }
  )
    .then(() => {
      noteState.value = 0;
      beginTime.value = getTime();
      childRef.value.newPlay();
    }
    )
    .catch(() => {
      return;
    })
}

// 时间获取及格式化
function getTime() {
  const now = new Date();
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, '0');;
  let day = now.getDate().toString().padStart(2, '0');;
  let hour = now.getHours().toString().padStart(2, '0');;
  let minute = now.getMinutes().toString().padStart(2, '0');;
  let second = now.getSeconds().toString().padStart(2, '0');;
  let time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return time;
}

// 确认获胜及改变胜者
const changeWinner = (val) => {
  winner.value = val;
  endTime.value = getTime();
}

// 打包整理比赛数据
const noteResult = () => {
  const over = false;
  const create_time = beginTime.value;
  const resolves_time = endTime.value;
  const content =
    // 对局详情
    '黑方玩家:' + blackPlayer.playerName + ' ' + '白方玩家:' + whitePlayer.playerName
    + ' ' + '总回合数:' + boardState.paths
    + ' ' + '胜者:' + `${winner.value > 0 ? '黑棋' : '白棋'}`
    + '-'
    // 设置详情
    + ' ' + '先手:' + `${setting.value.firstPlayer > 0 ? '黑棋' : '白棋'}`
    + ' ' + '棋盘规格:' + `${setting.value.size}格`
    + ' ' + '悔棋限制:' + `${setting.value.blackRegretControl > 0 ? setting.value.blackRegretControl + '次' : '无限制'}`;
  const result = {
    content,
    over,
    create_time,
    resolves_time,
  }
  return result;
}

// 记录结果
const fetchnoteResult = () => {
  if (noteState.value === 1) {
    alertMess('已经记录过本次结果哦');
    return;
  }
  const result = noteResult();
  noteState.value = 1;
  fetchAddList(result);
  alertMess('记录结果成功');
}

// 调用设置函数, 检测机器人
onMounted(async () => {
  if (listStore.list.at(-1).content === '例子') {
    await settingStore.loadSetting();
  }
  boardState.nowPlayer = setting.value.firstPlayer ? Number(setting.value.firstPlayer) : 1;
  isRobot();
  if (boardState.nowPlayer == boardState.robot) {
    childRef.value.robotPath(boardState.nowPlayer);
  }
  // console.log(setting);
});
</script>

<style scoped>
.el-page-header {
  padding-top: 10px;
  height: 40px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #000;
}

.el-main {
  display: flex;
  justify-content: center;
  margin-top: -10px;
}

.el-aside {
  margin-right: 20px;
  margin-top: 20px;

  #about {
    width: 89%;
    padding: 2% 5%;
    /* border: 2px solid black;
    border-radius: 10px 10px 0 0; */
    /* background-color: rgb(253, 225.6, 225.6); */
  }

  #bottom {
    display: flex;

    /* margin-top: 50px; */
    #option {
      width: 39%;
      padding: 2% 5%;

      /* border: 2px solid black;
      border-right: none;
      border-top: none;
      border-radius: 0 0 0px 10px; */
      /* background-color: blue; */
      .el-button {
        width: 100px;
      }
    }

    #afterRace {
      width: 39%;
      padding: 2% 5%;
      /* border: 2px solid black;
      border-top: none;
      border-radius: 0 0 10px 0;
      background-color: #fff; */
      width: 50%;
    }
  }
}
</style>
