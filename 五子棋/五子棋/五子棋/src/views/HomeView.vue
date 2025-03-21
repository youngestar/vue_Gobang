<template>
    <div id="home">
        <el-header>
            <div id="signInDrawer">
                <p>黑棋: <span v-if="store.blackPlayer.playerName === ''">未登录</span><span v-else><span
                            style="margin: 0 5px;font-weight: bold;">{{ store.blackPlayer.playerName }}</span>
                        准备就绪</span></p>
                <p>白棋: <span v-if="store.whitePlayer.playerName === ''">未登录</span><span v-else><span
                            style="margin: 0 5px;font-weight: bold;">{{ store.whitePlayer.playerName }}</span>
                        准备就绪</span></p>
                <p><el-button @click="drawer = true" type="primary" plain size='small'>
                        打开登录界面
                    </el-button></p>
            </div>
            <div id="title">
                <img src="../assets/title1.png" alt="title">
            </div>
        </el-header>
        <el-main>
            <p @click="turnToPlay"><el-button type="success" plain text>
                    <el-icon :size="25">
                        <Pointer />
                    </el-icon>
                    开始游戏
                </el-button></p>
            <p @click="turnToHistory"><el-button type="info" plain text>
                    <el-icon :size="25">
                        <Notification />
                    </el-icon>
                    查看战绩
                </el-button></p>
            <p @click="turnToSetting"><el-button type="info" plain text>
                    <el-icon :size="25">
                        <Setting />
                    </el-icon>
                    设置
                </el-button></p>
            <p @click="turnToAbout"><el-button plain text>
                    <el-icon :size="25">
                        <ChatDotSquare />
                    </el-icon>
                    关于
                </el-button></p>
            <el-drawer v-model="drawer" direction="ltr">
                <template #header>
                    <h4>在开始游戏前,请登录!</h4>
                </template>
                <template #default>
                    <div>
                        <el-radio v-model="nowplayer" :value='1' size="large">
                            黑棋登录
                        </el-radio>
                        <el-radio v-model="nowplayer" :value='2' size="large">
                            白棋登录
                        </el-radio>
                    </div>
                    <div>
                        <el-form v-if="nowplayer === 1">
                            <el-form-item label="用户名">
                                <el-input v-model="player1.playerName" placeholder="请输入用户名" maxlength="10">
                                    <template #suffix>
                                        <el-icon>
                                            <user />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="player1.playerPassword" placeholder="请输入密码" type="password"
                                    show-password maxlength="12"></el-input>
                            </el-form-item>
                            <el-form-item class="button">
                                <el-button @click="playerSignUp(player1.playerName, player1.playerPassword)">
                                    注册
                                </el-button>
                                <el-button @click="playerSignIn(1, player1.playerName, player1.playerPassword)">
                                    登录
                                </el-button>
                                <el-button type="primary" @click="robotIn(1)">
                                    填充人机
                                </el-button>
                                <el-button type="danger" @click="() => { alertMess(store.clearAll(1), 3) }">
                                    清空
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-form v-else-if="nowplayer === 2">
                            <el-form-item label="用户名">
                                <el-input v-model="player2.playerName" placeholder="请输入用户名" maxlength="10">
                                    <template #suffix>
                                        <el-icon>
                                            <user />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="player2.playerPassword" placeholder="请输入密码" type="password"
                                    show-password maxlength="12"></el-input>
                            </el-form-item>
                            <el-form-item class="button">
                                <el-button @click="playerSignUp(player2.playerName, player2.playerPassword)">
                                    注册
                                </el-button>
                                <el-button @click="playerSignIn(-1, player2.playerName, player2.playerPassword)">
                                    登录
                                </el-button>
                                <el-button type="primary" @click="robotIn(-1)">
                                    填充人机
                                </el-button>
                                <el-button type="danger" @click="() => { alertMess(store.clearAll(-1), 3) }">
                                    清空
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template #footer>
                    <div>
                        <p>登录情况:</p>
                        <p>黑棋: <span v-if="store.blackPlayer.playerName === ''">未登录</span><span v-else><span
                                    style="font-weight: bold; margin-left: 5px;">{{ store.blackPlayer.playerName
                                    }}</span> 准备就绪</span></p>
                        <p>白棋: <span v-if="store.whitePlayer.playerName === ''">未登录</span><span v-else><span
                                    style="font-weight: bold; margin-left: 5px;">{{ store.whitePlayer.playerName
                                    }}</span> 准备就绪</span></p>
                    </div>
                </template>
            </el-drawer>
        </el-main>
    </div>
