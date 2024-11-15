import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  FormControl,
  styled
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

const AuthBox = styled(Box)(({ theme }) => ({
  position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(66,66,66,0.25)",
          color: "rgb(255 255 255 / 100%)",
          padding: '16px',
          borderRadius: '8px',
    [theme.breakpoints.up("xs")]: {
      width: "330px",
      marginTop: '15px'
    },
    [theme.breakpoints.up("sm")]: {
      width: "500px",
    },
  }
));

const AuthPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    returnPassword: "",
    showPassword: false,
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setForm({
      ...form,
      showPassword: !form.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const check = () => {
    if (form.password === form.returnPassword) {
      if (form.password.length > 6) {
        registerHandler();
      } else {
        handleClickPassword();
      }
    } else {
      handleClickPasswordSuccess();
    }
  };

  const registerHandler = async () => {
    try {
      await axios
        .post(
          "/api/auth/registration",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setTimeout(() => {
            window.location.href = "/auth";
          }, 2000);
        });
    } catch (errors) {
      if (errors.message === "Request failed with status code 300") {
        handleClick();
      }

      if (errors.message === "Request failed with status code 400") {
        handleClickCode();
      }
    }
  };

  const [open, setOpen] = React.useState(false);
  const [openCode, setOpenCode] = React.useState(false);
  const [openCodeSuccess, setOpenCodeSuccess] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
  const [openPasswordSuccess, setOpenPasswordSuccess] = React.useState(false);

  // Отслеживания для алертов
  const handleClick = (message) => {
    setOpen(true);
  };

  const handleClickCode = (message) => {
    setOpenCode(true);
  };

  const handleClickCodeSuccess = (message) => {
    setOpenCodeSuccess(true);
  };

  const handleClickPassword = (message) => {
    setOpenPassword(true);
  };

  const handleClickPasswordSuccess = (message) => {
    setOpenPasswordSuccess(true);
  };

  //Закрытие алертов
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseCode = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCode(false);
  };

  const handleCloseCodeSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCodeSuccess(false);
  };

  const handleClosePassword = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenPassword(false);
  };

  const handleClosePasswordSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenPasswordSuccess(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box className="container">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Ошибка входа"
        action={action}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Пользователь с таким email уже зарегистрирован!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openCode}
        autoHideDuration={6000}
        onClose={handleCloseCode}
        message="Неверный email"
        action={action}
      >
        <Alert
          onClose={handleCloseCode}
          severity="error"
          sx={{ width: "100%" }}
        >
          Неверный email!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openCodeSuccess}
        autoHideDuration={6000}
        onClose={handleCloseCodeSuccess}
        message="Код отправлен, проверьте почту."
        action={action}
      >
        <Alert
          onClose={handleCloseCodeSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Код отправлен, проверьте почту.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openPassword}
        autoHideDuration={6000}
        onClose={handleClosePassword}
        message="Пароль должен быть больше 6 символов."
        action={action}
      >
        <Alert
          onClose={handleClosePassword}
          severity="error"
          sx={{ width: "100%" }}
        >
          Пароль должен быть больше 6 символов.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openPasswordSuccess}
        autoHideDuration={6000}
        onClose={handleClosePasswordSuccess}
        message="Пароли не совпадают."
        action={action}
      >
        <Alert
          onClose={handleClosePasswordSuccess}
          severity="error"
          sx={{ width: "100%" }}
        >
          Пароли не совпадают.
        </Alert>
      </Snackbar>
      <AuthBox
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Регистрация
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormControl
            sx={{
              width: "100%",
              ".MuiTextField-root": {
                background: "rgb(130 130 130 / 20%)",
                borderRadius: "5px",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0)",
                border: "none",
              },
            }}
          >
            <TextField
              sx={{
                width: "100%",
                ".MuiInputLabel-root": {
                  color: "white",
                },
                ".Mui-focused": {
                  color: "#bdbdbde0",
                },
                ".MuiOutlinedInput-root": {
                  color: "rgb(255 255 255)",
                },
              }}
              margin="normal"
              label="Никнейм"
              type="text"
              name="nickname"
              className="validate"
              onChange={changeHandler}
            />
            <TextField
              sx={{
                width: "100%",
                ".MuiInputLabel-root": {
                  color: "white",
                },
                ".Mui-focused": {
                  color: "#bdbdbde0",
                },
                ".MuiOutlinedInput-root": {
                  color: "rgb(255 255 255)",
                },
              }}
              margin="normal"
              label="E-mail"
              type="email"
              name="email"
              className="validate"
              onChange={changeHandler}
            />
            <TextField
              sx={{
                width: "100%",
                mb: 1,
                mt: 2,
                color: "white",
                visible: true,
                ".MuiInputLabel-root": {
                  color: "white",
                },
                ".Mui-focused": {
                  color: "#bdbdbde0",
                },
                ".MuiOutlinedInput-root": {
                  color: "rgb(255 255 255)",
                },
              }}
              variant="outlined"
              margin="normal"
              label="Пароль"
              type={form.showPassword ? "text" : "password"}
              value={form.password}
              name="password"
              className="validate"
              onChange={changeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{
                        color: "rgb(255 255 255)",
                      }}
                    >
                      {form.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{
                width: "100%",
                mb: 2,
                mt: 2,
                color: "black",
                visible: true,
                ".MuiInputLabel-root": {
                  color: "white",
                },
                ".Mui-focused": {
                  color: "#bdbdbde0",
                },
                ".MuiOutlinedInput-root": {
                  color: "rgb(255 255 255)",
                },
              }}
              variant="outlined"
              margin="normal"
              label="Повторите пароль"
              type={form.showPassword ? "text" : "password"}
              value={form.returnPassword}
              name="returnPassword"
              className="validate"
              onChange={changeHandler}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{
                        color: "rgb(255 255 255)",
                      }}
                    >
                      {form.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                mb: "16px",
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                border: 0,
                borderRadius: "5px",
                boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                color: "white",
                height: 48,
                padding: "0 30px",
                width: "100%",
              }}
              onClick={check}
            >
              Регистрация
            </Button>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid item>
                <Link href="/auth" sx={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    Уже есть аккаунт?
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </AuthBox>
    </Box>
  );
};

export default AuthPage;
