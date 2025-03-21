<template>
    <div class="innerBoardBorder outterBoardBorder" :style="{ width: size * 50 + 'px', height: size * 50 + 'px' }">
        <div v-for="(row, rowindex) in chessboard" :key="rowindex" class="row">
            <div v-for="(col, colindex) in row" :key="colindex" class="col" @click="nextPath(rowindex, colindex, col)">
                <div class="bg"><svg t="1737198421191" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3778" width="50" height="50">
                        <path
                            d="M498.744889 69.461333v378.652445h25.6V56.888889h-25.6v12.572444z m455.566222 428.145778h-385.137778v25.144889H967.111111v-25.144889h-12.8z m-455.566222 75.548445v378.595555h25.6V560.526222h-25.6v12.629334zM69.688889 497.607111H56.888889v25.144889h397.937778v-25.144889h-385.137778z"
                            fill="#bfbfbf" opacity=".87" p-id="3779"></path>
                    </svg></div>
                <div v-if="col > 0" class="piece blackPiece"></div>
                <div v-else-if="col < 0" class="piece whitePiece"></div>
                <div v-else-if="boardState.nowPlayer > 0" class="piece preBlackPiece"></div>
                <div v-else-if="boardState.nowPlayer < 0" class="piece preWhitePiece"></div>
            </div>
        </div>
    </div>
    <!-- <p>{{ setting }}</p>
    <p>{{ boardState }}</p> -->
</template>

<script setup>
import { reactive, ref, defineEmits, h, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus'

const emit = defineEmits(['overgameClick', 'getWinner']);

// 双向绑定
// 这个也要用 value
const model1 = defineModel('boardState');
const model2 = defineModel('setting');
// 提取所需数据
const boardState = model1.value;
const setting = model2.value;
const sizeref = ref(setting.size ? setting.size : 15);
const size = sizeref.value;
// 临时参数(及时重置)
const whiteRegretControlref = ref(setting.whiteRegretControl ? setting.whiteRegretControl : -1);
const blackRegretControlref = ref(setting.blackRegretControl ? setting.blackRegretControl : -1);
//绘制棋盘
const chessboard = ref(createBoard(size, 0));

// 机器人评估分值配置
const robotScore = reactive({
    // 连五：1000000分 | 活四/冲四：100000/50000 | 活三/眠三：15000/7000 | 活二/眠二：1000/500
    "5": 1000000,    // 连五
    "4_0": 100000,   // 双活四
    "4_1": 50000,    // 冲四/单活四
    "3_0": 15000,    // 双活三
    "3_1": 7000,     // 活三/眠三
    "2_0": 1000,     // 双活二
    "2_1": 500,      // 活二/眠二
    threatRatio: 0.8 // 对手威胁权重系数
});

// 落子有效性检测
function isValidMove(x, y) {
    // 检测坐标是否在棋盘内且为空位
    return x >= 0 && x < setting.size &&
        y >= 0 && y < setting.size &&
        chessboard.value[x][y] === 0;
}

// 评估五子窗口
const BORDER_BLOCK = -2; // 专用边界阻挡标识
function evaluateWindow(window, color) {
    /* 参数说明：
       window: 包含9个元素的数组[前扩展2, 核心5, 后扩展2]
       color: 当前评估方颜色 */

    let myCount = 0;  // 连续棋子数
    let empty = 0;    // 空位数量
    let blockLeft = true;  // 左侧阻挡
    let blockRight = true; // 右侧阻挡

    // 核心五连扫描
    for (let i = 0; i < 5; i++) {
        if (window[i] === color) {
            myCount++;
        } else if (window[i] === 0) {
            empty++;
        } else break;
    }

    // 边界阻挡检测器
    const checkBlock = (pos) => {
        if (pos === BORDER_BLOCK || pos === -color) return true;
        return pos !== 0;
    };

    // 左侧阻挡检测（检测前两个位置）
    for (let i = -1; i >= -2; i--) {
        if (window[i] === BORDER_BLOCK) {
            blockLeft = true;
            break;
        }
        if (checkBlock(window[i])) break;
        if (window[i] === 0) { blockLeft = false; break; }
    }

    // 右侧阻挡检测（检测后两个位置）
    for (let i = 5; i <= 6; i++) {
        if (window[i] === BORDER_BLOCK) {
            blockRight = true;
            break;
        }
        if (checkBlock(window[i])) break;
        if (window[i] === 0) { blockRight = false; break; }
    }

    const openEnds = (blockLeft ? 0 : 1) + (blockRight ? 0 : 1); // 计算开放端

    // 棋型判定
    if (myCount + empty < 4) return 0; // 无效棋型
    if (myCount === 4) return openEnds === 2 ? robotScore["4_0"] : robotScore["4_1"];
    if (myCount === 3) return openEnds === 2 ? robotScore["3_0"] : robotScore["3_1"];
    if (myCount === 2) return openEnds === 2 ? robotScore["2_0"] : robotScore["2_1"];
    return myCount === 5 ? robotScore["5"] : 0; // 连五
}

// 位置评估函数
function evaluatePosition(x, y, aiColor) {
    /* 功能：评估当前落子点的战略价值
       参数：x,y-坐标, aiColor-当前AI颜色 */

    let total = 0;
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]]; // 四个评估方向

    for (const [dx, dy] of directions) {
        const line = [];
        // 构建9格评估线
        for (let i = -4; i <= 4; i++) {
            const nx = x + i * dx, ny = y + i * dy;
            const val = isValidMove(nx, ny) ? 0 : (chessboard.value[nx]?.[ny] ?? BORDER_BLOCK);
            line.push(val);
        }

        // 滑动窗口评估
        for (let start = 0; start <= 4; start++) {
            const window = line.slice(start, start + 5);
            const extendedWindow = [...window, line[start - 1], line[start + 5]];

            // 我方得分
            const myScore = evaluateWindow(extendedWindow, aiColor);
            // 对手威胁得分
            const threatScore = evaluateWindow(extendedWindow, -aiColor) * robotScore.threatRatio;
            total += myScore + threatScore;
        }
    }
    return total;
}