</template>

<script setup>
import { reactive, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/player';
import { ElMessage } from 'element-plus';

// store
const store = usePlayerStore();
const signUp = store.signUp;
const signIn = store.signIn;

// 临时参数
const drawer = ref(false);
const nowplayer = ref(1);
const player1 = reactive({
    playerName: '',
    playerPassword: '',
});
const player2 = reactive({
    playerName: '',
    playerPassword: '',
});

// 路由
const router = useRouter();
// 登录检测函数
const signInJudge = (route) => {
    if (store.blackPlayer.playerName === '' || store.whitePlayer.playerName === '') {
        drawer.value = true;
        alertMess('请先完成登录', 1);
    }
    else {
        router.push({
            name: route,
        })
    }
}

// robot 检测函数
const robotIn = (color) => {
    const msg = store.robotIn(color);
    if (msg === '机器人添加成功') alertMess(msg, 3);
    else alertMess(msg, 4);
}

// 路由:开始游戏
const turnToPlay = () => {
    signInJudge('play');
}

// 路由:设置
const turnToSetting = () => {
    signInJudge('setting');
}

// 路由:历史记录
const turnToHistory = () => {
    signInJudge('history');
}

// 路由:关于
const turnToAbout = () => {
    router.push({
        name: 'about',
    })
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
// 检测函数
const playerJudge = (playerName, playerPassword) => {
    if (!playerName || !playerPassword) {
        alertMess('用户名和密码不能为空', 4);
        return 1;
    }
    else if (playerPassword.length < 6) {
        alertMess('密码不能少于 6 位', 4);
        return 1;
    }
    else if (store.blackPlayer.playerName === playerName || store.whitePlayer.playerName === playerName) {
        alertMess('用户已登录', 4);
        return 1;
    }
}

// 注册函数
const playerSignUp = async (playerName, playerPassword) => {
    if (playerJudge(playerName, playerPassword) === 1) return;
    const msg = await signUp(playerName, playerPassword);
    if (!msg) alertMess('尝试连接后端失败,请检查后端配置', 4);
    else if (msg === '注册成功') alertMess(msg, 3);
    else alertMess(msg, 4);
}

// 登录函数
const playerSignIn = async (color, playerName, playerPassword) => {
    if (playerJudge(playerName, playerPassword) === 1) return;
    const msg = await signIn(color, playerName, playerPassword);
    if (!msg) alertMess('用户不存在或者您的密码错误', 4);
    else if (msg === '登录成功') alertMess(msg, 3);
    else alertMess(msg, 4);
}

</script>

<style scoped>
#home {
    width: 100vw;
    height: 100vh;
    background-image: url(../assets/bg2.gif);
    background-size: cover;
}

#title {
    position: relative;
    right: 175px;
    width: 400px;
    height: 200px;
    margin: auto;
}

#signInDrawer {
    position: relative;
    right: 20px;
    width: 300px;
    border: 2px solid black;
    border-radius: 10px;
    background-color: #fff;
    /* background-image: url(../assets/bg.gif); */
    color: #000;

    p {
        width: 100%;
        margin: 10px auto;
        font-size: 15px;
        display: flex;
        justify-content: center;
    }
}

.el-main {
    margin-top: 320px;

    p {
        display: flex;
        justify-content: center;

        .el-button {
            width: 15vw;
            font-size: 1.5vw;
            padding: 2vw;
            margin-top: 1vw;

            .el-icon {
                display: none;
                margin-right: 0.5vw;
            }

            &:hover {
                .el-icon {
                    display: block;
                    transition: 0.5s;
                }
            }
        }
    }

    .button {
        margin-left: 10%;

        .el-button {
            margin: 0 15px;
        }
    }

    /* .el-form {
        el-form-item {
            margin: 20px auto;
        }  
    } */
}
</style>

<!-- <style>
body {
    background-image: url(../assets/bg.gif);
    background-repeat: no-repeat;
}
</style> -->
