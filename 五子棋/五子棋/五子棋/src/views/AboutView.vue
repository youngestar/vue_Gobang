<template>
  <el-page-header :icon="Back" @back="pause">
      <template #content>
          <span> 关于游戏 </span>
      </template>
  </el-page-header>
  <div>
    <h2>指尖黑白间，对弈天地宽 —— 五子棋游戏介绍</h2>
    <h3>游戏起源与历史</h3>
    五子棋，亦被称为 “连五子”“五子连珠” 等，拥有着源远流长的历史。它起源于中国古代，是传统的棋类游戏之一，早在四千多年前的尧帝时期就已出现雏形。<br/>
    最初它在民间广泛流传，深受大众喜爱，后流传到日本、韩国等国家，逐渐在世界范围内传播开来。<br/>
    在漫长的历史进程中，五子棋不断发展演变，规则日益完善，成为了一项兼具趣味性与竞技性的智力游戏。
    <h3>游戏规则</h3>
    一般来讲五子棋是在一个 15×15 的棋盘(也支持自定义设置)上进行的两人对弈游戏。棋盘上纵横交错的线条形成了 225 个交叉点<br/>
    对弈双方分别执黑子和白子，由黑子先行，双方交替落子，每次只能下一子，棋子需落在棋盘的交叉点上。<br/>
    游戏的目标是率先在棋盘的横向、纵向或斜向连成五个相同颜色的棋子，谁先达成这一条件，谁就赢得胜利。若棋盘上所有交叉点都被占满且没有一方连成五子，则判定为平局。
    <h3>网页介绍</h3>
    这款五子棋网页是一个便捷且趣味十足的在线游戏平台。在玩法上，它不仅涵盖了五子棋经典的规则，让玩家能体验到传统五子棋在横、竖、斜方向上率先形成五子连珠获胜的竞技乐趣，<br/>
    还增添了丰富的特色玩法:人机对战模式中，AI 有着良好的下棋水平，保证每一局都充满新鲜感与挑战性 ，无论是新手还是高手，都能找到适合自己的对局体验。<br/>
    从界面设计来看，整体采用简约风格，界面简洁直观，操作方便快捷，玩家无需复杂的学习过程就能快速上手，将更多精力专注于棋局的思考与策略布局上。<br/>
    <br/>
    除此之外,网页还有着登录注册.设置历史记录等各种设置,玩法丰富且个性化,更多内容期待您的探索! <br/>
  </div>
  <div style="position: absolute; right: 30px; top: 80px;">
    <span style="font-weight: bold; position: relative; right: 15px; bottom: 23px;">Youngestar</span>
    <img src="../assets/avatar.jpg" alt="avatar" style="width: 60px; border-radius: 100%;">
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

const router = useRouter();
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
</script>

<style scoped>
.el-page-header {
padding-top: 10px;
height: 40px;
background-color: #f4f4f4;
border-bottom: 1px solid #000;
}
</style>