import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/ChatBot.css";

export default function ChatBot() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! 👋 I'm your **Stock Overflow** trading assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "trading-assistant",
                    prompt: input,
                    stream: true
                })
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = { sender: "bot", text: "" };

            setMessages(prev => [...prev, botMessage]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true }).trim();

                for (const line of chunk.split("\n")) {
                    if (!line) continue;

                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            botMessage.text += json.response;
                            setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1] = { ...botMessage };
                                return updated;
                            });
                        }
                    } catch (parseErr) {
                        console.warn("Failed to parse JSON:", line);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: "⚠️ **Error**: Unable to connect to the AI service. Please check if the Ollama server is running on `localhost:11434`." }
            ]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {/* Header */}
            <div className="chatbot-header">
                <h2>🤖 Trading Assistant</h2>
                <p>Get insights on US stocks, trading strategies, and market analysis</p>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`message ${msg.sender === "user" ? "message-user" : "message-bot"}`}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                ))}
                {/* {loading && (
                    <div className="loading-indicator">
                        💭 Analyzing your query...
                    </div>
                )} */}
            </div>

            {/* Input */}
            <div className="input-container">
                <textarea
                    className="input-textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about US stocks, trading strategies, or investment ideas..."
                    rows={1}
                    style={{
                        height: 'auto',
                        minHeight: '44px'
                    }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
                <button 
                    className="send-button" 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}