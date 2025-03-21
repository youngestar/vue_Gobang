# vue 框架搭建游戏 - 五子棋 使用说明

大一小登用于工程实践, 需要可以自取, 建议可以进行一定量的修改

1.  使用 vue3 + js , 工具: vue-router, element-plus, pinia
2. 内容: 登录/注册, 历史记录, 设置, 游戏内: 人机对战, 人人对战, 悔棋, 重开, 状态显示...
3. 代码比较屎山, 比较简单, 便于理解

## 部分截图展示

![](五子棋/图像展示/img1)

![屏幕截图 2025-03-06 212220](图像展示/屏幕截图 2025-03-06 212220.png)

![屏幕截图 2025-03-06 212229](图像展示/屏幕截图 2025-03-06 212229.png)

![屏幕截图 2025-03-06 212404](图像展示/屏幕截图 2025-03-06 212404.png)

![屏幕截图 2025-03-06 212421](图像展示/屏幕截图 2025-03-06 212421.png)

![屏幕截图 2025-03-06 212605](图像展示/屏幕截图 2025-03-06 212605.png)

![屏幕截图 2025-03-06 213936](图像展示/屏幕截图 2025-03-06 213936.png)

![屏幕截图 2025-03-06 214509](图像展示/屏幕截图 2025-03-06 214509.png)

![屏幕截图 2025-03-06 214616](图像展示/屏幕截图 2025-03-06 214616.png)

![屏幕截图 2025-03-06 214636](图像展示/屏幕截图 2025-03-06 214636.png)

![胜利页面](图像展示/胜利页面.png)

## 后端开启说明

1. 打开压缩包解压，在本文件夹中打开命令行中下载依赖(pnpm install 等均可)

	```
	npm install
	```

2. 打开命令行，检查电脑是否安装sqlite3，若没有先安装

	```
	sqlite3
	```

3. 下载安装SQLiteStudio或HeidiSQL，导入db目录下的database.db文件，并连接数据库(使用sqlite3)

4. 命令行启动服务(node .\app.js等均可)

	```
	nodemon app.js
	```

5. 打开 最内层的五子棋文件夹 下载依赖

	```
	npm/pnpm install
	```

	6.在终端使用 npm/pnpm run dev 启动项目

**如有问题/需要邀请进入apifox请联系qq:1829305199**

​	**GitHub地址：https://github.com/weierliteln/ToDoList-BE.git**

**Base URLs:http://127.0.0.1:3000**



**前端部分完成:一名正在学习的小白,qq:3958641368(这是小号哦)**

**有大佬看到了速速来带飞我谢谢(比心)**

## 前后端交互参数

## POST 注册

POST /user/register

> Body 请求参数

```yaml
username: ""
password: ""

```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 说明 |
| ---------- | ---- | ------ | ---- | ---- |
| body       | body | object | 否   | none |
| » username | body | string | 是   | none |
| » password | body | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 1,
  "msg": "注册成功"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

## POST 登录

POST /user/login

> Body 请求参数

```yaml
username: ""
password: ""

```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 说明 |
| ---------- | ---- | ------ | ---- | ---- |
| body       | body | object | 否   | none |
| » username | body | string | 是   | none |
| » password | body | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 1,
  "msg": "登录成功",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3Mjg3NDIxNDMsImV4cCI6MTcyODc3ODE0M30.iYMRLk8gXBJrHpJ4GCY5ei4eysiHW4ZfbwkJKGx7iyA"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

## GET 获取列表

GET /todo/get/list

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| content       | query  | string | 否   | none |
| over          | query  | string | 否   | none |
| page          | query  | number | 否   | none |
| size          | query  | number | 否   | none |
| Authorization | header | string | 是   | none |

> 返回示例

```json
{
  "code": 1,
  "data": [
    {
      "id": 10,
      "content": "333",
      "over": false,
      "create_time": "2024-04-04 18:20:25",
      "resolves_time": "2024-04-04 18:20:28"
    },
    {
      "id": 11,
      "content": "ew",
      "over": false,
      "create_time": "2024-04-04 18:20:21",
      "resolves_time": "2024-04-04 18:20:20"
    }
  ],
  "page": 1,
  "size": 10,
  "total": 2
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

## POST 添加一条todoliist

POST /todo/add/list

> Body 请求参数

```yaml
content: ""
over: ""
create_time: 2024-04-04 18:20:21
resolves_time: 2024-04-04 18:20:21

```

### 请求参数

| 名称            | 位置   | 类型    | 必选 | 说明 |
| --------------- | ------ | ------- | ---- | ---- |
| Authorization   | header | string  | 是   | none |
| body            | body   | object  | 否   | none |
| » content       | body   | string  | 是   | none |
| » over          | body   | boolean | 是   | none |
| » create_time   | body   | string  | 是   | none |
| » resolves_time | body   | string  | 是   | none |

> 返回示例

```json
{
  "code": 1,
  "message": "成功插入记录"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

## DELETE 删除一条todolist

DELETE /todo/delete/list/{id}

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| id            | path   | number | 是   | none |
| Authorization | header | string | 是   | none |

> 返回示例

```json
{
  "code": 1,
  "message": "成功删除记录"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

## PUT 修改一条todolist

PUT /todo/update/list/{id}

> Body 请求参数

```yaml
content: ""
over: ""
create_time: ""
resolves_time: ""

```

### 请求参数

| 名称            | 位置   | 类型    | 必选 | 说明 |
| --------------- | ------ | ------- | ---- | ---- |
| id              | path   | number  | 是   | none |
| Authorization   | header | string  | 是   | none |
| body            | body   | object  | 否   | none |
| » content       | body   | string  | 是   | none |
| » over          | body   | boolean | 是   | none |
| » create_time   | body   | string  | 是   | none |
| » resolves_time | body   | string  | 是   | none |

> 返回示例

```json
{
  "code": 1,
  "message": "成功更新记录"
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |









