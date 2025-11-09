"use client";

import React, { useState } from "react";
import styles from "./LUchat.module.css";

interface LUchatProps {
  onMinimize: () => void;
}

export default function LUchat({ onMinimize }: LUchatProps) {
  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatWindow}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <img
              src="/LUchatLogo.png"
              alt="LU Chat Logo"
              className={styles.headerLogo}
            />
            <div>
              <div className={styles.title}>LU Chat</div>
              <div className={styles.subtitle}>Online now</div>
            </div>
          </div>
          <button onClick={onMinimize} className={styles.closeBtn}>
            -
          </button>
        </header>

        {/* Message body */}
        <div className={styles.body}>
          <div className={styles.botBubble}>Hi! I’m LU Chat.</div>
          <div className={styles.userBubble}>Hey there!</div>
        </div>

        {/* Input footer */}
        <footer className={styles.footer}>
          <input className={styles.input} placeholder="Type a message..." />
          <button className={styles.sendBtn}>Send</button>
        </footer>
      </div>
    </div>
  );
}
