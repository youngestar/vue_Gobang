const express = require('express')
const db = require('../db/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')


const router = express.Router()

const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

// 注册
router.post('/register', expressJoi(reg_login_schema), (req, res) => {
  // console.log(req.body);
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      code: 0,
      msg: '用户名和密码不能为空'
    });
  }

  password = bcrypt.hashSync(password, 10);

  db.get('SELECT * FROM users WHERE username = ?', username, (err, row) => {
    if (err) {
      return res.status(500).json({
        code: 0,
        msg: '服务器错误'
      });
    }
    if (row) {
      return res.status(400).json({
        code: 0,
        msg: '用户已存在'
      });
    }
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
        return res.status(500).json({
          code: 0,
          msg: '服务器错误'
        });
      }
      res.json({
        code: 1,
        msg: '注册成功'
      });
    });
  });
});

// 登录
router.post('/login', expressJoi(reg_login_schema), (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      code: 0,
      msg: '用户名和密码不能为空'
    });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({
        code: 0,
        msg: '服务器错误'
      });
    }
    if (!row) {
      return res.status(400).json({
        code: 0,
        msg: '用户名不存在'
      });
    }

    bcrypt.compare(password, row.password, (err, compare) => {
      if (err) {
        return res.status(500).json({
          code: 0,
          msg: '服务器错误'
        });
      }
      if (!compare) {
        return res.status(400).json({
          code: 0,
          msg: '密码错误'
        });
      }

      const token = jwt.sign({
        id: row.id,
        username: row.username
      }, config.jwtSecretKey, {
        expiresIn: config.expiresIn
      });

      res.json({
        code: 1,
        msg: '登录成功',
        token: 'Bearer ' + token
      });
    });
  });
});

module.exports = router
