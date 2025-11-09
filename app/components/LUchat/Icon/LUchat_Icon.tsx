"use client";

import React from "react";
import styles from "./LUchat_Icon.module.css";

interface LUchatIconProps {
  onClick: () => void;
}

export default function LUchat_Icon({ onClick }: LUchatIconProps) {
  return (
    <div className={styles.iconContainer} onClick={onClick}>
      <img src="/LUchatLogo.png" alt="LUchatLogo" />
    </div>
  );
}
