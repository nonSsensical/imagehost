import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Button,
  Menu,
  MenuItem,
  styled,
  alpha,
  Divider,
  Modal,
  TextField,
  Grid,
  inputClasses,
  inputLabelClasses,
  InputBase,
  ClickAwayListener,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { AuthContext } from "../context/AuthContext";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import axios from "axios";
import UploadIcon from "@mui/icons-material/Upload";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),

  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.up("xs")]: {
    position: "relative",
    margin: "3px 10px 0px 10px",
    width: "50px",
    backgroundColor: alpha(theme.palette.common.white, 0.55),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.65),
      width: "auto",
      position: "relative",
      margin: "3px 10px 0px 10px",
    },
  },
  [theme.breakpoints.up("sm")]: {
    position: "relative",
    margin: "0px 0px 0px 0px",
    marginLeft: theme.spacing(3),
    width: "500px",
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
      width: "500px",
      margin: "0px 0px 0px 24px",
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    padding: theme.spacing(0, "14px"),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 2),
  },
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      width: "0px",
      "&:hover": {
        width: "200px",
      },
    },
    [theme.breakpoints.up("md")]: {
      width: "440px",
      "&:hover": {
        width: "440px",
      },
    },
  },
}));


const ICButton = styled(
  IconButton,
  CloseIcon
)(({ theme }) => ({
  "&:hover": {
    CloseIcon: {
      display: "block",
    },
  },
}));

const TextFieldd = styled(TextField)(`

  .${inputClasses.root} {
    font-size: 18px;
    color: black;
    
  }
  .${inputLabelClasses.root} {
    font-size: 18px;
    color: black;
    &.${inputLabelClasses.focused} {
      color: grey;
    }
  }
`);

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "300px",
    sm: "600px",
  },
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
};

const baseStyle = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row",
  },
  alignItems: "center",
  padding: "20px",
  borderRadius: 5,
  background: "#202020",
  color: "#white",
  transition: "border .3s ease-in-out",
  noClick: "false",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const LinkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: "white",
};