// 邻居检测
function hasNeighbor(x, y) {
    // 检测3x3范围内是否有已落子，避免评估孤立点
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < setting.size &&
                ny >= 0 && ny < setting.size &&
                chessboard.value[nx][ny]) {
                return true;
            }
        }
    }
    return false;
}

// AI决策函数
function aiMove(aiColor) {
    let bestScore = -Infinity;
    let bestMoves = []; // 存储所有最优解

    // 第一遍扫描：寻找有邻居的空位
    for (let i = 0; i < setting.size; i++) {
        for (let j = 0; j < setting.size; j++) {
            if (isValidMove(i, j) && hasNeighbor(i, j)) {
                const score = evaluatePosition(i, j, aiColor);
                // 更新最优解集合
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [[i, j]];
                } else if (score === bestScore) {
                    bestMoves.push([i, j]);
                }
            }
        }
    }

    // 第二遍扫描：处理全空棋盘等特殊情况
    if (bestMoves.length === 0) {
        for (let i = 0; i < setting.size; i++) {
            for (let j = 0; j < setting.size; j++) {
                if (isValidMove(i, j)) return [i, j]; // 返回第一个可行点
            }
        }
        return null; // 棋盘已满安全处理
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)]; // 随机最优解
}

// 机器人落子逻辑
function robotPath(color) {
    // boardState.paths++;
    const move = aiMove(color);
    if (!move) {
        // 处理棋盘已满情况
        alertMess('棋盘已满, 请重新开始');
        return;
    };
    // 第一步
    if (boardState.paths === 0) {
        // 寻找中心
        const mid = Math.floor(setting.size / 2);
        // 人为浮动
        // 浮动范围
        const range = 2;
        const x = Math.floor(Math.random() * (2 * range) - range);
        const y = Math.floor(Math.random() * (2 * range) - range);
        nextPath(mid + x, mid + y, 0);
        return;
    }
    const [x, y] = move;
    nextPath(x, y, 0);
    // console.log('理论落子成功');
    // chessboard.value[x][y] = color;
    // boardState.nowPlayer = -boardState.nowPlayer; // 切换玩家
}

