const { Router } = require("express");
const router = Router();
const connectDB = require("../config/database");
const { check, validationResult } = require("express-validator");
const bcrypter = require("bcryptjs");
const jwtToken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const fs = require("fs");


const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  auth: {
    user: "imghost@internet.ru",
    pass: "SkeXqPiHXJ0A6YLrimf3",
  },
});



router.post("/reset_pass", async (req, res) => {
  const { email, message } = req.body;

  const options = {
    from: "imghost@internet.ru",
    to: `${email}`,
    subject: "Восстановление пароля",
    text: `${message}`,
  };

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
  });
});

router.get("/get_user/:id", async (req, res) => {
  let sql = `SELECT * FROM user WHERE id = ${req.params.id} LIMIT 1`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;
      throw err;
    } else res.json(result);
  });
});



router.put(
  "/update_user",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, nickname, firstName, secondName, login } = req.body;

    let sql = `UPDATE user SET nickname = "${nickname}", login = "${login}" WHERE id = "${user_id}"`;

    connectDB.query(sql, (err) => {
      if (err) {
        res.status(500).send("Ошибка сервера");
        throw err;
      } else res.send("Пользователь обновлен");
    });
  }
);

router.get("/get_user_one/:id", async (req, res) => {
  let sql = `SELECT * FROM post WHERE id = ${req.params.id} LIMIT 1`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;
      throw err;
    } else {
      let usr = `SELECT * FROM post, user WHERE user.id = ${result.map(
        (item) => item.user_id
      )}`;

      connectDB.query(usr, (err, itog) => {
        if (err) {
          res.status(500).send;
          throw err;
        } else {
          res.json(itog);
        }
      });
    }
  });
});

router.get("/get_user_header/:id", async (req, res) => {
  let sql = `SELECT * FROM user WHERE id = ${req.params.id} LIMIT 1`;
  connectDB.query(sql, (err, result) => {
    if (err) {
      res.status(500).send;
      throw err;
    } else {
      res.json(result);
    }
  });
});

router.get("/get_user", async (req, res) => {
  let sql = "SELECT * FROM user";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post(
  "/registration",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Некорректный пароль").isLength({ min: 6 }),
    check("nickname", "Некорректный никнейм").isLength({ min: 4 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password, nickname } = req.body;

      const hashedPassword = await bcrypter.hash(password, 12);

      await connectDB.query("SELECT * FROM user", (err, result) => {
        if (err) throw err;

        try {
          if (result.find((item) => item.login == email).login == email)
            return res
              .status(300)
              .json({ message: "Данный Email уже занят, попробуйте другой" });
        } catch (error) {
          let createuser = `INSERT user(login, password, nickname) VALUES ('${email}', '${hashedPassword}', '${nickname}')`;

          connectDB.query(createuser, (err, result) => {
            if (err) throw err;
          });
          res.status(201).json({ message: "Пользователь создан" });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/resetPass",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Некорректный пароль").isLength({ min: 6 }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password } = req.body;

      const hashedPassword = await bcrypter.hash(password, 12);

      let createuser = `UPDATE user SET password = '${hashedPassword}' WHERE login = '${email}'`;

      connectDB.query(createuser, (err, result) => {
        if (err) throw err;
      });
      res.status(201).json({ message: "Пользователь  обновлен" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Некорректный пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password } = req.body;

      //const user = await User.findOne({email})

      let g;

      connectDB.query(
        `SELECT * FROM user WHERE login = '${email}' `,
        async (err, result) => {
          if (err) throw err;

          if (result.length == 0) {
            return res
              .status(400)
              .json({ message: "Данный пользователь не найден" });
          }

          let user = result.filter(function (val) {
            return val.login == email;
          })[0];

          g += user;

          isMatch = await bcrypter.compare(password, user.password);


          if (!isMatch) {
            return res.status(400).json({ message: "Пароли не совпадают" });
          }

          const jwtSecret = "putin";

          const token = jwtToken.sign({ userId: user.id }, jwtSecret, {
            expiresIn: "1h",
          });

          res.json({ token, userId: user.id });
        }
      );

      // if(!user) {
      //return res.status(400).json({message: 'Данный пользователь не найден'})
      // }

      //const isMatch = bcrypter.compare(password, user.password)

      //if(!isMatch) {
      //    return res.status(400).json({message: 'Пароли не совпадают'})
      //}

      //const jwtSecret = 'putin'

      // const token = jwtToken.sign(
      //     {userId: user.id},
      //     jwtSecret,
      //     {expiresIn: '1h'}
      // )

      //  res.json({token, userId : user.id})
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
