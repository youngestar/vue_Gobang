const express = require('express')
const db = require('../db/todolist');

const router = express.Router()


// 查询todolist
router.get('/get/list', (req, res) => {
  const { over } = req.query;

  let total = null;

  let sql = 'SELECT * FROM list ORDER BY create_time DESC';
  let countSql = 'SELECT COUNT(*) as total FROM list';

  if (over === 'true') {
    sql = 'SELECT * FROM list WHERE over = 1 ORDER BY create_time DESC';
    countSql = 'SELECT COUNT(*) as total FROM list WHERE over = 1';
  }

  if (over === 'false') {
    sql = 'SELECT * FROM list WHERE over = 0 ORDER BY create_time DESC';
    countSql = 'SELECT COUNT(*) as total FROM list WHERE over = 0';
  }

  if (over === '' && req.query.content) {
    sql = `SELECT * FROM list WHERE content LIKE '%${req.query.content}%' ORDER BY create_time DESC`;
    countSql = `SELECT COUNT(*) as total FROM list WHERE content LIKE ?`;
  }

  // 根据over和content查询
  if (over && req.query.content) {
    sql = `SELECT * FROM list WHERE over = ? AND content LIKE '%${req.query.content}%' ORDER BY create_time DESC`;
    countSql = `SELECT COUNT(*) as total FROM list WHERE over = ? AND content LIKE ?`;
  }



  db.get(countSql, (err, row) => {
    if (err) {
      return res.status(500).json({
        code: 0,
        error: err.message
      });
    }
    total = row.total;
  }
  );


  // 分页
  let { page, size } = req.query;
  if (page && size) {
    page = parseInt(page);
    size = parseInt(size);
    sql += ` LIMIT ${(page - 1) * size}, ${size}`;
  }



  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        code: 0,
        error: err.message
      });
    }

    rows.forEach((item) => {
      item.over = item.over === 1 ? true : false;
    });

    res.json({
      code: 1,
      data: rows,
      page: page ? parseInt(page) : null,
      size: size ? parseInt(size) : null,
      total: total
    });
  });
})

// 添加一条todolist
router.post('/add/list', (req, res) => {
  const { content, over, create_time, resolves_time } = req.body;

  if (!content || !create_time || !resolves_time) {
    if (over === undefined) {
      return res.status(400).json({
        code: 0,
        error: '请填写完整的列表。'
      });
    }
  }

  let overBool;
  if (over === true) {
    overBool = 1;
  } else if (over === false) {
    overBool = 0;
  } else {
    return res.status(400).json({
      code: 0,
      error: '无效的值，请使用 true 或 false。'
    });
  }

  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(create_time) || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(resolves_time)) {
    return res.status(400).json({
      code: 0,
      error: '时间格式不正确，请使用 YYYY-MM-DD HH:mm:ss 格式。'
    });
  }

  // 插入数据到数据库
  db.run('INSERT INTO list (content, over, create_time, resolves_time) VALUES (?, ?, ?, ?)',
    content, overBool, create_time, resolves_time,
    function (err) {
      if (err) {
        return res.status(500).json({
          code: 0,
          error: err.message
        });
      }
      res.status(201).json({
        code: 1,
        message: '成功插入记录',
      });
    }
  );
})

// 删除一条todolist
router.delete('/delete/list/:id', (req, res) => {
  db.run('DELETE FROM list WHERE id = ?', req.params.id, function (err) {
    if (err) {
      return res.status(500).json({
        code: 0,
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        code: 0,
        error: '未找到记录'
      });
    }

    res.json({
      code: 1,
      message: '成功删除记录'
    });
  });
})

// 修改一条todolist
router.put('/update/list/:id', (req, res) => {
  const { content, over, create_time, resolves_time } = req.body;

  if (!content || !create_time || !resolves_time) {
    if (over === undefined) {
      return res.status(400).json({
        code: 0,
        error: '请填写完整的列表。'
      });
    }
  }

  let overBool;
  if (over === true) {
    overBool = 1;
  } else if (over === false) {
    overBool = 0;
  } else {
    return res.status(400).json({
      code: 0,
      error: '无效的值，请使用 true 或 false。'
    });
  }

  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(create_time) || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(resolves_time)) {
    return res.status(400).json({
      code: 0,
      error: '时间格式不正确，请使用 YYYY-MM-DD HH:mm:ss 格式。'
    });
  }

  // 更新一条todolist
  db.run(
    'UPDATE list SET content = ?, over = ?, create_time = ?, resolves_time = ? WHERE id = ?',
    content, overBool, create_time, resolves_time, req.params.id,
    function (err) {
      if (err) {
        return res.status(500).json({
          code: 0,
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          code: 0,
          error: '未找到记录'
        });
      }

      res.json({
        code: 1,
        message: '成功更新记录'
      });
    }
  );
})

module.exports = router