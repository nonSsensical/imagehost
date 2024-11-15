import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  MenuItem,
  TextField,
  Grid,
  FormControl,
  Select,
  styled,
  CircularProgress,
  ImageList,
  ImageListItem,
  Link
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import GifBoxIcon from "@mui/icons-material/GifBox";
import bgImage from "../../post_bg.svg";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dateFormat, { masks } from "dateformat";

const LinkStyle = {
  textDecoration: "none",
  color: "white",
};

const StyledBox = styled(Box)(({ theme }) => ({
  position: "relative",

  [theme.breakpoints.up("xs")]: {
    width: "350px",
  },
  [theme.breakpoints.up("sm")]: {
    width: "780px",
  },
}));
function PostPage() {
  const [value, setValue] = React.useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState();
  const [post, setPost] = useState([]);
  const [activity, setActivity] = useState();
  const [users, setUsers] = useState();

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
    fetch(`/api/image/get_image/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/post/get_post_one/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(() => {
            setPost(result);
          }, 2000);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/auth/get_user_one/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setProfile(result);
          setIsLoaded(true);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`/api/activity/get_message/${window.location.pathname.slice(6)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setActivity(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const { userId } = useContext(AuthContext);

  const [progress, setProgress] = useState(0);

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

  const theme = useTheme();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [openUpload, setOpenUpload] = React.useState(false);
  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);

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
    user_id: "",
    post_id: window.location.pathname.slice(6),
    message: "",
    date_publication: date.toLocaleString("ru", options),
  });

  const changeHandler = (event) => {
      setForm({ ...form, [event.target.name]: event.target.value });
  };

  const createActivity = () => {
    form.user_id = userId;

    if (form.message.length > 140) {
      alert("Вы превысили ограничение по символам");
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 300);
      axios.post(
        "/api/activity/create_message",
        { ...form },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  };

  var limitvalue = 140;

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <>
      <Box
        id="all"
        sx={{
          height: "100%",
          backgroundSize: "cover",
          backgroundColor: "#06070d",
          backgroundImage: `url(${bgImage})`,
          mt: {
            xs: "20px",
            sm: "0px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //ml: "100px",
            //mr: "100px",
            pt: {
              xs:'50px',
              sm: '100px'
            },
          }}
        >
          <ImageList
            variant="masonry"
            sx={{ width: "auto", height: "auto" }}
            cols={1}
          >
            <ImageListItem
              key={items.label}
              sx={{ backgroundColor: "#15151a" }}
            >
              {items?.map((items) => (
                <Box
                  component="img"
                  a
                  key={items.id}
                  sx={{
                    objectFit: "cover",
                    height: "auto",
                    maxHeight: "700px",
                    width: {
                      xs: "350px",
                      sm: "auto",
                    },
                    display: "block",
                    m: "auto",
                    mb: "25px",
                  }}
                  src={`${items.ref}?fit=cover&auto=format`}
                  alt={items.label}
                />
              ))}
            </ImageListItem>
          </ImageList>
        </Box>

        <>
          <Box
            id="infoPodFoto"
            sx={{
              backgroundColor: "#06070d",
              position: "relative",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              float: "left",
              width: "100%",
            }}
          >
            <StyledBox
              id="spisok komponentov"
              sx={{ width: "780px", position: "relative" }}
            >
              <Box
                sx={{
                  margin: "16px 0 32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Grid
                  container
                  sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "min-content 1fr max-content",
                  }}
                >
                  <Grid
                    item
                    sx={{ mr: "16px", display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      component="a"
                      variant="span"

                      alt="logo"
                      src={`${profile?.slice(0, 1).map((item) => item.avatar)}`}
                      sx={{
                        display: "inline-flex",
                        width: 50,
                        height: 50,
                        mr: 1,
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      overflow: "hidden",
                      flexDirection: "column",
                      width: "700px",
                    }}
                  >
                    <Grid item>
                      <Typography
                        noWrap
                        sx={{
                          maxWidth: "none",
                          overflow: "hidden",
                          color: "white",
                          transform: "none",
                          fontWeight: 700,
                          lineHeight: 1.22,
                          letterSpacing: ".3px",
                          fontSize: "22px",
                          width: {
                            xs: "290px",
                            sm: "auto",
                          },
                        }}
                      >
                        {post?.map((item) => item.name)}
                      </Typography>
                    </Grid>

                    <Grid
                      container
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: {
                          xs: "flex-end",
                          sm: "space-between",
                        },
                        width: {
                          xs: "290px",
                          sm: "100%",
                        },
                      }}
                    >
                      <Grid
                        item
                        sx={{
                          flex: "1 1 auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Link
                          
                          href={`/user/${profile?.slice(0, 1).map((item) => item.id)}`}
                          sx={{
                            color: "white",
                            fontWeight: 500,
                            fontSize: "14px",
                            textDecoration: "underline",
                          }}
                        >
                          {profile?.slice(0, 1).map((item) => item.nickname)}
                        </Link>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{
                            ml: "auto",
                            pl: "80px",
                            mr: 1,
                            whiteSpace: "nowrap",
                            color: "white",
                            fontWeight: 400,
                            fontSize: "15px",
                          }}
                        >
                          Опубликовано:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{
                            whiteSpace: "nowrap",
                            color: "white",
                            fontWeight: 400,
                            fontSize: "15px",
                            mr: {
                              xs: "10px",
                              sm: "0px",
                            },
                          }}
                        >
                          {post?.map((item) =>
                            item.date_publication.slice(0, 10)
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <Grid
                container
                sx={{ m: "24px 0", display: "flex", alignItems: "center" }}
              >
                <Grid item sx={{ mr: 2 }}>
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: 400,
                      fontSize: "14px",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <FavoriteIcon />
                    {post?.map((item) => item.count_like)} Лайков
                  </Typography>
                </Grid>
                <Grid item sx={{ mr: 2 }}>
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: 400,
                      fontSize: "14px",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <ChatBubbleIcon />
                    {post?.map((item) => item.count_comments)} Комментариев
                  </Typography>
                </Grid>
                <Grid item sx={{ mr: 2 }}>
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: 400,
                      fontSize: "14px",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <VisibilityIcon />
                    {post?.map((item) => item.count_watch)} Просмотров
                  </Typography>
                </Grid>
              </Grid>

              <Box
                sx={{
                  transform: "translate(0)",
                  position: "relative",
                  wordWrap: "break-word",
                  mb: "24px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    letterSpacing: ".3px",
                    fontSize: "14px",
                    lineHeight: "26px",
                    color: "white",
                  }}
                >
                  {post?.map((i) => i.title)}
                </Typography>
              </Box>
            </StyledBox>
          </Box>

          <Box
            id="vsecomm"
            sx={{
              backgroundColor: "#06070d",
              position: "relative",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              float: "left",
              width: "100%",
            }}
          >
            <StyledBox
              id="comment"
              sx={{ width: "780px", position: "relative", mt: "26px" }}
            >
              <Grid
                container
                sx={{
                  mb: "16px",
                  height: "24px",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Grid
                  item
                  sx={{ mx: 2, display: "flex", flexDirection: "row" }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: 400,
                      fontSize: "16px",
                      alignItems: "center",
                      color: "white",
                      textTransform: "uppercase",
                      mr: 1,
                    }}
                  >
                    {post?.map((item) => item.count_comments)}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      fontWeight: 400,
                      fontSize: "16px",
                      alignItems: "center",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                  >
                    Комментариев
                  </Typography>
                </Grid>

                <Grid item sx={{ ml: "auto" }}>
                  <FormControl sx={{ m: 0, minWidth: "100%", display: "flex" }}>
                    <Select
                      sx={{
                        height: "24px",
                        border: "none",
                        outline: "none",
                        fontWeight: "500",
                        color: "white",
                        ".MuiSelect-icon": {
                          color: "white",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(0 0 0 / 0%)",
                        },
                      }}
                      value={value}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem sx={{ fontWeight: "500" }} value={""}>
                        Новое
                      </MenuItem>
                      <MenuItem sx={{ fontWeight: "500" }} value={"Старое"}>
                        Старое
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box
                sx={{
                  position: "relative",
                  border: "1px solid #585d6a",
                  boxSizing: "border-box",
                  borderRadius: "0px 0px 6px 6px",
                  mt: "23px",
                  mb: "16px",
                }}
              >
                <FormControl sx={{ display: "block", borderRadius: "0px" }}>
                  <Box
                    sx={{
                      minHeight: "90px",
                      backgroundColor: "transparent",
                      borderRadius: "0px",
                    }}
                  >
                    <TextField
                      multiline
                      rows={3}
                      placeholder="Написать комментарий"
                      name="message"
                      onChange={changeHandler}
                      value={form.message}
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
                    ></TextField>
                    <Grid
                      container
                      sx={{
                        p: "16px 16px",
                        display: "flex",
                        justifyContent: 'flex-end',
                        alignItems: "center",
                      }}
                    >
                      {/* <Grid item>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            lineHeight: "12px",
                            color: "#b4b9c2",
                            width: {
                              xs: "80px",
                              sm: "auto",
                            },
                          }}
                        >
                          Прочитать правила сообщества
                        </Typography>
                      </Grid> */}
                      <Grid item>
                        <Grid container sx={{ alignItems: "flex-end" }}>
                          {/* <Grid item sx={{ pr: "16px" }}>
                            <Typography sx={{ color: "white" }}>
                              <InsertPhotoIcon />
                            </Typography>
                          </Grid>
                          <Grid item sx={{ pr: "16px" }}>
                            <Typography sx={{ color: "white" }}>
                              <GifBoxIcon />
                            </Typography>
                          </Grid> */}
                          <Grid item sx={{ pr: "16px" }}>
                            <Typography
                              sx={{
                                color: "white",
                                width: "18px",
                                fontSize: "12px",
                                pb: "9px",
                              }}
                            >
                              {form.message.length > 140 ? ':(' : (140 - form.message.length)}
                            </Typography>
                          </Grid>
                          <Grid item sx={{ pr: "5px" }}>
                            <Button
                              variant="contained"
                              component="span"
                              color="secondary"
                              onClick={() => createActivity()}
                              sx={{
                                height: "36px",
                                width: "71px",
                                textAlign: "center",
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
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </FormControl>
              </Box>

              {activity?.map((item) => (
                <>
                  <Grid container>
                    <Grid
                      item
                      sx={{ m: "12px", display: "flex", alignItems: "center" }}
                    >
                     
                      <Typography
                        sx={{
                          display: "inline-flex",
                          fontWeight: 400,
                          fontSize: "14px",
                          alignItems: "center",
                          color: "#7e8bff",
                          mr: 2,
                        }}
                      >
                        {users?.map((usr) =>
                          usr.id == item.user_id ? usr.nickname : null
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          display: "inline-flex",
                          fontWeight: 400,
                          fontSize: "12px",
                          alignItems: "center",
                          color: "#959595",
                        }}
                      >
                        {item.date_publication}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    sx={{
                      display: "block",
                      fontWeight: 400,
                      fontSize: "16px",
                      alignItems: "center",
                      color: "white",
                      ml: "12px",
                      mb: 2,
                      wordWrap: "break-word",
                    }}
                  >
                    {item.message}
                  </Typography>
                </>
              ))}
            </StyledBox>
          </Box>
        </>
      </Box>
    </>
  );
}

export default PostPage;
