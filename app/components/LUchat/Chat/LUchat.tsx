"use client";

import { ThreeDot } from "react-loading-indicators";
import React, { useEffect, useState } from "react";
import styles from "./LUchat.module.css";
import { AIResponse } from "../../../../lib/AILogic";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LUchatProps {
  onMinimize: () => void;
  onProccessMessage?: (message: string) => string;
}

export default function LUchat({ onMinimize, onProccessMessage }: LUchatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault();

    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsSending(true);

      // Process message with AILogic
      setTimeout(() => {
        if (onProccessMessage) {
          const responseText = onProccessMessage(input);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: responseText,
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          // Fallback response if no processor is provided
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I'm here to help with your schedule! Tell me how you're feeling or what you'd like to do.",
          };
          setMessages((prev) => [...prev, botMessage]);
        }
        setIsSending(false);
      }, 500); // Small delay to simulate processing
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
                {isSending ? "Typing..." : "Online now"}
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
                {msg.content}
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
            disabled={isSending}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSubmit}
            disabled={isSending || !input.trim()} //This is to disable the button when AI is responding.
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
