import React, { useState, useEffect, useRef } from "react";
import "./craveBot.css";

export default function CraveBot({ menuItems, onSelectItem }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi! I'm CraveBot. 🤖 Hunger is calling—tell me your mood or what you're craving!" }
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");

        // Simulate AI Logic
        setTimeout(() => {
            const botResponse = generateResponse(userMsg);
            setMessages(prev => [...prev, { role: "bot", ...botResponse }]);
        }, 800);
    };

    const generateResponse = (text) => {
        const query = text.toLowerCase();

        // 1. Searching for specific items
        const found = menuItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        if (found.length > 0) {
            return {
                text: `I found ${found.length} items matching your craving!`,
                suggestions: found.slice(0, 3)
            };
        }

        // 2. Mood-based suggestions
        if (query.includes("mood") || query.includes("stressed") || query.includes("sad") || query.includes("happy")) {
            let moodItems = [];
            if (query.includes("stressed") || query.includes("sad")) {
                moodItems = menuItems.filter(i => i.category === "Main Menu" || i.category === "Desserts").slice(0, 3);
                return { text: "Comfort food incoming! These usually clear the clouds:", suggestions: moodItems };
            }
            if (query.includes("happy") || query.includes("party")) {
                moodItems = menuItems.filter(i => i.category === "Drinks" || i.category === "Starters").slice(0, 3);
                return { text: "Celebrate with these crowd-pleasers!", suggestions: moodItems };
            }
        }

        // 3. Healthy suggestions
        if (query.includes("healthy") || query.includes("light") || query.includes("diet")) {
            const healthyItems = menuItems.filter(i => i.diet === "veg" || i.category === "Salad").slice(0, 3);
            return { text: "Keeping it light? Great choice! Try these:", suggestions: healthyItems };
        }

        return { text: "I'm not exactly sure, but why not explore our top-rated dishes?" };
    };

    return (
        <div className={`crave-bot-wrapper ${isOpen ? "open" : ""}`}>
            {/* Floating Toggle */}
            <button className="crave-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✕" : "🤖"}
            </button>

            {/* Chat Window */}
            <div className="crave-window">
                <div className="crave-header">
                    <h3>CraveBot AI</h3>
                    <span>Powered by DineExpress</span>
                </div>

                <div className="crave-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`msg-row ${msg.role}`}>
                            <div className="msg-bubble">
                                <p>{msg.text}</p>
                                {msg.suggestions && (
                                    <div className="bot-suggestions">
                                        {msg.suggestions.map(item => (
                                            <div key={item.id} className="suggest-chip" onClick={() => onSelectItem(item)}>
                                                {item.name} • ₹{item.price}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="crave-input-area">
                    <input
                        type="text"
                        placeholder="Type a mood or dish... (e.g. 'I'm stressed')"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend}>➤</button>
                </div>
            </div>
        </div>
    );
}
