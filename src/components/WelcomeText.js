import React from "react";
import {useState, useEffect} from "react";
import axios from "axios";

export default function WelcomeText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {

        const res = await axios.get("http://localhost:8080/useraccount/getAccountInfo", {
          params: { userId: 1 }
        });
        console.log("User info fetched:", res.data);
        const username = res.data?.fullName || "User"; 
        console.log("Username:", username);
        setMessages([
          `Hello, ${username}!`,
          "Stocks are subject to market risks!",
          "Invest wisely!",
          "Keep track of your stocks!"
        ]);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessages([
          "Hello, Santhosh Kumar!",
          "Stocks are subject to market risks!",
          "Invest wisely!",
          "Keep track of your stocks!"
        ]);
      }
    };

    fetchUserInfo();
  }, []);
useEffect(() => {
  // ✅ Don't run until messages are loaded
  if (!messages || messages.length === 0) return;

  let timeout;
  const currentMessage = messages[currentTextIndex];

  if (isTyping) {
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