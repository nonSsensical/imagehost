const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const connectDB = require("../config/database");
const middleware = require("../middleware/image");
const fs = require("fs");

router.post(
  "/upload_image",

  middleware.single("image"),

  async (req, res) => {
    const url_image = `/images/${req.file.filename}`;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ref = url_image;
    const { post_id } = req.body;
    let sql = `INSERT image(post_id, ref) VALUES ('${post_id}', '${ref}')`;

    connectDB.query(sql, (err, result) => {
      if (err) {
        res.status(500).send("Errors server");
        throw err;
      } else res.send("Ссылка добавлена");
    });
  }
);

router.post(
  "/create_image/:id",

  middleware.single("image"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const url_image = `/images/${req.file.filename}`;

    let sql = `INSERT image(user_id, ref) VALUES ('${req.params.id}', '${url_image}')`;

    connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else {
        let sql = `UPDATE user SET avatar = "${url_image}" WHERE id = "${req.params.id}"`;

        connectDB.query(sql, (err) => {
          if (err) {
            res.status(500).send("Ошибка сервера");
            throw err;
          } else res.send("Пользователь обновлен");
        });
      }
    });
  }
);

router.get("/get_image/:id", async (req, res) => {
  let sql = `SELECT * FROM image WHERE post_id = ${req.params.id}`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;

      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_image", async (req, res) => {
  let sql = "SELECT * FROM image";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.delete(
  "/delete_image/:id",
  [check("id", "Вы не выбрали изображение")],
  async (req, res) => {
    const errors = validationResult(req);

    let sql = `SELECT * FROM image WHERE post_id = ${req.params.id} LIMIT 1`;
    connectDB.query(sql, (err, result) => {
      if (err) {
        res.status(500).send;

        throw err;
      } else {
        console.log(result);
        var filePath =
          "." + result.find((item) => item.post_id == req.params.id).ref;
        fs.unlinkSync(filePath);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        let id = req.params.id;
        let sql = `DELETE FROM image WHERE post_id=${id}`;

        connectDB.query(sql, (err) => {
          if (err) {
            res.status(500).send("Ошибка сервера");
            throw err;
          } else {
            let sql = `DELETE FROM activity WHERE post_id=${id}`;

            connectDB.query(sql, (err) => {
              if (err) {
                res.status(500).send("Ошибка сервера");
                throw err;
              } else {
                let sql = `DELETE FROM post WHERE id=${id}`;

                connectDB.query(sql, (err) => {
                  if (err) {
                    res.status(500).send("Ошибка сервера");
                    throw err;
                  } else {
                    res.send(" Удалено");
                  }
                });
              }
            });
          }
        });
      }
    });
  }
);

module.exports = router;
