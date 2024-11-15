import React, { useState, useCallback, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import MainCard from "../../components/PostCardMain";
import InfiniteScroll from "react-infinite-scroll-component";

function ImageGallery() {
  const [post, setPost] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getPost = useCallback(async () => {
    try {
      await axios
        .get(`/api/post/get_post/${page * 20}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => setPost(response.data));
      setIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getPost();
  }, [post]);

  return !isLoaded ? (
    <CircularProgress variant="determinate" value={progress} />
  ) : (
    <InfiniteScroll
      dataLength={post?.length} //This is important field to render the next data
      next={() => setPage(page + 1)}
      hasMore={true}
      loader={<h4></h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <Box sx={{ mt: 10, width: "auto" }}>
        <Grid
          container
          spacing={2}
          columns={{ xs: 4, sm: 8, md: 6 }}
          rowSpacing={1}
          columnSpacing={1}
          sx={{ justifyContent: "center" }}
        >
          {post?.map((item) => (
              <MainCard key={item.id} todo={item} />
            ))}
          {/* <InfiniteScroll data={post} drawElement={renderChild} size={5}></InfiniteScroll> */}
        </Grid>
      </Box>
    </InfiniteScroll>
  );
}

export default ImageGallery;
