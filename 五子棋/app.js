const express = require('express')
const bodyParser = require('body-parser')
const join = require('joi')

const app = express()

// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

const cors = require('cors')
app.use(cors())

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   res.header('Access-Control-Allow-Methods', "DELETE,PUT,POST,GET,OPTIONS")
//   if (req.method.toLowerCase() === 'options') {
//     res.send(200)
//   }
//   next()
// })

// 解析token的中间件
const config = require('./config')
const { expressjwt } = require('express-jwt')
app.use(expressjwt({
  secret: config.jwtSecretKey, algorithms: ["HS256"]
}).unless({ path: [/^\/user/] }))


// 路由
app.use('/user', require('./router/user'))

app.use('/todo', require('./router/todolist'))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use((err, req, res, next) => {
  if (err instanceof join.ValidationError) {
    return res.status(400).json({
      code: 0,
      error: err.message
    })
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      code: 0,
      error: '身份认证失败'
    })
  }
  res.status(500).json({
    code: 0,
    error: err.message
  })
})

const port = 3000
app.listen(port, () => {
  console.log(`启动${port}端口成功`)
}).on('error', (err) => {
  console.log('启动失败', err)
})