import React from "react";
import styles from "../styles/Navbar.module.css";

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => setCurrentPage("home")}
              className={`${styles.button} ${
                currentPage === "home" ? styles.activeButton : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`${styles.button} ${
                currentPage === "about" ? styles.activeButton : ""
              }`}
            >
              About
            </button>
          </div>
          <div className={styles.profileIcon}></div>
        </div>
      </nav>
      <div className={styles.spacer}></div>
    </>
  );
};

export default Navbar;
