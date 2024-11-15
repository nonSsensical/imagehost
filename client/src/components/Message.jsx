import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { saveAs } from "file-saver";

const Message = ({ todo }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState();
  const [users, setUsers] = useState();
  const { userId } = useContext(AuthContext);

  const getPost = useCallback(async (room) => {
    try {
      await axios
        .get(`/api/chat/get_message/${room}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setMessage(response.data));
      setIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPost(todo);
  }, [message]);

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

  const SaveDocument = (todo) => {
    saveAs("./test.png", "example.png");
  };

  const type = [".doc", ".pdf", ".txt"];
  const typeImage = [".png", ".jpeg", ".jpg", ".gif"];

  return (
    <Grid item>
      {message?.map((item) =>
        item.dialog_id === todo ? (
          item.user_from_id === userId ? (
            <Box
              sx={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-end",
                my: 1,
              }}
            >
              {item.message === "" ? (
                <>
                  <Box
                    sx={{
                      color: "white",
                      textAlign: "right",
                      width: "fit-content",
                      backgroundColor: "#7D90CD",
                      mr: {
                        xs: "1px",
                        sm: "24px",
                      },
                      p: "10px",
                      borderRadius: "15px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        textAlign: "right",
                        width: "fit-content",
                        fontSize: "12px",
                      }}
                    >
                      {item.date_publication}
                    </Typography>
                    {item.img != null ? (
                      <>
                        {typeImage.map((i) =>
                          ~item?.img.indexOf(i) ? (
                            <>
                              <Box
                                component="img"
                                a
                                onClick={`http://95.188.86.184:5000` + item.img} //Кликабельную хуйню надо сделать
                                sx={{
                                  objectFit: "cover",
                                  height: "300px",
                                  display: "block",
                                  maxWidth: {
                                    xs: "230px",
                                    sm: "380px",
                                  },
                                  overflow: "hidden",
                                  width: "max-content",
                                }}
                                src={`${item.img}?fit=cover&auto=format`}
                                alt={item.label}
                              />
                            </>
                          ) : null
                        )}
                      </>
                    ) : null}

                    {item.stickers != null ? (
                      <>
                        <Box
                          component="img"
                          a
                          href={``} //Кликабельную хуйню надо сделать
                          sx={{
                            objectFit: "contain",
                            height: "300px",
                            display: "block",
                            maxWidth: {
                              xs: "230px",
                              sm: "380px",
                            },
                            overflow: "hidden",
                            width: "max-content",
                          }}
                          src={require(`../Stickers/sticker${item.stickers}.webp`)}
                          alt={item.label}
                        />
                      </>
                    ) : null}

                    {item.img != null ? (
                      <>
                        {type.map((i) =>
                          ~item?.img.indexOf(i) ? (
                            <a
                              href={`http://95.188.86.184:5000` + item.img} //Вместо localhost укажи пока что 95.188.86.184:5000, потом передалаю под норм
                              download={`http://95.188.86.184:5000` + item.img}
                            >
                              {item.img.split("/images/")}
                            </a>
                          ) : null
                        )}
                      </>
                    ) : null}
                  </Box>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      color: "white",
                      textAlign: "right",
                      width: "fit-content",
                      backgroundColor: "#7D90CD",
                      mr: {
                        xs: "1px",
                        sm: "24px",
                      },
                      p: "10px",
                      borderRadius: "15px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        textAlign: "right",
                        width: "fit-content",
                        fontSize: "12px",
                      }}
                    >
                      {item.date_publication}
                    </Typography>
                    {item.message}

                    {item.stickers != null ? (
                      <>
                        <Box
                          component="img"
                          a
                          href={``} //Кликабельную хуйню надо сделать
                          sx={{
                            objectFit: "contain",
                            height: "300px",
                            display: "block",
                            maxWidth: {
                              xs: "230px",
                              sm: "380px",
                            },
                            overflow: "hidden",
                            width: "max-content",
                          }}
                          src={require(`../Stickers/sticker${item.stickers}.webp`)}
                          alt={item.label}
                        />
                      </>
                    ) : null}

                    {item.img != null ? (
                      <>
                        {typeImage.map((i) =>
                          ~item?.img.indexOf(i) ? (
                            <>
                              <Box
                                component="img"
                                a
                                href={`http://95.188.86.184:5000` + item.img} //Кликабельную хуйню надо сделать
                                sx={{
                                  objectFit: "cover",
                                  height: "300px",
                                  display: "block",
                                  maxWidth: {
                                    xs: "230px",
                                    sm: "380px",
                                  },
                                  overflow: "hidden",
                                  width: "max-content",
                                }}
                                src={`${item.img}?fit=cover&auto=format`}
                                alt={item.label}
                              />
                            </>
                          ) : null
                        )}
                      </>
                    ) : null}

                    {item.img != null ? (
                      <>
                        {type.map((i) =>
                          ~item?.img.indexOf(i) ? (
                            <Box
                              a
                              component="a"
                              sx={{ display: "block" }}
                              href={`http://95.188.86.184:5000` + item.img} //Вместо localhost укажи пока что 95.188.86.184:5000, потом передалаю под норм
                              download={`http://95.188.86.184:5000` + item.img}
                            >
                              {item.img.split("/images/")}
                            </Box>
                          ) : null
                        )}
                      </>
                    ) : null}
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-start",
                my: 1,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  textAlign: "left",
                  ml: {
                    xs: "1px",
                    sm: "24px",
                  },
                  backgroundColor: "#71788D",
                  p: "10px",
                  borderRadius: "15px",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    width: "fit-content",
                    fontSize: "12px",
                  }}
                >
                  {item.date_publication}
                </Typography>

                {item.message}
                {item.img != null ? (
                  <>
                    {typeImage.map((i) =>
                      ~item?.img.indexOf(i) ? (
                        <>
                          <Box
                            component="img"
                            a
                            href={`http://95.188.86.184:5000` + item.img} //Кликабельную хуйню надо сделать
                            sx={{
                              objectFit: "cover",
                              height: "300px",
                              display: "block",
                              maxWidth: {
                                xs: "230px",
                                sm: "380px",
                              },
                              overflow: "hidden",
                              width: "max-content",
                            }}
                            src={`${item.img}?fit=cover&auto=format`}
                            alt={item.label}
                          />
                        </>
                      ) : null
                    )}
                  </>
                ) : null}

                {item.stickers != null ? (
                  <>
                    <Box
                      component="img"
                      a
                      href={``} //Кликабельную хуйню надо сделать
                      sx={{
                        objectFit: "contain",
                        height: "300px",
                        display: "block",
                        maxWidth: {
                          xs: "230px",
                          sm: "380px",
                        },
                        overflow: "hidden",
                        width: "max-content",
                      }}
                      src={require(`../Stickers/sticker${item.stickers}.webp`)}
                      alt={item.label}
                    />
                  </>
                ) : null}

                {item.img != null ? (
                  <>
                    {type.map((i) =>
                      ~item?.img.indexOf(i) ? (
                        <Box
                          a
                          component="a"
                          sx={{ display: "block" }}
                          href={`http://95.188.86.184:5000` + item.img} //Вместо localhost укажи пока что 95.188.86.184:5000, потом передалаю под норм
                          download={`http://95.188.86.184:5000` + item.img}
                        >
                          {item.img.split("/images/")}
                        </Box>
                      ) : null
                    )}
                  </>
                ) : null}
              </Typography>
            </Box>
          )
        ) : null
      )}
    </Grid>
  );
};

export default Message;
