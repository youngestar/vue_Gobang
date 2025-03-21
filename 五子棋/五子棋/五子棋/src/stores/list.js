import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useListStore = defineStore('list', () => {
    const token = ref('无效 token ');
    const list = ref([{
      id: 10,
      content: "例子",
      over: false,
      create_time: "2025-01-01 12:12:12",
      resolves_time: "2024-01-01 12:12:12"
    },]);

    // 获取 token 
    const getToken = () => {
      token.value = sessionStorage.getItem('token');
    }

    // 加载列表
    // 使用外部 token, 无需传入参数
    const fetchList = async () => {
      const headers = new Headers();
      if (token.value) {
        headers.append('Authorization', token.value);
      }
      try {
        const response = await fetch('http://127.0.0.1:3000/todo/get/list',{
          method:'GET',
          headers:headers,
        });
        let result = await response.json();
        if(!response.ok) {
          console.log(result.error);
          throw new Error(`${response.status}`);
        }
        list.value = result.data;
      } catch(error) {
        console.log(error);
      }
    }

    // 修改列表
    const fetchUpdateList = async (id, payload) => {
      const headers = new Headers();
      if (token.value) {
          headers.append('Authorization', token.value);
          headers.append('Content-Type', 'application/json');
      }
      try {
          const response = await fetch(`http://127.0.0.1:3000/todo/update/list/${id}`,{
            method:'PUT',
            headers:headers,
            body:JSON.stringify(payload),
          });
          let result = await response.json();
          if(!response.ok) {
            console.log(result.error);
            throw new Error(`${response.status}`);
          }
          // 返回数据
        } catch(error) {
          console.log(error);
        }
    }

    // 删除列表
    const fetchDelList = async (id, index) => {
      const headers = new Headers();
      if (token.value) {
          headers.append('Authorization', token.value);
      }
      try {
          const response = await fetch(`http://127.0.0.1:3000/todo/delete/list/${id}`, {
            method: 'DELETE',
            headers:headers,
          });     
          const result = await response.json();
          if (!response.ok) {
            console.log(result.error);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          list.value.splice(index, 1);
          return result.message;
         } catch(error) {
            alert(error);
      }
    }

    // 添加列表
    const fetchAddList = async (payload) => {
      const headers = new Headers();
      if (token.value) {
          headers.append('Authorization', token.value);
          headers.append('Content-Type','application/json');
      }
      try {
          const response = await fetch('http://127.0.0.1:3000/todo/add/list',{
            method:'POST',
            headers:headers,
            body:JSON.stringify(payload),
          });
          const result = await response.json();
          if(!response.ok) {
            console.log(result.error);
            throw new Error(`${response.status}`);
          }
          return result.message;
        } catch(error) {
          console.log(error);
        }
    }

    getToken();
    fetchList();
    return { list, token, getToken, fetchList, fetchUpdateList, fetchDelList, fetchAddList};
  })