const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");
const fs = require("fs");
const multer = require("multer");
const randomstring = require("randomstring");

const TYPE_IMAGES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = TYPE_IMAGES[file.mimetype];
    callback(null, randomstring.generate(11) + "." + extension);
  },
});

const upload = multer({ storage: storage });

let g;

router.get("/get_post_one/:id", async (req, res) => {
  let sql = `SELECT * FROM post WHERE id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_post/:count", async (req, res) => {
  let sql = `SELECT * FROM post ORDER BY id DESC LIMIT ${req.params.count}`;
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/get_post_all", async (req, res) => {
  let sql = `SELECT * FROM post`;
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/get_post_user/:id", async (req, res) => {
  let sql = `SELECT * FROM post WHERE user_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});




router.post(
  "/create_post",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name, title, date_publication } = req.body;

    let sql = `INSERT post(user_id, name, title, date_publication, count_watch, count_like, count_comments) VALUES ('${user_id}', '${name}', '${title}', '${date_publication}', 0, 0, 0)`;

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
  "/create_image",

  upload.array("image", 10),

  async (req, res) => {

    req.files.map((item) => {
      const url_image = `/images/${item.filename}`;

      let imageSql = `INSERT image(post_id, ref) VALUES ('${g}', '${url_image}')`;

      connectDB.query(imageSql, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else return res.status(200);
      });
    });
  }
);

router.put(
  "/update_post",
  [
    check("name", "Укажите название"),
    check("title", "Укажите описание").not().isEmpty(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, title } = req.body;

    g = id;

    let sql = `UPDATE post SET name = "${name}", title = "${title}" WHERE id = "${id}"`;

    connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Пост обновлен");
    });
  }
);

router.put(
  "/update_image",

  upload.array("image", 10),

  async (req, res) => {
    req.files.map((item) => {
      const url_image = `/images/${item.filename}`;

      let imageSql = `UPDATE image SET ref = "${url_image}" WHERE post_id = "${req.body.id}"`;

      connectDB.query(imageSql, (err, result) => {
        if (err) {
          res.status(500).send("Errors server");
          throw err;
        } else return res.status(200);
      });
    });
  }
);

router.delete(
  "/delete_post/:id",
  [check("id", "Вы не выбрали пост")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = req.params.id;
    let sql = `DELETE FROM post WHERE id=${id}`;

    await connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Пост удален");
    });
  }
);

module.exports = router;
