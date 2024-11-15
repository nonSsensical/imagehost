const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");

router.post(
    "/create_notify",
  
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      let { user_from_id, user_to_id, isActivity } = req.body;
  

      let sql = `INSERT notify (user_from_id, user_to_id, isActivity) VALUES (${user_from_id}, ${user_to_id}, ${isActivity})`;
  
      connectDB.query(sql, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else {
            res.send("norm");
        }
      });
    }
  );

router.get("/get_notify/:id", async (req, res) => {
  let sql = `SELECT * FROM notify WHERE user_to_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.post(
  "/create_message",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_from_id, group_id, date_publication, message } =
      req.body;

    let sql = `INSERT chat_group (user_from_id, group_id, date_publication, message) VALUES ('${user_from_id}', '${group_id}', '${date_publication}', '${message}')`;

    connectDB.query(sql, (err, result) => {
      g = result.insertId;

      if (err) {
        res.status(500).send("Errors server");
        throw err;
      } else {
        res.send("norm");
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

router.get("/get_message/:id", async (req, res) => {
  let sql = `SELECT * FROM chat_group WHERE group_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_user_message/:id", async (req, res) => {
  let sql = `SELECT * FROM user JOIN group_users ON user.id = group_users.user_id WHERE group_id = ${req.params.id};`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_group/:id", async (req, res) => {
  let sql = "SELECT * FROM `group` "  + `JOIN group_users ON group.id = group_users.group_id WHERE user_id = ${req.params.id}`;
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
  "/delete_notify/:id",
  [check("id", "Вы не выбрали пост")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = req.params.id;
    let sql = `DELETE FROM notify WHERE user_to_id=${id}`;

    await connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Активность удалена");
    });
  }
);

module.exports = router;
