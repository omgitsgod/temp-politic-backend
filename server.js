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
});

app.get("/votes/recent", async (req, res) => {
    const votes = await fetch(`${process.env.PROPUB_HOST}/congress/v1/both/votes/recent.json`, {
        headers: {
            Accept: "application/json",
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    console.log(votes);
    res.send(votes);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
