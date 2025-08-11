import React from "react";
import {useState, useEffect} from "react";

export default function WelcomeText() {

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const messages = [
    "Hello, Santhosh Kumar!",
    "Stocks are subject to market risks!",
    "Invest wisely!",
    "Keep track of your stocks!"
  ];

  useEffect(() => {
    let timeout;
    
    if (isTyping) {
      const currentMessage = messages[currentTextIndex];
      if (displayedText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayedText.length > 2) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % messages.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentTextIndex, messages]);

  return (
    <div style={{
        marginLeft: "250px",
        padding: "5px",
        width: `calc(100vw - 300px)`,
        boxSizing: "border-box",
      }}>
      <h2 style={{
          textAlign: "center", marginBottom: "1.5rem"}}><em>{displayedText}</em></h2>
    </div>
  );
}