// 棋盘数组创建函数
function createBoard(size, initial) {
    return Array.from({ length: size }, () => new Array(size).fill(initial));
}

// 下棋变化函数
async function nextPath(row, col, order) {
    // console.log(row, col, order);
    // console.log(boardState.nowPlayer);
    if (boardState.nowPlayer === 0) {
        emit('overgameClick', '对局已结束');
        return;
    }
    if (order !== 0) return;
    // 悔棋记录
    if (boardState.nowPlayer === 1) {
        boardState.blackLast = [row, col];
    }
    else if (boardState.nowPlayer === -1) {
        boardState.whiteLast = [row, col];
    }
    // 玩家落子
    chessboard.value[row][col] = boardState.nowPlayer;
    // 记录步数
    boardState.paths++;
    // 胜利检测
    const result = await winnerJudge(row, col, boardState.nowPlayer);
    if (result === 1) {
        alertNotifi('黑棋');
        emit('getWinner', result);
        boardState.nowPlayer = 0;
    }
    else if (result === -1) {
        alertNotifi('白棋');
        emit('getWinner', result);
        boardState.nowPlayer = 0;
    }
    // 下棋方变化
    boardState.nowPlayer = -boardState.nowPlayer;
    // 机器人下棋检测
    if (boardState.nowPlayer === boardState.robot) {
        robotPath(boardState.nowPlayer);
        // console.log('检测成功');
    }
    // console.log(chessboard.value);
}

// 胜利条件检测函数
function winnerJudge(row, col, order) {
    const top = Math.min(row, 4);
    const bottom = Math.min(size - row - 1, 4);
    const left = Math.min(col, 4);
    const right = Math.min(size - col - 1, 4);
    const topLeft = Math.min(top, left);
    const topRight = Math.min(top, right);
    const bottomLeft = Math.min(bottom, left);
    const bottomRight = Math.min(bottom, right);
    let line = 0;
    // 行
    for (let i = col - left; i <= col + right; i++) {
        if (chessboard.value[row][i] === order) {
            line++;
            // console.log(line);
            if (line >= 5) {
                return order;
            }
        }
        else {
            line = 0;
        }
    }
    line = 0;
    // 列
    for (let i = row - top; i <= row + bottom; i++) {
        if (chessboard.value[i][col] === order) {
            line++;
            if (line >= 5) {
                return order;
            }
        }
        else {
            line = 0;
        }
    }
    line = 0;
    // 主对角线
    const difference = row - col;
    for (let i = row - topLeft; i <= row + bottomRight; i++) {
        if (chessboard.value[i][i - difference] === order) {
            line++;
            if (line >= 5) {
                return order;
            }
        }
        else {
            line = 0;
        }
    }
    line = 0;
    // 副对角线
    const sum = row + col;
    for (let i = row - topRight; i <= row + bottomLeft; i++) {
        if (chessboard.value[i][sum - i] === order) {
            line++;
            if (line >= 5) {
                return order;
            }
        }
        else {
            line = 0;
        }
    }
}

// 通知方法
const alertNotifi = (val) => {
    ElNotification({
        title: '游戏结束',
        message: `本局游戏 ${val} 获胜`,
        type: 'success',
        duration: 5000,
        position: 'top-left',
        offset: 50,
    })
}

// 提示消息方法
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