function Header() {
  const { userId } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [isLoadedProfile, setIsLoadedProfile] = useState(false);
  const [profile, setProfile] = useState();
  const [searchMenu, setSearchMenu] = React.useState(false);
  const openSearchMenu = Boolean(searchMenu);
  const searchMenuClick = (event) => {
    setSearchMenu(true);
  };
  const searchMenuClose = () => {
    setSearchMenu(false);
  };

  var date = new Date();

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    title: "",
    date_publication: date.toLocaleString("ru", options),
    image: "",
  });

  const { user_id, name, title, date_publication, image } = form;

  form.user_id = JSON.stringify(userId);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { logout, isLogin } = useContext(AuthContext);

  let setValue;

  if (isLogin) {
    setValue = "Выйти";
  } else {
    setValue = "Войти";
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
  };

  const [openUpload, setOpenUpload] = useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const maxLength = 10485760;

  function nameLengthValidator(file) {
    if (file.size > maxLength) {
      return {
        code: "too-many-files",
        message: `Размер не должен быть больше ${maxLength} Byte`,
      };
    }

    return null;
  }

  const {
    getRootProps,
    getInputProps,
    open,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 5,
    onDrop,
    validator: nameLengthValidator,
    type: "image",
    noClick: true,
    noKeyboard: true,
    accept: "image/jpeg, image/png, image/gif",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const RemoD = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles); // update the state
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  form.image = files;

  const trynow = async () => {
    let formData = new FormData();

    files.map((item) => {
      formData.append("image", item);
    });

    if (form.name === "") {
      handleClickAlertFalseName();
    } else
      try {
        handleClickAlert();
        setOpenUpload(false);
        await axios.all([
          axios.post(
            "/api/post/create_post",
            { ...form },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          ),

          axios.post("/api/post/create_image", formData),
        ]);
      } catch (error) {
        console.log(error);
      }
  };

  const addPost = async () => {
    await trynow();
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertFalse, setOpenAlertFalse] = React.useState(false);
  const [openAlertFalseName, setOpenAlertFalseName] = React.useState(false);

  const handleClickAlert = (message) => {
    setOpenAlert(true);
  };

  const handleClickAlertFalse = (message) => {
    setOpenAlertFalse(true);
  };

  const handleClickAlertFalseName = (message) => {
    setOpenAlertFalseName(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleCloseAlertFalse = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertFalse(false);
  };

  const handleCloseAlertFalseName = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlertFalseName(false);
  };

  useEffect(() => {
    if (fileRejections.length != 0) {
      handleClickAlertFalse();
      open();
    }
  });

  const action = (
    <React.Fragment>
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [notify, setNotify] = useState([]);
  const [usersNotify, setUsersNotify] = useState([]);
  const [post, setPost] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      await axios
        .get(`/api/auth/get_user`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setUsersNotify(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getUsers();
  }, [usersNotify]);

  const getNotify = useCallback(async () => {
    try {
      await axios
        .get("/api/notify/get_notify/" + userId, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setNotify(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getNotify();
  }, [notify]);

  const getHeader = useCallback(async () => {
    try {
      await axios
        .get("/api/auth/get_user_header/" + userId, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(
          (response) => setProfile(response?.data),
          setIsLoadedProfile(true)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getHeader();
  }, [profile]);

  const getPosts = useCallback(async () => {
    try {
      await axios
        .get(`/api/post/get_post_all`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setPost(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPosts();
  }, [post]);

  const deletePost = () => {
    axios.delete(`/api/notify/delete_notify/${userId}`);
  };

  return isLoadedProfile ? (
    <Box sx={{ flexGrow: 1 }}>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Пост добавлен
        </Alert>
      </Snackbar>

      <Snackbar
        open={openAlertFalse}
        autoHideDuration={6000}
        onClose={handleCloseAlertFalse}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlertFalse}
          severity="error"
          sx={{ width: "100%" }}
        >
          Не добавляйте в один пост более чем 6 картинок!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openAlertFalseName}
        autoHideDuration={6000}
        onClose={handleCloseAlertFalseName}
        message=" Изображение загружено"
        action={action}
      >
        <Alert
          onClose={handleCloseAlertFalseName}
          severity="error"
          sx={{ width: "100%" }}
        >
          Добавьте название поста!
        </Alert>
      </Snackbar>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            width: {
              xs: "380px",
              sm: "auto",
            },
          }}
        >
          <Avatar
            component="a"
            href="/"
            alt="logo"
            src={require("../logo.png")}
            sx={{
              mr: 1,
              mb: 1,
              mt: 1,
              width: {
                xs: "40px",
                sm: "70px",
              },
              height: {
                xs: "40px",
                sm: "70px",
              },
            }}
          />

          <Typography
            component="a"
            href="/"
            variant="h4"
            sx={{
              letterSpacing: "-1px",
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: {
                xs: "20px",
                sm: "40px",
              },
            }}
          >
            imghost
          </Typography>

          <Grid container>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                name="search"
                onChange={changeHandler}
                placeholder="Поиск"
                aria-expanded={open ? "true" : undefined}
                onClick={searchMenuClick}
                // onMouseDown={searchMenuClose}
              />
            </Search>

            {searchMenu ? (
              <ClickAwayListener onClickAway={searchMenuClose}>
                <Box
                  sx={{
                    position: "absolute",
                    width: {
                      xs: "240px",
                      sm: "482px",
                    },
                    color: "#b5b9c2",
                    fontSize: "17px",
                    lineHeight: "2.24",
                    letterSpacing: ".9px",
                    padding: "8px 8px 8px",
                    borderRadius: "4px",
                    backgroundColor: "#3c424b",
                    boxShadow: "0 22px 40px 0 rgb(0 0 0 / 25%)",
                    marginTop: "45px",
                    minWidth: {
                      xs: "240px",
                      sm: "482px",
                    },
                    textAlign: "left",
                    border: "1px solid #4f4f4f",
                    ml: {
                      xs: "11px",
                      sm: "24px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      pl: "17px",
                      fontWeight: "700",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      mb: "5px",
                    }}
                  >
                    посты
                  </Box>
                  <Box sx={{ mb: "30px" }}>
                    {post?.map((i) =>
                      form.search != "" ? (
                        ~i.title?.indexOf(form.search) ? (
                          <>
                            <Grid
                              item
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "flex",
                                  fontWeight: 400,
                                  fontSize: "18px",
                                  alignItems: "center",
                                  color: "white",
                                  lineHeight: 1,
                                  width: "max-content",
                                  flexDirection: "column",
                                  "a:-webkit-any-link": {
                                    textDecoration: "none",
                                    color: "white",
                                  },
                                }}
                              >
                                <Link style={LinkStyle} to={`/post/${i.id}`}>
                                  {i.name}
                                </Link>
                              </Typography>
                            </Grid>
                          </>
                        ) : null
                      ) : null
                    )}
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        pl: "17px",
                        fontWeight: "700",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        mb: "5px",
                      }}
                    >
                      пользователи
                    </Box>
                    {usersNotify?.map((i) =>
                      form.search != "" ? (
                        ~i.nickname?.indexOf(form.search) ? (
                          <>
                            <Grid
                              item
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                alt="avatar"
                                src={`${i.avatar}`}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  mr: "5px",
                                }}
                              />
                              <Typography
                                sx={{
                                  display: "flex",
                                  fontWeight: 400,
                                  fontSize: "18px",
                                  alignItems: "center",
                                  color: "white",
                                  lineHeight: 1,
                                  width: "max-content",
                                  flexDirection: "column",
                                  "a:-webkit-any-link": {
                                    textDecoration: "none",
                                    color: "white",
                                  },
                                }}
                              >
                                <Link style={LinkStyle} to={`/user/${i.id}`}>
                                  {i.nickname}
                                </Link>
                              </Typography>
                            </Grid>
                          </>
                        ) : null
                      ) : null
                    )}
                  </Box>
                </Box>
              </ClickAwayListener>
            ) : null}
          </Grid>

          <Box sx={{ flexGrow: 1 }} />

          {isLogin ? (
            <>
              <Modal
                open={openUpload}
                onClose={handleClose}
                sx={{
                  background:
                    "linear-gradient(34deg, rgb(126 139 255 / 70%) 0%, rgb(255 255 255 / 70%) 100%)",
                  color: "#7e8bff",
                }}
              >
                <Box sx={modalstyle} {...getRootProps({ style })}>
                  <Grid
                    container
                    sx={{
                      width: {
                        xs: "280px",
                        sm: "255px",
                      },
                      height: "auto",
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        width: "250px",
                        height: "400px",
                        ml: 2,
                        display: "flex",
                        flexDirection: "column",
                        p: 1,
                        background:
                          "linear-gradient(34deg, rgb(235 110 110 / 70%) 0%, rgb(119 150 173 / 70%) 100%)",
                        borderRadius: 2,
                        boxShadow: "5px 5px 20px 0px black",
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        name="image"
                        id="file"
                        accept="image/gif , image/png , image/jpeg"
                        {...getInputProps()}
                      />
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                          py: 15,
                          textAlign: "center",

                          color: "white",
                          fontSize: 20,
                          fontWeight: 500,
                          border: "3px dashed hsla(0,0%,100%,.4)",
                          borderRadius: 1,
                        }}
                      >
                        Перетащите изображение <br /> или нажмите сюда
                        <br />
                        <Button
                          sx={{
                            mt: 1,
                            p: 0,
                            height: "35px",
                            minWidth: "35px",
                            textAlign: "center",
                            background: "#26262669",
                            borderRadius: 50,
                          }}
                          variant="contained"
                          component="span"
                          color="secondary"
                          type="button"
                          onClick={open}
                        >
                          <UploadIcon />
                        </Button>
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        height: "max-content",
                        width: "100%",
                        lineHeight: "20px",
                        ml: "40px",
                        mt: "20px",
                      }}
                    >
                      {files.map((file) => (
                        <Grid
                          key={file.path}
                          item
                          sx={{ width: "max-content", mr: "7px", mb: 1 }}
                        >
                          <img width={50} height={50} src={file.preview} />

                          <ICButton
                            onClick={() => RemoD(file)}
                            sx={{ p: 0, ml: "-12px", mt: "-90px" }}
                          >
                            <CloseIcon
                              sx={{ fill: "red", verticalAlign: "middle" }}
                            />
                          </ICButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid
                    sx={{
                      width: "300px",
                      height: "auto",
                      ml: {
                        xs: "0px",
                        sm: "32px",
                      },
                      mb: "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "22px",
                        textAlign: "center",
                        mb: 5,
                      }}
                    >
                      Добавление поста
                    </Typography>
                    <Grid item>
                      <TextFieldd
                        sx={{
                          width: "100%",
                          lineHeight: "20px",
                          mb: "5px",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.4rem",
                          boxShadow: "1px -1px 5px 0px black",

                          ".MuiInputLabel-root": {
                            color: "rgb(255 255 255)",
                          },
                          ".MuiFilledInput-root": {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: "rgb(255 255 255 / 80%)",
                            backgroundColor: "rgb(60 60 60)",
                          },
                        }}
                        label="Название"
                        name="name"
                        variant="filled"
                        onChange={changeHandler}
                      />
                    </Grid>
                    <Grid item>
                      <TextFieldd
                        sx={{
                          width: "100%",
                          lineHeight: "50px",
                          fontSize: "1.2rem",
                          mb: "100px",
                          boxShadow: "1px 1px 5px 0px black",

                          ".MuiInputLabel-root": {
                            color: "rgb(255 255 255)",
                          },
                          ".MuiFilledInput-root": {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: "rgb(255 255 255 / 80%)",
                            backgroundColor: "rgb(60 60 60)",
                          },
                        }}
                        rows={4}
                        multiline
                        label="Описание"
                        name="title"
                        variant="filled"
                        onChange={changeHandler}
                      />
                    </Grid>
                    <Grid item sx={{ textAlign: "center" }}>
                      <Button
                        sx={{
                          p: 0,
                          height: "40px",
                          textAlign: "center",
                          boxShadow: "1px 1px 5px 0px black",
                        }}
                        variant="contained"
                        component="span"
                        color="secondary"
                        type="button"
                        onClick={addPost}
                      >
                        <Typography
                          variant="span"
                          sx={{
                            color: "white",
                            fontSize: 13,
                            p: "5px",
                            borderRadius: 2,
                          }}
                        >
                          Опубликовать
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Button
                  onClick={handleOpen}
                  variant="contained"
                  component="span"
                  color="secondary"
                  sx={{ mt: 0.45, height: "40px", textAlign: "center" }}
                >
                  <AddAPhotoOutlinedIcon sx={{ mb: "3px" }} />
                </Button>
                <IconButton
                  size="large"
                  aria-label="show new mails"
                  color="inherit"
                  sx={{
                    ml: {
                      xs: "5px",
                      sm: "10px",
                    },
                    p: {
                      xs: "5px",
                      sm: "12px",
                    },
                  }}
                  component={Link}
                  to={`/chat`}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 100)
                  }
                >
                  <Badge badgeContent={0} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  onClick={handleOpenMenu}
                  color="inherit"
                  sx={{
                    ml: {
                      xs: "5px",
                      sm: "10px",
                    },
                    p: {
                      xs: "5px",
                      sm: "12px",
                    },
                  }}
                >
                  <Badge badgeContent={0} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  sx={{ ".MuiMenu-list": { p: "0px", height: "560px" } }}
                >
                  <Button
                    onClick={() => deletePost()}
                    sx={{
                      width: "290px",
                      background: "#dfdfdf",
                      mx: "10px",
                      mt: "10px",
                      "&:hover": {
                        backgroundColor: "#bbbbbb",
                      },
                    }}
                  >
                    <Typography sx={{ color: "#343434", fontSize: "14px" }}>
                      Очистить
                    </Typography>
                  </Button>
                  {notify
                    ?.slice(0)
                    .reverse()
                    .map((ntf) =>
                      usersNotify?.map((usr) =>
                        ntf.user_from_id === usr.id ? (
                          ntf.isActivity === 1 ? (
                            <Typography
                              sx={{
                                m: "10px",
                                background: "#dfdfdf",
                                padding: "10px",
                                borderRadius: "5px",
                                "&:hover": {
                                  backgroundColor: "#bbbbbb",
                                },
                              }}
                            >
                              {usr.nickname} лайкнул вашу запись
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                m: "10px",
                                background: "#dfdfdf",
                                padding: "10px",
                                borderRadius: "5px",
                                "&:hover": {
                                  backgroundColor: "#bbbbbb",
                                },
                              }}
                            >
                              {usr.nickname} отправил вам сообщение
                            </Typography>
                          )
                        ) : null
                      )
                    )}
                </Menu>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  size="large"
                  aria-label="show avatar"
                  color="inherit"
                  sx={{
                    ml: {
                      xs: "5px",
                      sm: "10px",
                    },
                    p: {
                      xs: "5px",
                      sm: "12px",
                    },
                    mr: {
                      xs: "5px",
                      sm: "0px",
                    },
                  }}
                >
                  <Avatar
                    alt=""
                    src={`${profile?.map((item) => item.avatar)}`}
                    sx={{ width: 40, height: 40 }}
                  />
                </IconButton>
                <Menu
                  sx={{ mt: "50px", width: "0 auto" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: 500, ml: 3, mb: 1, mr: 3 }}
                  >
                    {profile?.map((item) => item.nickname)}
                  </Typography>
                  <Divider />
                  <MenuItem
                    component={Link}
                    to={`/user/${userId}`}
                    sx={{ ml: 1, mt: 1, mr: 1 }}
                    onClick={() =>
                      setTimeout(() => {
                        window.location.reload();
                      }, 100)
                    }
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "30px",
                      }}
                    >
                      <Typography
                        sx={{
                          mr: "4px",
                          mb: "4px",
                          display: "flex",
                        }}
                      >
                        <AccountCircleIcon />
                      </Typography>
                      <Typography sx={{ display: "inline" }} textAlign="center">
                        Профиль
                      </Typography>
                    </Grid>
                  </MenuItem>
                  <MenuItem sx={{ ml: 1, mr: 1 }} onClick={handleLogout}>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "30px",
                      }}
                    >
                      <Typography
                        sx={{
                          mr: "4px",
                          mb: "4px",
                          display: "flex",
                        }}
                      >
                        <LogoutOutlinedIcon />
                      </Typography>
                      <Typography sx={{ display: "inline" }} textAlign="center">
                        {setValue}
                      </Typography>
                    </Grid>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Link style={LinkStyle} to="/auth">
              <Button
                variant="contained"
                component="span"
                color="secondary"
                sx={{ ml: "15px", height: "40px", textAlign: "center" }}
              >
                Войти
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Avatar
            component="a"
            href="/"
            alt="logo"
            src={require("../logo.png")}
            sx={{ mr: 1, mb: 1, width: 90, height: 90 }}
          />

          <Typography
            component="a"
            href="/"
            variant="h4"
            sx={{
              letterSpacing: "-1px",
              textDecoration: "none",
              color: "black",
            }}
          >
            ККРИТ
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Header;
