"use client";

import { ThreeDot } from "react-loading-indicators";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./LUchat.module.css";
import { AIResponse } from "../../../../lib/AILogic";

interface LUchatProps {
  onMinimize: () => void;
  onProccessMessage?: (message: string) => string;
}

export default function LUchat({ onMinimize, onProccessMessage }: LUchatProps) {
  const [input, setInput] = useState("");
  // manual state to track what the user is typing in the inputbox
  const [isSending, setIsSending] = useState(false); //track when user sends message

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

  useEffect(() => {
    // Disables thinking when responding.
    if (status === "streaming") {
      setIsSending(false);
    }
  }, [status]);

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
      if (onProccessMessage) {
        const AIResponse = onProccessMessage(input);
      }
      console.log("Calling sendMessage with:", {
        role: "user",
        content: input,
      });
      setIsSending(true);
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
              src="/LUchatLogo2.png"
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
          {messages.length === 0 ? (
            <div className={styles.botBubble}>
              Hi! I'm LU ChatBot. How are you feeling today?
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
          {isSending && (
            <div className={styles.botBubble}>
              Thinking
              <ThreeDot
                variant="bounce"
                color="#cc3131"
                size="small"
                text=""
                textColor=""
              />
            </div>
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

// TODO: make it so it DOESNT reset when minimized or when reset
//Also give it access to components and stuff so that it can edit
