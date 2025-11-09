"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./LUchat.module.css";

interface LUchatProps {
  onMinimize: () => void;
}

export default function LUchat({ onMinimize }: LUchatProps) {
  const [input, setInput] = useState("");
  // manual state to track what the user is typing in the inputbox

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  console.log("Messages:", messages);
  console.log("First message structure:", messages[0]);

  const callGetResponse = async () => {
    if (!input.trim()) return; //this is to not send empty messages
  };
  //TODO this is to create the text scroll.
  /*useEffect(() => {
    rollIntoView({behavior: "smooth"});
  }) */

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
        const result = sendMessage({
          role: "user",
          parts: [{ type: "text", text: input }],
        });
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
              src="/LUbot.png"
              alt="LU bot Logo"
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
          {messages.length === 0 ? ( //I believe this should be a assistant: message not just a botbubble.
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
