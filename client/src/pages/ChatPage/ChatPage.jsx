import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Modal,
  CircularProgress,
  ImageList,
  IconButton,
  styled,
  ImageListItem,
  FormGroup,
  Container,
  Link,
  Menu,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import Message from "../../components/Message";
import MessageGroup from "../../components/MessageGroup";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import { AuthContext } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";

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

const LinkStyle = {
  textDecoration: "none",
  color: "white",
};

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "300px",
    sm: "400px",
  },
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
  backgroundColor: "#404040",
};

const modalstyle2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "300px",
    sm: "540px",
  },
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  height: "max-content",
  color: "white",
  backgroundColor: "#404040",
};

function ChatPage() {
  const [value, setValue] = React.useState("");
  const [files, setFiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [room, setRoom] = useState(0);
  const [roomGroup, setRoomGroup] = useState(0);
  const [dialog, setDialog] = useState([]);
  const [message, setMessage] = useState();
  const [progress, setProgress] = useState(0);
  const [usersId, setUsersId] = useState(0);
  const [users, setUsers] = useState();
  const [subs, setSubs] = useState();
  const [isDialog, setIsDialog] = useState();
  const [roomGrp, setRoomGrp] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // setStickers(['../Stickers/sticker.webp'])
  function importAll(r) {
    return r.keys().map(r);
  }

  const stickers = importAll(require.context("../../Stickers/"));

  const openStickClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const StickClose = () => {
    setAnchorEl(null);
  };

  const ref = useRef();
  const handleClick = useCallback(() => {
    ref.current.value = "";
  }, []);

  const handleClick2 = useCallback(() => {
    ref.current.value = "";
  }, []);

  const [group, setGroup] = useState();
  const [groupM, setGroupM] = useState();
  const [groupN, setGroupN] = useState();

  const getStat = useCallback(async () => {
    try {
      await axios
        .get(`/api/group_chat/get_users/${roomGrp}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setGroup(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getStat();
  }, [group]);

  const getStat2 = useCallback(async () => {
    try {
      await axios
        .get(`/api/group_chat/get_message/${roomGrp}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setGroupM(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getStat2();
  }, [groupM]);

  const getStat3 = useCallback(async () => {
    try {
      await axios
        .get(`/api/group_chat/get_user_message/${roomGrp}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setGroupN(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getStat3();
  }, [groupN]);

  const createStatic = async (id, name) => {
    let us = groupN.map((n) => ` ${n.nickname}`);
    setTimeout(() => {
      try {
        const doc = new Document({
          sections: [
            {
              children: [
                new Paragraph({
                  text: `Статистика по групповому чату: "${name}"`,
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
                  text: `Количество собеседников: ${group.length}`,
                  alignment: AlignmentType.LEFT,
                  color: "000000",
                }),

                new Paragraph({
                  text: `Количество сообщений: ${groupM.length}`,
                  alignment: AlignmentType.LEFT,
                  color: "000000",
                }),

                new Paragraph({
                  text: `Участники:${groupN.map((n) => ` ${n.nickname}`)}`,
                  alignment: AlignmentType.LEFT,
                  color: "000000",
                }),
              ],
            },
          ],
        });

        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, "Групповой чат.docx");
        });
      } catch (error) {
        console.log(error);
      }
    }, 7000);
  };

  const [openUpload, setOpenUpload] = useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

  const [openUpload2, setOpenUpload2] = React.useState(false);
  const handleOpen2 = () => setOpenUpload2(true);
  const handleClose2 = () => setOpenUpload2(false);

  const { userId } = useContext(AuthContext);

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
    accept:
      "image/jpeg, image/png, image/gif, application/pdf, application/msword, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    onDrop,
  });

  const [img, setImg] = React.useState("");

  const handleChange = (event) => {
    setImg(event.target.value);
  };

  const RemoD = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles); // update the state
  };

  const Clear = () => {
    setFiles([]); // update the state
  };

  const getDialog = useCallback(async () => {
    try {
      await axios
        .get(`/api/chat/get_dialog/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setDialog(response.data));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getDialog();
  }, [dialog]);

  const getGroup = useCallback(async () => {
    try {
      await axios
        .get(`/api/group_chat/get_group/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setRoomGroup(response.data));
      setIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getGroup();
  }, [roomGroup]);

  useEffect(() => {
    fetch(`/api/auth/get_user`)
      .then((res) => res.json())
      .then(
        (result) => {
          setUsers(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/subscribes/get_subscribes/${userId}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setSubs(result);
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

  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  var date = new Date();

  const [form, setForm] = useState({
    user_from_id: userId,
    user_to_id: "",
    dialog_id: room,
    message: "",
    date_publication: date.toLocaleString("ru", options),
    search: "",
    group_id: roomGrp,
    stickers: "",
    isActivity: "",
  });

  const openChat = (roomId, userId) => {
    setRoom(roomId);
    setRoomGrp(0);
    setUsersId(userId);
    setIsDialog(true);
  };

  const openChatGroup = (roomId, userId) => {
    setRoomGrp(roomId);
    setIsDialog(false);
  };

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const changeHandlerClear = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const sendMessage = async () => {
    form.dialog_id = room;
    form.user_to_id = dialog.find((item) => item.id === room).user_to_id;
    sendNotify();
    if (files.length === 0) {
      try {
        await axios.post(
          "/api/chat/create_message",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else createImage();
  };

  const sendNotify = async () => {
    form.dialog_id = room;
    form.user_to_id =
      dialog.find((item) => item.id === room).user_from_id === userId
        ? dialog.find((item) => item.id === room).user_to_id
        : dialog.find((item) => item.id === room).user_from_id;
    form.isActivity = 0;

    console.log(
      dialog.find((item) => item.id === room).user_from_id === userId
        ? dialog.find((item) => item.id === room).user_to_id
        : dialog.find((item) => item.id === room).user_from_id
    );

    try {
      await axios.post(
        "/api/notify/create_notify",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const createImage = async () => {
    let formData = new FormData();

    files?.map((item) => {
      formData.append("image", item);
      formData.append("id", userId);
    });

    formData.append("dialog_id", room);
    formData.append(
      "user_to_id",
      dialog.find((item) => item.id === room).user_to_id
    );
    formData.append("user_from_id", userId);
    formData.append("message", form.message);
    formData.append("date_publication", form.date_publication);
    try {
      axios.post(`/api/chat/create_message_and_image`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Clear();
    } catch (e) {
      console.log(e);
    }
  };

  const createStickerImage = async (ref) => {
    form.dialog_id = room;
    form.user_to_id = dialog.find((item) => item.id === room).user_to_id;
    form.stickers = ref;

    if (files.length === 0) {
      try {
        await axios.post(
          "/api/chat/create_sticker",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else createImage();
  };

  const createStickerGroup = async (ref) => {
    form.group_id = roomGrp;
    form.user_from_id = userId;
    form.stickers = ref;

    if (files.length === 0) {
      try {
        await axios.post(
          "/api/group_chat/create_sticker",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else createImage();
  };

  const sendMessageGroup = async () => {
    form.group_id = roomGrp;
    form.user_from_id = userId;

    if (files.length === 0) {
      try {
        await axios.post(
          "/api/group_chat/create_message",
          { ...form },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else createImageGroup();
  };

  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        sendMessage();
        handleClick();
      }
    },
    [sendMessage, handleClick]
  );

  const onKeyDownGroup = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        sendMessageGroup();
        handleClick2();
      }
    },
    [sendMessageGroup, handleClick2]
  );

  const createImageGroup = async () => {
    let formData = new FormData();

    files?.map((item) => {
      formData.append("image", item);
      formData.append("id", userId);
    });

    formData.append("group_id", roomGrp);
    formData.append("user_from_id", userId);
    formData.append("message", form.message);
    formData.append("date_publication", form.date_publication);
    try {
      axios.post(`/api/group_chat/create_message_and_image`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Clear();
    } catch (e) {
      console.log(e);
    }
  };

  const createGroup = async () => {
    setOpenUpload(false);
    try {
      await axios.post(
        "/api/group_chat/create_group",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [userData, setUserData] = useState({
    user_id: "",
    group_id: roomGrp,
  });

  const inviteUser = async (usr) => {
    userData.user_id = usr;
    userData.group_id = roomGrp;

    try {
      await axios.post(
        "/api/group_chat/add_user",
        { ...userData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClickAlert = (g, n) => {
    setOpenAlert(true);
    setTimeout(() => {
      createStatic(g, n);
    }, 3000);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

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

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message=" Генерация статистики"
        action={action}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          Генерация статистики, пожалуйста подождите
        </Alert>
      </Snackbar>
      <Modal
        open={openUpload}
        onClose={handleClose}
        sx={{
          background:
            "linear-gradient(34deg, rgb(126 139 255 / 70%) 0%, rgb(255 255 255 / 70%) 100%)",
          color: "#7e8bff",
        }}
      >
        <Box sx={modalstyle}>
          <Grid
            container
            sx={{
              width: "400px",
              height: "auto",
              flexDirection: "column",
            }}
          >
            <Grid item>
              <Typography
                sx={{ fontSize: "18px", fontWeight: "600", mb: "5px" }}
              >
                Создание группы
              </Typography>
              <TextField
                multiline
                rows={1}
                placeholder="Название"
                name="name_chat"
                onChange={changeHandler}
                sx={{
                  border: "none",
                  outline: "none",
                  reSize: "none",
                  backgroundColor: "#323232",
                  color: "#fff",
                  width: {
                    xs: "300px",
                    sm: "100%",
                  },
                  fontSize: "100%",
                  height: "auto",
                  borderRadius: "0px",

                  ".MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    borderColor: "rgb(0 0 0 / 0%)",
                    color: "white",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "0px",
                    borderColor: "rgb(0 0 0 / 0%)",
                  },
                }}
              />

              <Button
                sx={{
                  p: 0,
                  height: "40px",
                  textAlign: "center",
                  boxShadow: "1px 1px 5px 0px black",
                  m: {
                    xs: "10px 20px 0px 120px",
                    sm: "10px 20px 0px 170px",
                  },
                }}
                variant="contained"
                component="span"
                color="secondary"
                type="button"
                onClick={createGroup}
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
                  Создать
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={openUpload2}
        onClose={handleClose2}
        sx={{
          background:
            "linear-gradient(34deg, rgb(126 139 255 / 70%) 0%, rgb(255 255 255 / 70%) 100%)",
          color: "#7e8bff",
        }}
      >
        <Box sx={modalstyle2}>
          <Grid
            container
            sx={{
              width: {
                xs: "300px",
                sm: "540px",
              },
              height: "auto",
              flexDirection: "column",
            }}
          >
            <Grid item>
              <h3>Добавить участника</h3>
              <TextField
                multiline
                rows={1}
                placeholder="Никнейм"
                name="search"
                onChange={changeHandler}
                sx={{
                  border: "none",
                  outline: "none",
                  reSize: "none",
                  backgroundColor: "#323232",
                  color: "#fff",
                  width: {
                    xs: "300px",
                    sm: "100%",
                  },
                  fontSize: "100%",
                  height: "auto",
                  borderRadius: "0px",

                  ".MuiOutlinedInput-root": {
                    borderRadius: "0px",
                    borderColor: "rgb(0 0 0 / 0%)",
                    color: "white",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "0px",
                    borderColor: "rgb(0 0 0 / 0%)",
                  },
                }}
              />
              {users?.map((i) =>
                form.search != "" ? (
                  ~i.nickname?.indexOf(form.search) ? (
                    <>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "18px",
                          alignItems: "center",
                          color: "white",
                          my: "18px",
                          width: "max-content",
                          flexDirection: "column",
                          "a:-webkit-any-link": {
                            textDecoration: "none",
                            color: "white",
                          },
                        }}
                      >
                        <Grid container sx={{ alignItems: "center" }}>
                          <Grid
                            item
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: {
                                xs: "150px",
                                sm: "250px",
                              },
                            }}
                          >
                            <Link style={LinkStyle} to={`/user/${i.user_id}`}>
                              {i.nickname}
                            </Link>
                          </Grid>
                          <Grid item sx={{ height: "35px" }}>
                            <Button
                              sx={{
                                p: 0,
                                ml: {
                                  xs: "50px",
                                  sm: "195px",
                                },
                                height: "40px",
                                textAlign: "center",
                                boxShadow: "1px 1px 5px 0px black",
                              }}
                              variant="contained"
                              component="span"
                              color="secondary"
                              type="button"
                              onClick={() => inviteUser(i.id)}
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
                                Пригласить
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      </Typography>
                    </>
                  ) : null
                ) : null
              )}

              {subs?.map((i) =>
                users?.map((usr) =>
                  usr.id === i.subscribes_id ? (
                    <>
                      <Typography
                        sx={{
                          display: "flex",
                          fontWeight: 400,
                          fontSize: "18px",
                          alignItems: "center",
                          color: "white",
                          my: "18px",
                          width: "max-content",
                          flexDirection: "column",
                          "a:-webkit-any-link": {
                            textDecoration: "none",
                            color: "white",
                          },
                        }}
                      >
                        <Grid container sx={{ alignItems: "center" }}>
                          <Grid
                            item
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: {
                                xs: "150px",
                                sm: "250px",
                              },
                            }}
                          >
                            <Link style={LinkStyle} to={`/user/${i.user_id}`}>
                              {usr.nickname}
                            </Link>
                          </Grid>
                          <Grid item sx={{ height: "35px" }}>
                            <Button
                              sx={{
                                p: 0,
                                ml: {
                                  xs: "50px",
                                  sm: "195px",
                                },
                                height: "40px",
                                textAlign: "center",
                                boxShadow: "1px 1px 5px 0px black",
                              }}
                              variant="contained"
                              component="span"
                              color="secondary"
                              type="button"
                              onClick={() => inviteUser(usr.id)}
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
                                Пригласить
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      </Typography>
                    </>
                  ) : null
                )
              )}
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Box container id="msg_container">
        <Grid
          container
          sx={{
            ml: {
              xs: "0px",
              sm: "260px",
            },
            mt: {
              xs: "55px",
              sm: "100px",
            },
            width: "1500px",
            height: "50px",
            flexDirection: "row",
          }}
        >
          <Grid
            item
            sx={{
              backgroundColor: "#2e3035",
              borderRight: "1px solid #232326",
              height: "100%",
              flex: "0 1 55px",
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                width: {
                  xs: "130px",
                  sm: "465px",
                },
                borderBottom: "1px solid #232326",
                height: "50px",
              }}
            >
              <Typography
                sx={{
                  height: "100%",
                  color: "white",
                  width: "425px",
                  mt: "15px",

                  textAlign: "center",
                }}
              >
                Диалоги
              </Typography>
              <Button sx={{ minWidth: "30px" }} onClick={() => handleOpen()}>
                <AddBoxIcon sx={{ fontSize: "35px" }} />
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              backgroundColor: "#2e3035",
              borderBottom: "1px solid #232326",
              borderRight: "1px solid #232326",
              padding: "0 20px",
              height: "100%",
              flex: "0 1 55px",
            }}
          >
            <Box>
              <Typography
                sx={{
                  height: "100%",
                  color: "white",
                  width: {
                    xs: "220px",
                    sm: "893px",
                  },
                  m: "13px 0px",
                }}
              >
                {roomGrp ? (
                  <>
                    {roomGroup?.map((i) =>
                      i.group_id === roomGrp ? (
                        <Typography
                          sx={{
                            height: "100%",
                            mt: "15px",
                            color: "white",
                            m: "-13px 0px",
                          }}
                          //onClick={() => openChatGroup(i.group_id, userId)}
                        >
                          {i.name_chat}
                          <Button
                            sx={{ minWidth: "30px", ml: "5px" }}
                            onClick={() => handleOpen2()}
                          >
                            <AddReactionIcon sx={{ fontSize: "35px" }} />
                          </Button>
                          {group.length === 0 ? null : groupM.length ===
                            0 ? null : groupN.length === 0 ? null : (
                            <Button
                              sx={{ minWidth: "30px", ml: "5px" }}
                              onClick={() =>
                                handleClickAlert(i.group_id, i.name_chat)
                              }
                            >
                              Статистика
                            </Button>
                          )}
                        </Typography>
                      ) : null
                    )}
                  </>
                ) : (
                  <>
                    {users?.map((usr) =>
                      usr.id === usersId ? (
                        <Typography
                          sx={{ color: "white", display: "inline-block" }}
                        >
                          {usr.nickname}
                        </Typography>
                      ) : null
                    )}
                  </>
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          id="msg_list"
          sx={{
            margin: "0px auto 0 -700px",
            width: {
              xs: "392px",
              sm: "1398px",
            },
            position: "absolute",
            right: "auto",
            ml: {
              xs: "0px",
              sm: "260px",
            },
          }}
        >
          <Grid
            item
            sx={{
              backgroundColor: "#212124",
              height: "100%",
              width: "80px",
              float: "left",
              display: "flex",
              flexFlow: "column",
              top: "0",
              right: "0",
            }}
            xs={4}
          >
            {dialog?.map((item) =>
              users?.map((usr) =>
                usr.id === item.user_to_id && usr.id != userId ? (
                  <Box
                    sx={{
                      backgroundColor: "#2e3035",
                      borderBottom: "1px solid #232326",
                      borderRight: "1px solid #232326",
                      padding: "0 20px",
                      height: "auto",
                      flex: "0 1 55px",
                    }}
                  >
                    <Typography
                      sx={{ height: "100%", mt: "15px", color: "white" }}
                      onClick={() => openChat(item.id, usr.id)}
                    >
                      {usr.nickname}
                    </Typography>
                  </Box>
                ) : null
              )
            )}

            {roomGroup?.map((i) => (
              <Box
                sx={{
                  backgroundColor: "#2e3035",
                  borderBottom: "1px solid #232326",
                  borderRight: "1px solid #232326",
                  padding: "0 20px",
                  height: "auto",
                  flex: "0 1 55px",
                }}
              >
                <Typography
                  sx={{ height: "100%", mt: "15px", color: "white" }}
                  onClick={() => openChatGroup(i.group_id, userId)}
                >
                  {i.name_chat}
                </Typography>
              </Box>
            ))}

            {dialog?.map((item) =>
              users?.map((usr) =>
                usr.id === item.user_from_id && usr.id != userId ? (
                  <Box
                    sx={{
                      backgroundColor: "#2e3035",
                      borderBottom: "1px solid #232326",
                      borderRight: "1px solid #232326",
                      padding: "0 20px",
                      height: "auto",
                      flex: "0 1 55px",
                    }}
                  >
                    <Typography
                      sx={{ height: "100%", mt: "15px", color: "white" }}
                      onClick={() => openChat(item.id, usr.id)}
                    >
                      {usr.nickname}
                    </Typography>
                  </Box>
                ) : null
              )
            )}
          </Grid>
          {isDialog ? (
            <Grid
              item
              xs={8}
              sx={{
                backgroundColor: "#E1E1E1",
                height: {
                  xs: "650px",
                  sm: "810px",
                },
              }}
            >
              {room === 0 ? null : (
                <>
                  <Grid
                    item
                    sx={{
                      position: "relative",
                      boxSizing: "border-box",
                      height: {
                        xs: "624px",
                        sm: "744px",
                      },
                      overflowY: "auto",
                    }}
                  >
                    <Message todo={room} />
                  </Grid>
                  <Container
                    sx={{
                      width: "100%",
                      backgroundColor: {
                        xs: "#dddddd",
                        sm: "#c3c3c38f",
                      },
                      display: "inline-block",
                      height: "auto",
                    }}
                  >
                    {files.map((file) => (
                      <Grid
                        key={file.path}
                        item
                        sx={{
                          width: "max-content",
                          display: "inline-block",
                          ml: "10px",
                          height: "auto",
                          pt: "8px",
                          pb: "4px",
                        }}
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
                  </Container>
                  <Grid item>
                    <FormGroup
                      sx={{
                        display: "flex",
                        height: "55px",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        multiline
                        rows={1}
                        placeholder="Написать.."
                        name="message"
                        onChange={changeHandler}
                        inputRef={ref}
                        onKeyDown={onKeyDown}
                        sx={{
                          border: "none",
                          outline: "none",
                          reSize: "none",
                          backgroundColor: "#323232",
                          color: "#fff",
                          width: "100%",
                          fontSize: "100%",
                          height: "auto",
                          borderRadius: "0px",

                          ".MuiOutlinedInput-root": {
                            borderRadius: "0px",
                            borderColor: "rgb(0 0 0 / 0%)",
                            color: "white",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderRadius: "0px",
                            borderColor: "rgb(0 0 0 / 0%)",
                          },
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
                        sx={{
                          height: "36px",
                          width: "41px",
                          minWidth: "40px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "120px",
                            sm: "150px",
                          },
                          zIndex: 2,
                        }}
                        variant="contained"
                        component="span"
                        aria-haspopup="true"
                        onClick={openStickClick}
                      >
                        <EmojiEmotionsIcon />
                      </Button>
                      <Menu
                        elevation={0}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={StickClose}
                        sx={{ ".MuiMenu-list": { background: "#000000ed" } }}
                      >
                        <ImageList
                          sx={{
                            width: 365,
                            height: 450,
                            justifyItems: "center",
                            "&::-webkit-scrollbar": {
                              width: 5,
                              borderRadius: "5px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "rgb(112 112 112)",
                              outline: "1px solid black",
                              borderRadius: "5px",
                            },
                          }}
                          cols={3}
                          rowHeight={100}
                          colWidth={100}
                        >
                          {stickers.map((item) => (
                            <ImageListItem key={item.img}>
                              <Box
                                component="img"
                                a
                                onClick={() =>
                                  createStickerImage(item.slice(21, 23))
                                }
                                sx={{
                                  objectFit: "contain",
                                  height: "100px",
                                  display: "inline-block",
                                  maxWidth: 100,
                                  width: "100px",
                                  overflow: "hidden",
                                }}
                                src={`${item}?fit=cover&auto=format`}
                                alt={item}
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Menu>
                      <Button
                        sx={{
                          height: "36px",
                          width: "41px",
                          minWidth: "40px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "77px",
                            sm: "100px",
                          },
                          zIndex: 2,
                        }}
                        variant="contained"
                        component="span"
                        rows={1}
                        onClick={open}
                      >
                        <AttachFileIcon />
                      </Button>
                      <Button
                        variant="contained"
                        component="span"
                        color="secondary"
                        onClick={() => {
                          sendMessage();
                          handleClick();
                        }}
                        sx={{
                          height: "36px",
                          width: "71px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "4px",
                            sm: "16px",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            lineHeight: "12px",
                            textTransform: "capitalize",
                          }}
                        >
                          Отправить
                        </Typography>
                      </Button>
                    </FormGroup>
                  </Grid>
                </>
              )}
            </Grid>
          ) : (
            //Групповушка
            <Grid
              item
              xs={8}
              sx={{
                backgroundColor: "#E1E1E1",
                height: {
                  xs: "650px",
                  sm: "810px",
                },
              }}
            >
              {roomGrp === 0 ? null : (
                <>
                  <Grid
                    item
                    sx={{
                      position: "relative",
                      boxSizing: "border-box",
                      height: {
                        xs: "624px",
                        sm: "744px",
                      },
                      overflowY: "auto",
                    }}
                  >
                    <MessageGroup todo={roomGrp} />
                  </Grid>
                  <Container
                    sx={{
                      width: "100%",
                      backgroundColor: {
                        xs: "#dddddd",
                        sm: "#c3c3c38f",
                      },
                      display: "inline-block",
                      height: "auto",
                    }}
                  >
                    {files.map((file) => (
                      <Grid
                        key={file.path}
                        item
                        sx={{
                          width: "max-content",
                          display: "inline-block",
                          ml: "10px",
                          height: "auto",
                          pt: "8px",
                          pb: "4px",
                        }}
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
                  </Container>
                  <Grid item>
                    <FormGroup
                      sx={{
                        display: "flex",
                        height: "55px",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        multiline
                        rows={1}
                        placeholder="Написать.."
                        name="message"
                        onChange={changeHandler}
                        inputRef={ref}
                        onKeyDown={onKeyDownGroup}
                        sx={{
                          border: "none",
                          outline: "none",
                          reSize: "none",
                          backgroundColor: "#323232",
                          color: "#fff",
                          width: "100%",
                          fontSize: "100%",
                          height: "auto",
                          borderRadius: "0px",

                          ".MuiOutlinedInput-root": {
                            borderRadius: "0px",
                            borderColor: "rgb(0 0 0 / 0%)",
                            color: "white",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            borderRadius: "0px",
                            borderColor: "rgb(0 0 0 / 0%)",
                          },
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
                        sx={{
                          height: "36px",
                          width: "41px",
                          minWidth: "40px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "120px",
                            sm: "150px",
                          },
                          zIndex: 2,
                        }}
                        variant="contained"
                        component="span"
                        aria-haspopup="true"
                        onClick={openStickClick}
                      >
                        <EmojiEmotionsIcon />
                      </Button>
                      <Menu
                        elevation={0}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={StickClose}
                        sx={{ ".MuiMenu-list": { background: "#000000ed" } }}
                      >
                        <ImageList
                          sx={{
                            width: 365,
                            height: 450,
                            justifyItems: "center",
                            "&::-webkit-scrollbar": {
                              width: 5,
                              borderRadius: "5px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "rgb(112 112 112)",
                              outline: "1px solid black",
                              borderRadius: "5px",
                            },
                          }}
                          cols={3}
                          rowHeight={100}
                          colWidth={100}
                        >
                          {stickers.map((item) => (
                            <ImageListItem key={item.img}>
                              <Box
                                onClick={() =>
                                  createStickerGroup(item.slice(21, 23))
                                }
                                component="img"
                                a
                                sx={{
                                  objectFit: "contain",
                                  height: "100px",
                                  display: "inline-block",
                                  maxWidth: 100,
                                  width: "100px",
                                  overflow: "hidden",
                                }}
                                src={`${item}?fit=cover&auto=format`}
                                alt={item}
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Menu>
                      <Button
                        sx={{
                          height: "36px",
                          width: "41px",
                          minWidth: "40px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "77px",
                            sm: "100px",
                          },
                          zIndex: 2,
                        }}
                        variant="contained"
                        component="span"
                        rows={1}
                        onClick={open}
                      >
                        <AttachFileIcon />
                      </Button>
                      <Button
                        variant="contained"
                        component="span"
                        color="secondary"
                        onClick={() => {
                          sendMessageGroup();
                          handleClick2();
                        }}
                        sx={{
                          height: "36px",
                          width: "71px",
                          textAlign: "center",
                          position: "absolute",
                          right: "0",
                          mr: {
                            xs: "4px",
                            sm: "16px",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            lineHeight: "12px",
                            textTransform: "capitalize",
                          }}
                        >
                          Отправить
                        </Typography>
                      </Button>
                    </FormGroup>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default ChatPage;

//  {
//    message.map((item) =>
//       item.user_from_id == userId ? (<h1>{item.message}</h1>) : (<h3>{item.message}</h3>)
//    )
//}
