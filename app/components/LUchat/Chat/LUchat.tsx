"use client";

import { useChat } from "@ai-sdk/react";

import React, { useState } from "react";
import styles from "./LUchat.module.css";

interface LUchatProps {
  onMinimize: () => void;
}

export default function LUchat({ onMinimize }: LUchatProps) {
  const [input, setInput] =
    useState(
      ""
    ); /* manual state to track what the user is typing in the inputbox */
  const { messages, sendMessage, status, error } = useChat();

  console.log(messages);

  function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault();
    console.log("handleSubmit called, input:", input);
    console.log("sendMessage function:", sendMessage);
    console.log("status:", status);
    console.log("error:", error);

    if (input.trim()) {
      console.log("Calling sendMessage with:", {
        role: "user",
        content: input,
      });
      try {
        const result = sendMessage({ text: input });
        console.log("sendMessage returned:", result);
      } catch (err) {
        console.error("Error calling sendMessage:", err);
      }
      setInput("");
    }
  }

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
              <div className={styles.subtitle}>
                {status === "streaming" ? "Typing..." : "Online now"}
              </div>
            </div>
          </div>
          <button onClick={onMinimize} className={styles.closeBtn}>
            -
          </button>
        </header>

        {/* Message body */}
        <div className={styles.body}>
          {messages.length === 0 ? (
            <div className={styles.botBubble}>
              Hi! I'm LU ChatBot. How can I help?
            </div>
          ) : (
            // Create chat bubble for each message
            messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user" ? styles.userBubble : styles.botBubble
                }
              >
                {msg.parts /*TODO allow other than text maybe? */
                  .filter(
                    (part) => part.type === "text"
                  ) /* Filtering so only text shows up */
                  .map((part, idx) => (
                    <span key={idx}>
                      {part.text}
                    </span> /* Displaying the actual text in part.text (a key is needed to uniquely specify each messaage) */
                  ))}
              </div>
            ))
          )}
        </div>

        {/* Input footer */}
        <footer className={styles.footer}>
          <input
            className={styles.input}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)} // Captures input value on each keystroke updating state as user types
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={status === "streaming"}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSubmit}
            disabled={status === "streaming" || !input.trim()} //This is to disable the button when AI is responding.
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

//<MessageRenderer messages={messages} isLoading={isLoading} />

// TODO: Make LU chat scrollable, make it so it DOESNT reset when minimized
//Also give it access to components and stuff so that it can edit
