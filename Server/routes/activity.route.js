const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");

router.post(
  "/create_activity",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_id, post_id, like, watch } = req.body;

    let data = { user_id, post_id, like, watch };

    let sql = `INSERT INTO activity SET ?`;

    connectDB.query(sql, data, (err, result) => {
      if (err) {
        res.status(500).send("Errors server");
        throw err;
      } else {
        let sql = `UPDATE post SET count_like = count_like + ${like}, count_watch = count_watch + ${watch} WHERE id = ${post_id}`;

        connectDB.query(sql, data, (err, result) => {
          if (err) {
            res.status(500).send("Errors server");
            throw err;
          } else {
            res.send("norm");
          }
        });
      }
    });
  }
);

router.put("/update_activity", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { user_id, post_id, like, watch } = req.body;

  let data = { user_id, post_id, like, watch };

  let sql =
    "UPDATE activity SET `like` = " +
    like +
    ", `watch` = " +
    watch +
    " WHERE post_id = " +
    post_id;

  connectDB.query(sql, (err) => {
    if (err) {
      res.status(500).send("Ошибка сервера");
      throw err;
    } else {
      let sql = `UPDATE post SET count_like = count_like + ${like}, count_watch = count_watch + ${watch} WHERE id = ${post_id}`;

      connectDB.query(sql, data, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else {
          res.send("norm");
        }
      });
    }
  });
});

router.post("/create_message", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { post_id, user_id, message, date_publication } = req.body;

  let data = {  post_id, user_id, message, date_publication };

  let sql = `INSERT comments(post_id, user_id, message, date_publication) VALUES ('${post_id}', '${user_id}', '${message}',  '${date_publication}')`;

  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Errors server");
      throw err;
    } else 
    {
        let sql = `UPDATE post SET count_comments = count_comments + 1 WHERE id = ${post_id}`;

      connectDB.query(sql, data, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else {
          res.send("norm");
        }
      });
    }
  });
});

router.get("/get_message/:id", async (req, res) => {
  let sql = `SELECT * FROM comments WHERE post_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_activity/:id", async (req, res) => {
  let sql = `SELECT * FROM activity WHERE  user_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_activity_post/:id", async (req, res) => {
  let sql = `SELECT * FROM activity WHERE  post_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.delete(
  "/delete_activity/:id",
  [check("id", "Вы не выбрали пост")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = req.params.id;
    let sql = `DELETE FROM activity WHERE id=${id}`;

    await connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Активность удалена");
    });
  }
);

module.exports = router;
