const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const YOUTUBE_API_KEY = "Myapi_Key";

app.get("/ai-suggestions", async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          q,
          maxResults: 5,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    const results = response.data.items.map(item => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
