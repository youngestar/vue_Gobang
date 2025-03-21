import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useListStore } from '@/stores/list';
import axios from 'axios';

export const usePlayerStore = defineStore('player', () => {
  // 玩家信息管理
  const blackPlayer = reactive({
    playerName:'',
    playerPassword:'',
  })

  const whitePlayer = reactive({
    playerName:'',
    playerPassword:'',
  })

  const listStore = useListStore();
  const getToken = listStore.getToken;

  const signUp = async (playerName, playerPassword) => {
    try {
      const userData = {
        username: playerName,
        password: playerPassword,
      };
      const response = await axios.post('http://127.0.0.1:3000/user/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data.msg;
    } catch (error) {
      console.error(error);
    }
  }

  const signIn = async (color, playerName, playerPassword) => {
    try {
      const userData = {
        username: playerName,
        password: playerPassword,
      };
      const response = await axios.post('http://127.0.0.1:3000/user/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if(color === 1) {
        blackPlayer.playerName = playerName;
        blackPlayer.playerPassword = playerPassword;
      }
      else if(color === -1) {
        whitePlayer.playerName = playerName;
        whitePlayer.playerPassword = playerPassword;
      }
      sessionStorage.setItem('token', response.data.token);
      getToken();
      return response.data.msg;
    } catch(error) {
      console.error(error);
    }
  }

  const robotIn = (color) => {
    const randomNum = Math.random();
    const player = color > 0 ? blackPlayer : whitePlayer;
    if(color === 1) {
      if (whitePlayer.playerName !== '' && whitePlayer.playerPassword === '') {
        return '请不要尝试填充两个robot!';
      }
    }
    else if(color === -1) {
      if (blackPlayer.playerName !== '' && blackPlayer.playerPassword === '') {
        return '请不要尝试填充两个robot!';
      }
    }
    else {
      console.error('机器人添加错误');
    }
    // 随机 robot 名字, 清空密码方便辨识
    if(randomNum < 0.15) player.playerName = '大聪明(bot)';
    else if(randomNum < 0.3) player.playerName = 'shallowseek(bot)';
    else if(randomNum < 0.45) player.playerName = '阿尔法猫(bot)';
    else if(randomNum < 0.6) player.playerName = '菜包(bot)';
    else if(randomNum < 0.75) player.playerName = 'chatRPG(bot)';
    else if(randomNum < 0.9) player.playerName = '有点像人机(bot)';
    else if(randomNum < 0.94) player.playerName = '有一点强(bot!)';
    else if(randomNum < 0.96) player.playerName = '又赢一把(bot!!)';
    else if(randomNum < 0.99) player.playerName = '黑暗无双暴龙战士(bot!!!)';
    else player.playerName = 'youngestar(金色传说!!!!)';
    player.playerPassword = '';
    return '机器人添加成功';
  }

  const clearAll = (color) => {
    if(color === 1) {
      blackPlayer.playerName = '';
      blackPlayer.playerPassword = '';
    }
    else if(color === -1) {
      whitePlayer.playerName = '';
      whitePlayer.playerPassword = '';
    }
    else {
      console.error('尝试清空错误');
    }
    return '清空数据成功';
  }
  return { blackPlayer, whitePlayer, signUp, signIn, robotIn, clearAll };
})