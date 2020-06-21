const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/news/:topic", async (req, res) => {

    const topic = req.params.topic;
    const articles = await fetch(`${process.env.NEWS_HOST}/${topic}?sources=politico&apiKey=${process.env.NEWS_API_KEY}`).then(r => r.json());

    console.log(articles);
    res.send(articles);
});

app.get("/news/:name", async (req, res) => {

    const name = req.params.name;
    const articles = await fetch(`${process.env.NEWS_HOST}/everything?sources=politico&q=${name}&apiKey=${process.env.NEWS_API_KEY}`).then(r => r.json());

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

app.get("/votes/:id", async (req, res) => {

    const id = req.params.id;
    const votes = await fetch(`${process.env.PROPUB_HOST}/congress/v1/members/${this.state.data.id.bioguide}/votes.json`, {
        headers: {
            Accept: "application/json",
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());

    console.log(votes);
    res.send(votes);
});

app.get("/reps/:zip", async (req, res) => {

    const zip = req.params.zip;
    const reps = await fetch(`${process.env.CIVIC_HOST}/representatives?address=${zip}&levels=administrativeArea1&levels=country&key=${process.env.CIVIC_API_KEY}`).then(r => r.json());

    console.log(reps);
    res.send(reps);
});

app.get("/bills/:id", async (req, res) => {

    const id = req.params.id;
    const bills = await fetch(`${process.env.PROPUB_HOST}/congress/v1/members/${id}/bills/cosponsored.json`, {
        headers: {
            Accept: "application/json",
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    
    console.log(bills);
    res.send(bills);
});

app.get("/finance/:id/:method", async (req, res) => {

    const id = req.params.id;
    const method = req.params.method;
    const finances = await fetch(`${process.env.SECRETS_HOST}/?method=${method}&cid=${id}&apikey=${process.env.SECRETS_API_KEY}`).then(r => r.json());

    console.log(finances);
    res.send(finances);
});

app.get("/events/:id", async (req, res) => {

    const id = req.params.id;
    const events = await fetch(`http://politicalpartytime.org/api/v1/event/?beneficiaries__crp_id=${id}&format=json`).then(r => r.json());

    console.log(events);
    res.send(events);
});

app.get("/congress", async (req, res) => {

    const congress = await fetch("https://theunitedstates.io/congress-legislators/legislators-current.json").then(r => r.json());

    console.log(congress);
    res.send(congress);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
