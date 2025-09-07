import { useState } from "react";

function ChatWithGPT() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "farmer", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      // Replace this fetch with your backend endpoint
      const res = await fetch("http://127.0.0.1:8000/chat-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const gptMessage = { sender: "gpt", text: data.reply };
      setMessages((prev) => [...prev, gptMessage]);
    } catch (err) {
      console.error(err);
      const errorMsg = { sender: "gpt", text: "Failed to get response from GPT." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>💬 Chat with GPT</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {messages.map((m, i) => (
          <p key={i} style={{ textAlign: m.sender === "farmer" ? "right" : "left" }}>
            <strong>{m.sender === "farmer" ? "You" : "GPT"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", padding: "8px", marginRight: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 12px" }}>Send</button>
    </div>
  );
}

export default ChatWithGPT;
