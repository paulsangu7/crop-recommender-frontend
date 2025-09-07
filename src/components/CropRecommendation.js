import { useState } from "react";

// Crop images from public folder
const cropImages = {
  Wheat: "/img/wheat.png",
  Barley: "/img/barley.png",
  Millet: "/img/millet.png",
  Maize: "/img/maize.png",
  Sugarcane: "/img/sugarcane.png",
  Beans: "/img/beans.png",
  Sorghum: "/img/sorghum.png",
  Groundnut: "/img/groundnut.png",
};

// Determine weather class
const getWeatherClass = (weatherMain) => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return "sunny";
    case "clouds":
      return "cloudy";
    case "rain":
    case "drizzle":
      return "rainy";
    case "thunderstorm":
      return "stormy";
    case "snow":
      return "snowy";
    default:
      return "default";
  }
};

function CropRecommendation() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GPT Chat state
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const getRecommendation = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/recommend/${city}`);
      const result = await res.json();
      if (res.ok) setData(result);
      else setError(result.error || "Unknown error occurred");
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const renderCrops = (crops) => (
    <ol>
      {crops.map((crop, index) => (
        <li
          key={index}
          style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
        >
          {cropImages[crop] && (
            <img
              src={cropImages[crop]}
              alt={crop}
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
          )}
          {crop}
        </li>
      ))}
    </ol>
  );

  const renderSummary = (summary) => {
    if (!summary) return "";
    const clean = summary.replace(/\*\*/g, "").trim();
    const lines = clean.split(/(?=\d+\.)/); // split before numbered points
    return lines.map((line, index) => (
      <p key={index} style={{ marginBottom: "10px" }}>
        {line.trim()}
      </p>
    ));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "farmer", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const gptMessage = { sender: "gpt", text: data.reply };
      setMessages((prev) => [...prev, gptMessage]);
    } catch (err) {
      const errorMsg = { sender: "gpt", text: "Failed to get response from GPT." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const weatherClass =
    data && data.weather && data.weather.weather[0].main
      ? getWeatherClass(data.weather.weather[0].main)
      : "default";

  return (
    <div className={`weather-container ${weatherClass}`} style={{ minHeight: "100vh", paddingBottom: "120px" }}>
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#ffffffb0",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h1 style={{textAlign: "center"}}>🌾 Crop Recommender</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px", color: "#4014dfff" }}>
  <input
    type="text"
    placeholder="Enter city"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    style={{ padding: "8px", width: "250px" }}
  />
  <button onClick={getRecommendation} style={{ padding: "8px 12px", color: "#4014dfff", border: "1px solid #4014dfff", background: "transparent",
     cursor: "pointer", transition: "background-color 0.3s, color 0.3s", borderRadius: "6px" }}>
    Recommendation
  </button>
</div>


        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {data && (
          <div>
            <h2>
              City: {data.city}{" "}
              {data.weather.weather[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${data.weather.weather[0].icon}@2x.png`}
                  alt={data.weather.weather[0].description}
                  style={{ verticalAlign: "middle" }}
                />
              )}
            </h2>
            <p>Temperature: {data.weather.main.temp}°C</p>
            <p>Humidity: {data.weather.main.humidity}%</p>

            <h3>Recommended Crops:</h3>
            {renderCrops(data.recommended_crops)}

            <h3>Summary:</h3>
            {renderSummary(data.summary)}

            {/* Chat with GPT */}
            <div style={{ marginTop: "30px" }}>
              <h3>💬 Chat with GPT</h3>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages.map((m, i) => (
                  <p
                    key={i}
                    style={{ textAlign: m.sender === "farmer" ? "right" : "left" }}
                  >
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
              <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <footer className="footer">
        <div>© 2025, Paulo Kiwalile | Tanzania</div>
        <div className="social-icons">
          <ul>
            <li>
              <a href="https://www.facebook.com/share/172KQ4fVPW/" target="_blank" rel="noopener noreferrer">
                <img src="/img/facebook.svg" alt="facebook" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/pkiwalile?igsh=cHBrMGt0eXN1ZTdh" target="_blank" rel="noopener noreferrer">
                <img src="/img/instagram.svg" alt="instagram" />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/paulo-kiwalile-a32a1320a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                <img src="/img/linkedin.svg" alt="linkedin" />
              </a>
            </li>
            <li>
              <a href="https://x.com/pkiwalile?s=09" target="_blank" rel="noopener noreferrer">
                <img src="/img/twitter-x.svg" alt="twitter" />
              </a>
            </li>
            <li>
              <a href="https://github.com/paulsangu7" target="_blank" rel="noopener noreferrer">
                <img src="/img/github.svg" alt="github" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default CropRecommendation;