// 悔棋函数
function regret(row, col) {
    let player;
    if (boardState.nowPlayer < 0) {
        player = blackRegretControlref;
    }
    else {
        player = whiteRegretControlref;
    }
    // console.log(player.value);
    if (row < 0 || col < 0) {
        alertMess('悔棋现不可用', 4);
        return;
    }
    else if (+player.value === 0) {
        alertMess('没有剩余的悔棋次数了')
    }
    else if (chessboard.value[row][col] === 0) {
        alertMess('不能连悔一步以上哦');
        return;
    }
    else {
        // 状态变化
        chessboard.value[row][col] = 0;
        boardState.paths--;
        player.value--;
        // 真人对战悔棋通知
        if (!boardState.robot) {
            if (boardState.nowPlayer < 0) {
                alertMess(` 黑棋 悔棋成功,剩余悔棋次数: ${player.value < 0 ? '不限次' : player.value}`);
            }
            else {
                alertMess(` 白棋 悔棋成功,剩余悔棋次数: ${player.value < 0 ? '不限次' : player.value}`);
            }
        }
        // 机器人对战通知
        else {
            if (boardState.nowPlayer === -boardState.robot) {
                alertMess(` 玩家悔棋成功,剩余悔棋次数: ${player.value < 0 ? '不限次' : player.value}`);
            }
            // else {
            //     alertMess('ai 对你有点不屑');
            // }
        }
        boardState.nowPlayer = -boardState.nowPlayer;
    }
    // console.log(regretControlref.value);
    // console.log(row);
    // console.log(col);
}

// 重新开始函数
function newPlay() {
    // 重置棋盘
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            chessboard.value[i][j] = 0;
        }
    }
    // console.log(size);
    // 重置步数
    boardState.paths = 0;
    // 重置下棋玩家
    boardState.nowPlayer = Number(setting.firstPlayer);
    // 重置悔棋位置
    boardState.whiteLast = [-1, -1];
    boardState.blackLast = [-1, -1];
    // 重置悔棋次数
    whiteRegretControlref.value = setting.whiteRegretControl;
    blackRegretControlref.value = setting.blackRegretControl;
    // 如果 ai 先手, 落子
    if (boardState.nowPlayer == boardState.robot) {
        robotPath(boardState.nowPlayer);
    }
}

// 暴露方法
defineExpose({
    regret,
    newPlay,
    robotPath,
});

// 调用设置
onMounted(() => {
    // console.log(chessboard.value);
    newPlay();
    sizeref.value = setting.size;
    // console.log(boardState.nowPlayer);
    // console.log(boardState.robot);
    // console.log(size);
    // console.log(setting.size);
});
</script>

<style scoped>
/* body {
    display: flex;
    justify-content: center;
    align-content: center;
} */

.bg {
    position: absolute;
    z-index: 0;
}

.innerBoardBorder {
    outline: 2px solid black;
    box-shadow: 5px 5px 1px 1px rgb(177.3, 179.4, 183.6);
    margin: auto;
}

.row {
    display: flex;
    justify-content: start;
}

.row .col {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: rgb(243.9, 244.2, 244.8);
    outline: 2px solid #bfbfbf;
    cursor: pointer;

    .piece {
        position: relative;
        ;
        height: 22px;
        width: 22px;
        border-radius: 50%;
        margin: 12px;
        z-index: 99;
    }

    .blackPiece {
        background-color: #000;
        border: 3px solid #fff;
        outline: 2px solid #000;
    }

    .whitePiece {
        background-color: #fff;
        border: 3px solid #f3f5f7;
        outline: 2px solid #000;
    }

    &:hover {
        .preBlackPiece {
            background-color: #909399;
            border: 3px solid #fff;
            outline: 2px solid #909399;
            transition: 0.5s;
        }

        .preWhitePiece {
            background-color: #fff;
            border: 3px solid #fff;
            outline: 2px solid #909399;
            transition: 0.5s;
        }
    }
}
</style>