import styles from "./sidenav.module.css";
import { NavLink, useLocation } from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { navData } from "../lib/navData";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

export default function Sidenav() {
  const [open, setopen] = useState(true);
  const location = useLocation();

  const toggleSideBar = () => {
    const leftSideBar = document.querySelector(".left-side-bar");
    const contentContainer = document.querySelector(".content-container");

    setopen(!open);
    if (leftSideBar.classList.contains("left-side-bar-collapsed")) {
      leftSideBar.classList.remove("left-side-bar-collapsed");
      contentContainer.classList.remove(
        "content-container-with-collapsed-sidebvar"
      );
      return;
    }

    leftSideBar.classList.add("left-side-bar-collapsed");
    contentContainer.classList.add("content-container-with-collapsed-sidebvar");
  };

  return (
    <div className={open ? styles.sidenav : styles.sidenavClosed}>
      {open ? (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h5"
            style={{ color: "white", textAlign: "center" }}
          >
            Lemuria Dex Analysis
          </Typography>
        </Box>
      ) : (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <img src="https://img.icons8.com/cute-clipart/32/null/l.png" />
        </Box>
      )}
      <button className={styles.menuBtn} onClick={toggleSideBar}>
        {open ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </button>
      {navData.map((item) => {
        return (
          <NavLink
            key={item.id}
            className={`${styles.sideitem} ${
              location.pathname.split("/")[1] === item.link
                ? styles.activePageStatistics
                : ""
            }`}
            to={item.link}
          >
            {item.icon}
            <span  className={`${styles.linkText} left-side-bar-menu-link-text`}>{item.text}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
