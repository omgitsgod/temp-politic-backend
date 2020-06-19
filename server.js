const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/news/:topic", async (req, res) => {
    const topic = req.params.topic;
    const articles = await fetch(`${process.env.NEWS_HOST}/${topic}?sources=politico&apiKey=${process.env.NEWS_API}`).then(r => r.json());
    console.log(articles);
    res.send(articles);
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
