import React, { useState } from "react";
import { Box } from "@mui/material";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fab from "@mui/material/Fab";

function ButtonBackToTop() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <Box
      sx={{ display: "flex", position: "fixed", bottom: "16px", right: "16px" }}
    >
      <Fab
        color="secondary"
        onClick={scrollToTop}
        style={{ display: visible ? "inline" : "none" }}
        aria-label="scroll back to top"
      >
        <UpIcon />
      </Fab>
    </Box>
  );
}

export default ButtonBackToTop;
