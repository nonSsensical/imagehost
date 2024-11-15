const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");
const middleware = require("../middleware/image");
const fs = require("fs");

router.post(
  "/create_dialog",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_from_id, user_to_id } = req.body;

    let sql = `INSERT dialog (user_from_id, user_to_id) VALUES ('${user_from_id}', '${user_to_id}')`;

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

router.post(
  "/create_message",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_from_id, user_to_id, dialog_id, date_publication, message } =
      req.body;

    let sql = `INSERT chat (user_from_id, user_to_id, dialog_id, date_publication, message) VALUES ('${user_from_id}', '${user_to_id}', '${dialog_id}', '${date_publication}', '${message}')`;

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

router.post(
  "/create_message_and_image",

  middleware.single("image"),

  async (req, res) => {
    const url_image = `/images/${req.file.filename}`;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_from_id, user_to_id, dialog_id, date_publication, message } = req.body;

    let sql = `INSERT chat (user_from_id, user_to_id, dialog_id, date_publication, message, img) VALUES ('${user_from_id}', '${user_to_id}', '${dialog_id}', '${date_publication}', '${message}', '${url_image}')`;

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

router.post(
  "/create_sticker",

  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { user_from_id, user_to_id, dialog_id, date_publication, message, stickers } = req.body;


    let sql = `INSERT chat (user_from_id, user_to_id, dialog_id, date_publication, message, stickers) VALUES ('${user_from_id}', '${user_to_id}', '${dialog_id}', '${date_publication}', '${message}', '${stickers}')`;

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
  let sql = `SELECT * FROM chat WHERE dialog_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_dialog/:id", async (req, res) => {
  let sql = `SELECT * FROM dialog WHERE user_from_id = ${req.params.id} OR user_to_id = ${req.params.id}`;
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
