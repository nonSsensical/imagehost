const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");

router.post(
  "/create_subscribe",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { subscribes_to, subscribes_id } = req.body;

    let data = { subscribes_to, subscribes_id };

    if (subscribes_to == subscribes_id) {
      res.send("Пользователь не может подписаться сам на себя");
    } else {
      let sql = `INSERT INTO subscribes(subscribes_to, subscribes_id) VALUES ('${subscribes_to}', '${subscribes_id}')`;

      connectDB.query(sql, data, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else {
          res.send("norm");
        }
      });
    }
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

router.get("/get_subscribes/:id", async (req, res) => {
  let sql = `SELECT * FROM subscribes WHERE subscribes_to = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_subscribes_list/:id", async (req, res) => {
  let sql = `SELECT * FROM subscribes WHERE subscribes_to = ${req.params.id}`;
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
  "/delete_subscribe/:id",
  [check("id", "Вы не выбрали пост")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = req.params.id;
    let sql = `DELETE FROM subscribes WHERE id=${id}`;

    await connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Активность удалена");
    });
  }
);

router.post("/delete_subscribes", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { subscribes_to, subscribes_id } = req.body;

  let data = { subscribes_to, subscribes_id };

  let sql =
    "SELECT * FROM subscribes WHERE `subscribes_to` = " +
    subscribes_to +
    " AND `subscribes_id` = " +
    subscribes_id;

  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Ошибка сервера");
      throw err;
    } else {
      let sql = `DELETE FROM subscribes WHERE id = ${result[0].id}`;

      connectDB.query(sql, data, (err) => {
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

module.exports = router;
