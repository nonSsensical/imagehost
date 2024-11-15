import React, { useState, useContext, useCallback, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Avatar,
  ButtonGroup,
  styled,
  alpha,
  Modal,
  FormControl,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  inputClasses,
  inputLabelClasses,
  InputBase,
  Badge,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import MainCard from "../../components/PostCard";
import LikeCard from "../../components/PostCardLike";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import MailIcon from "@mui/icons-material/Mail";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginBottom: 20,
  [theme.breakpoints.up("sm")]: {
    width: "396px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
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
    [theme.breakpoints.up("md")]: {
      width: "340px",
    },
  },
}));

const LinkStyle = {
  textDecoration: "none",
  color: "white",
};

// const Img = styled("img")(({ theme }) => ({
//   width: "100%",
//   borderRadius: 5,
//   "&:hover": {
//     opacity: 0.8,
//   },
// }));

const Btn = styled(Button)(({ theme }) => ({
  activeButton: {
    borderBottom: "2px solid #fff",
    borderRadius: "2px",
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
  width: 450,
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
  background: "#202020",
};

const modalstyle2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
  background: "#202020",
};

function UserPage() {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles?.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    type: "image",
    noClick: true,
    noKeyboard: true,
    accept: "image/jpeg, image/png",
  });

  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const { userId } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [profile, setProfile] = useState();
  const [profileOne, setProfileOne] = useState();
  // const [image, setImage] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedProfile, setIsLoadedProfile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [activity, setActivity] = useState();
  const [reverse, setReverse] = useState(true);

  useEffect(() => {
    fetch(`/api/auth/get_user_header/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(() => {
            setProfile(result);
            setIsLoadedProfile(true);
          }, 2000);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/auth/get_user`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(() => {
            setProfileOne(result);
            setIsLoadedProfile(true);
          }, 2000);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/activity/get_activity/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(() => {
            setActivity(result);
          }, 2000);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [post, setPost] = useState();
  const [postAll, setPostAll] = useState();

  const getPost = useCallback(async () => {
    try {
      await axios
        .get(`/api/post/get_post_user/${window.location.pathname.slice(6)}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) =>
          setTimeout(() => {
            setPost(response.data);
            setIsLoaded(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPost();
  }, []);

  const getPostAll = useCallback(async () => {
    try {
      await axios
        .get(`/api/post/get_post_all`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) =>
          setTimeout(() => {
            setPostAll(response.data);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPostAll();
  }, []);

  const [openUpload, setOpenUpload] = React.useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

  const [openUpload2, setOpenUpload2] = React.useState(false);
  const handleOpen2 = () => setOpenUpload2(true);
  const handleClose2 = () => setOpenUpload2(false);

  const [form, setForm] = useState({
    user_id: `${userId}`,
    nickname: "",
    firstName: "",
    secondName: "",
    login: "",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const updateProfile = async () => {
    if (form.nickname === "") {
      form.nickname = profile.find((item) => item.id === userId).nickname;
    }
    if (form.firstName === "") {
      form.firstName = profile.find((item) => item.id === userId).firstName;
    }
    if (form.secondName === "") {
      form.secondName = profile.find((item) => item.id === userId).secondName;
    }
    if (form.login === "") {
      form.login = profile.find((item) => item.id === userId).login;
    }
    if (files.length != 0)
    {
      createImage();
    }
    try {
      await axios.put(
        "/api/auth/update_user",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (e) {
      console.log(e);
    }
  };

  const [sub, setSub] = useState({
    subscribes_id: `${userId}`,
    subscribes_to: window.location.pathname.slice(6),
  });

  const createSubscribe = async () => {
    try {
      await axios.post(
        "/api/subscribes/create_subscribe",
        { ...sub },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteSubscribe = async () => {
    try {
      await axios.post(
        "/api/subscribes/delete_subscribes",
        { ...sub },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (e) {
      console.log(e);
    }
  };

  const [subs, setSubs] = useState();
  const [subsLoad, setSubsLoad] = useState(false);
  const getSubs = useCallback(async () => {
    try {
      await axios
        .get(
          `/api/subscribes/get_subscribes_list/${window.location.pathname.slice(
            6
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) =>
          setTimeout(() => {
            setSubs(response.data);
            setSubsLoad(true);
          }, 2000)
        );
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getSubs();
  }, []);

  const [dia, setDia] = useState();

  const getDia = useCallback(async () => {
    try {
      await axios
        .get(`/api/chat/get_dialog/${window.location.pathname.slice(6)}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setDia(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getDia();
  }, [dia]);

  const createImage = async () => {
    let formData = new FormData();

    files?.map((item) => {
      formData.append("image", item);
      formData.append("id", userId);
    });

    try {
      axios.post(`/api/image/create_image/${userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  var date = new Date();

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    time: "numeric",
  };

  const createStatic = () => {
    let sumWatch = 0;
    post.forEach((item) => (sumWatch += item.count_watch));

    let sumLike = 0;
    post.forEach((item) => (sumLike += item.count_like));

    let sumCom = 0;
    post.forEach((item) => (sumCom += item.count_comments));
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: `Отчёт по статистике пользователя: ${profile.map(
                  (item) => item.nickname
                )}`,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                color: "000000",
                spacing: {
                  after: 200,
                },
              }),

              new Paragraph({
                text: `Дата: ${date.toLocaleString("ru", options)}`,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                color: "000000",
                spacing: {
                  after: 200,
                },
              }),

              new Paragraph({
                text: `Количество постов: ${post.length}`,
                alignment: AlignmentType.LEFT,
                color: "000000",
              }),

              new Paragraph({
                text: `Количество подписчиков: ${subs.length}`,
                alignment: AlignmentType.LEFT,
                color: "000000",
              }),

              new Paragraph({
                text: `Общее количество просмотров: ${sumWatch}`,
                alignment: AlignmentType.LEFT,
                color: "000000",
              }),

              new Paragraph({
                text: `Общее количество лайков: ${sumLike}`,
                alignment: AlignmentType.LEFT,
                color: "000000",
              }),

              new Paragraph({
                text: `Общее количество комментариев: ${sumCom}`,
                alignment: AlignmentType.LEFT,
                color: "000000",
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Статистика.docx");
      });
    } catch (error) {
      console.log(error);
    }
  };

  let sumWatch = 0;
  post?.forEach((item) => (sumWatch += item.count_watch));

  let sumLike = 0;
  post?.forEach((item) => (sumLike += item.count_like));

  let sumCom = 0;
  post?.forEach((item) => (sumCom += item.count_comments));

  const [dialog, setDialog] = useState({
    user_from_id: userId,
    user_to_id: window.location.pathname.slice(6),
  });

  const createDialog = async () => {
    if (dia.find((d) => d.user_from_id === userId || d.user_to_id == userId)) {
      window.location.href = "/chat";
    } else {
      dialog.user_to_id = window.location.pathname.slice(6);
      try {
        setTimeout(() => {
          window.location.href = "/chat";
        }, 2000);
        await axios.post(
          "/api/chat/create_dialog",
          { ...dialog },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <>
      <Modal open={openUpload} onClose={handleClose}>
        <Box sx={modalstyle}>
          <Grid
            container
            sx={{
              height: "max-content",
              width: "max-content",
              lineHeight: "20px",
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Редактирование профиля
            </Typography>
          </Grid>
          <Grid item sx={{ mb: 1 }}>
            <Typography
              component="span"
              sx={{
                fontSize: "14px",
              }}
            >
              Фотография
            </Typography>
            <Grid container sx={{ alignItems: "center" }}>
              <Avatar
                alt="avatar"
                src={`${profile?.map((item) => item.avatar)}`}
                sx={{
                  width: 80,
                  height: 80,
                  Maxwidth: 80,
                  Maxheight: 80,
                  Minwidth: 80,
                  Minheight: 80,
                  my: "5px",
                }}
              />
              <input
                type="file"
                hidden
                name="image"
                id="file"
                accept="image/gif , image/png , image/jpeg"
                {...getInputProps()}
              />
              <Button
                onClick={open}
                sx={{
                  backgroundColor: "#8f8f8f",
                  color: "white",
                  ml: 2,
                  boxShadow: "1px 1px 5px 0px black",
                }}
              >
                Изменить
              </Button>
            </Grid>
          </Grid>
          <Grid item sx={{ mb: 1 }}>
            <TextFieldd
              sx={{
                width: "100%",
                lineHeight: "20px",
                mb: 1,
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
              label="Никнейм"
              name="nickname"
              variant="filled"
              defaultValue={profile?.map((item) => item.nickname)}
              onChange={changeHandler}
            />
          </Grid>
          <Grid item>
            <TextFieldd
              sx={{
                width: "100%",
                lineHeight: "20px",
                mb: 1,
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
              label="Email"
              name="login"
              variant="filled"
              defaultValue={profile?.map((item) => item.login)}
              onChange={changeHandler}
            />
          </Grid>
          <Grid item sx={{ textAlign: "center" }}>
            <Button
              sx={{
                mt: 1,
                p: 0,
                height: "40px",
                textAlign: "center",
                boxShadow: "1px 1px 5px 0px black",
              }}
              variant="contained"
              component="span"
              color="secondary"
              onClick={updateProfile}
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
                Обновить
              </Typography>
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Box>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mb: "15px",
            mt: "100px",
            alignItems: "center",
            width: "max-content",
          }}
        >
          <Avatar
            alt="avatar"
            src={`${profile?.map((item) => item.avatar)}`}
            sx={{ width: 150, height: 150, my: "5px" }}
          />
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "max-content",
              ml: "3px",
            }}
          >
            <Grid
              item
              sx={{
                ml: "auto",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {profile?.map((item) => item.nickname)}
              </Typography>
            </Grid>
            <Grid item>
              {profile?.map((item) =>
                item.id === userId ? (
                  <Button
                    onClick={handleOpen}
                    sx={{
                      color: "white",
                      minWidth: "30px",
                      ".MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <SettingsIcon />
                  </Button>
                ) : null
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ my: "5px" }}>
            <Grid item sx={{ width: "max-content" }}>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                {sumLike} лайков
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mx: "5px",
                  color: "white",
                }}
              >
                |
              </Typography>
            </Grid>
            <Grid item sx={{ width: "max-content" }}>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                {sumWatch} просмотров
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mx: "5px",
                  color: "white",
                }}
              >
                |
              </Typography>
            </Grid>
            <Grid item sx={{ width: "max-content" }}>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "white",
                }}
              >
                {subs?.length}
              </Typography>
              <Typography
                onClick={handleOpen2}
                variant="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "white",
                  ml: "5px",
                  cursor: "pointer",
                }}
              >
                подписчиков
              </Typography>
            </Grid>
            <Grid item sx={{ width: "max-content" }}>
              <Typography
                variant="span"
                sx={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "white",
                  ml: "5px",
                  cursor: "pointer",
                }}
              >
                {profile?.map((item) =>
                  item.id === userId ? (
                    <DownloadIcon to="" onClick={() => createStatic()} />
                  ) : null
                )}
              </Typography>
            </Grid>
          </Grid>
          <Modal open={openUpload2} onClose={handleClose2}>
            <Box sx={modalstyle2}>
              <Typography
                sx={{
                  display: "flex",
                  fontWeight: 400,
                  fontSize: "18px",
                  alignItems: "center",
                  color: "white",
                  mx: "auto",
                  width: "max-content",
                  "a:-webkit-any-link": {
                    textDecoration: "none",
                    color: "white",
                  },
                }}
              >
                Подписчики
              </Typography>
              {subsLoad
                ? subs?.map((item) => (
                    <Box key={item.id}>
                      <Grid container sx={{ alignItems: "center" }}>
                        <Grid
                          item
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: "10px",
                          }}
                        >
                          {isLoadedProfile
                            ? profileOne?.map((usr) =>
                                usr.id == item.subscribes_id ? (
                                  <Avatar
                                    alt="avatar"
                                    src={`${usr.avatar}`}
                                    sx={{ width: 40, height: 40, mr: "5px" }}
                                  />
                                ) : null
                              )
                            : null}
                          <Typography
                            sx={{
                              display: "flex",
                              fontWeight: 400,
                              fontSize: "18px",
                              alignItems: "center",
                              color: "white",
                              mx: "auto",
                              width: "max-content",
                              "a:-webkit-any-link": {
                                textDecoration: "none",
                                color: "white",
                              },
                            }}
                          >
                            <Link
                              to={`/user/${item.subscribes_id}`}
                              onClick={() =>
                                setTimeout(() => {
                                  window.location.reload();
                                }, 100)
                              }
                            >
                              {isLoadedProfile
                                ? profileOne?.map((usr) =>
                                    usr.id == item.subscribes_id
                                      ? usr.nickname
                                      : null
                                  )
                                : null}
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                : null}
            </Box>
          </Modal>

          {profile?.map((item) =>
            item.id === userId ? (
              <Box key={item.id}></Box>
            ) : subs?.length === 0 ? (
              <>
                <Grid
                  sx={{
                    display: "inline-flex",
                    height: "35px",
                    mt: "10px",
                    ml: "60px",
                  }}
                >
                  <Button
                    onClick={createSubscribe}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      color: "black",
                    }}
                  >
                    <AddIcon />
                    Подписаться
                  </Button>
                  <IconButton
                    size="large"
                    aria-label="show new mails"
                    color="inherit"
                    sx={{ ml: 1 }}
                    onClick={() =>
                      setTimeout(() => {
                        createDialog();
                      }, 100)
                    }
                  >
                    <Badge
                      badgeContent={0}
                      sx={{
                        color: "#f0f0f0",
                      }}
                    >
                      <MailIcon />
                    </Badge>
                  </IconButton>
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  sx={{ display: "inline-flex", height: "35px", mt: "10px" }}
                >
                  {subs?.find((sbs) => sbs.subscribes_id == userId) ? (
                    <>
                      <Button
                        onClick={deleteSubscribe}
                        sx={{
                          backgroundColor: "#adadad",
                          color: "black",
                        }}
                      >
                        Отписаться
                      </Button>
                      <IconButton
                        size="large"
                        aria-label="show new mails"
                        color="inherit"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          setTimeout(() => {
                            createDialog();
                          }, 100)
                        }
                      >
                        <Badge
                          badgeContent={0}
                          sx={{
                            color: "#f0f0f0",
                          }}
                        >
                          <MailIcon />
                        </Badge>
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={createSubscribe}
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "black",
                        }}
                      >
                        <AddIcon />
                        Подписаться
                      </Button>
                      <IconButton
                        size="large"
                        aria-label="show new mails"
                        color="inherit"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          setTimeout(() => {
                            createDialog();
                          }, 100)
                        }
                      >
                        <Badge badgeContent={0} color="secondary">
                          <MailIcon />
                        </Badge>
                      </IconButton>
                    </>
                  )}
                </Grid>
              </>
            )
          )}

          <ButtonGroup variant="string" sx={{ mt: "10px", color: "white" }}>
            <Btn
              //  sx={{activeButton === "first" ? {fontSize:'16px'} : ""}}
              name="first"
              onClick={() => setIsLike(false)}
            >
              Публикации
            </Btn>
            <Btn
              // className={activeButton === "second" ? `${classes.activeButton}` : ""}
              name="second"
              onClick={() => setIsLike(true)}
            >
              Избранное
            </Btn>
          </ButtonGroup>
        </Container>
        <Box
          sx={{
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "1920%",
            mx: 0,
            px: 0,
            borderBottom: "1px solid #ccc",
          }}
        />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ my: "3px" }}
        >
          <Grid item sx={{ mx: "15px" }}>
            <FormControl sx={{ m: 0, minWidth: "100%" }}>
              <Select
                sx={{
                  height: "50px",
                  border: "none",
                  outline: "none",
                  fontWeight: "500",
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgb(255 255 255 / 0%)",
                  },
                }}
                value={value}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem
                  sx={{ fontWeight: "500" }}
                  value={""}
                  onClick={() => setReverse(true)}
                >
                  Новое
                </MenuItem>
                <MenuItem
                  sx={{ fontWeight: "500" }}
                  value={"Старое"}
                  onClick={() => setReverse(false)}
                >
                  Старое
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {isLike ? (
          <Box sx={{ m: "80px", width: "auto" }}>
            <Grid
              container
              spacing={3}
              columns={{ xs: 4, sm: 8, md: 6 }}
              rowSpacing={2}
              columnSpacing={2}
              sx={{ justifyContent: "center" }}
            >
              {postAll
                .slice(0)
                .reverse()
                ?.map((item) =>
                  activity?.map((act) =>
                    item.id == act.post_id ? (
                      act.like == 1 ? (
                        <LikeCard key={item.id} todo={item} />
                      ) : null
                    ) : null
                  )
                )}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ m: "80px", width: "auto" }}>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 6 }}
              rowSpacing={3}
              columnSpacing={3}
              sx={{ justifyContent: "center" }}
            >
              {reverse
                ? post
                    .slice(0)
                    .reverse()
                    ?.map((item) => <MainCard key={item.id} todo={item} />)
                : post?.map((item) => <MainCard key={item.id} todo={item} />)}
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}

export default UserPage;
