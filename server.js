const express = require('express');
const fetch = require('node-fetch');
const { checkCache, saveCache } = require('./middleware/cache'); 
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/zip/:lat/:long', checkCache, async (req, res) => {

  try {
    const {lat, long} = req.params;
    const zip = await fetch(`${process.env.GEOCODER_HOST}?prox=${lat}%2C${long}%2C250&mode=retrieveAddresses&maxresults=1&gen=9&${process.env.GEOCODER_API_KEY}`).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(zip));
    console.log(zip);
    return res.json(zip);
  } catch(error) {
      console.log(error);
      return res.status(500).json(error);
  }
});

app.get('/congress', checkCache, async (req, res) => {

  try {
    const congress = await fetch('https://theunitedstates.io/congress-legislators/legislators-current.json').then( r => r.json());
    saveCache(req, 3600, JSON.stringify(congress));
    console.log(congress);
    return res.json(congress);
  } catch(error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/news/:topic', checkCache, async (req, res) => {

  try {
    const topic = req.params.topic;
    const articles = await fetch(`${process.env.NEWS_HOST}/${topic}?sources=politico&apiKey=${process.env.NEWS_API_KEY}`).then(r => r.json());
    saveCache(req, 600, JSON.stringify(articles));
    console.log(articles);
    return res.json(articles);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/news/pol/:name', async (req, res) => {

  try {
    const name = req.params.name;
    const articles = await fetch(`${process.env.NEWS_HOST}/everything?sources=politico&q=${name}&apiKey=${process.env.NEWS_API_KEY}`).then((r) => r.json());
    saveCache(req, 600, JSON.stringify(articles));
    console.log(articles);
    return res.json(articles);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/votes/recent', checkCache, async (req, res) => {
  
  try {
    const votes = await fetch(`${process.env.PROPUB_HOST}/congress/v1/both/votes/recent.json`, {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(votes));
    console.log(votes);
    return res.json(votes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/votes/:id', checkCache, async (req, res) => {

  try {
    const id = req.params.id;
    const votes = await fetch(`${process.env.PROPUB_HOST}/congress/v1/members/${id}/votes.json`, {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(votes));
    console.log(votes);
    return res.json(votes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/reps/:zip', checkCache, async (req, res) => {

  try {
    const zip = req.params.zip;
    const reps = await fetch(`${process.env.CIVIC_HOST}/representatives?address=${zip}&levels=administrativeArea1&levels=country&key=${process.env.CIVIC_API_KEY}`).then(r => r.json());
    const congress = await fetch('https://theunitedstates.io/congress-legislators/legislators-current.json').then( r => r.json());

    reps.officials.forEach((rep, i) => {
      const filtered = congress.filter(con => con.name.official_full === rep.name);
      rep.data = filtered[0] ? filtered[0] : null;
      i <= 2 ? rep.office = reps.offices[i] : rep.office = reps.offices[i-1];
    });
    saveCache(req, 3600, JSON.stringify(reps));
    console.log(reps);
    return res.json(reps);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/bills', checkCache, async (req, res) => {

  try {
    const bills = await fetch(`${process.env.PROPUB_HOST}/congress/v1/116/both/bills/introduced.json`, {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(bills));
    console.log(bills);
    return res.json(bills);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
})

app.get('/bills/:id', checkCache, async (req, res) => {

  try {
    const id = req.params.id;
    const bills = await fetch(`${process.env.PROPUB_HOST}/congress/v1/members/${id}/bills/cosponsored.json`, {
        headers: {
            Accept: 'application/json',
            'X-API-KEY': process.env.PROPUB_API_KEY
        }
    }).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(bills));
    console.log(bills);
    return res.json(bills);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/finance/:id/:method', checkCache, async (req, res) => {

  try {
    const id = req.params.id;
    const method = req.params.method;
    const finances = await fetch(`${process.env.SECRETS_HOST}/?method=${method}&cid=${id}&apikey=${process.env.SECRETS_API_KEY}`).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(finances));
    console.log(finances);
    return res.json(finances);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/events', checkCache, async (req, res) => {

  try {
    const events = await fetch('http://politicalpartytime.org/api/v1/event/?start_date__gt=2020-01-01&format=json').then(r => r.json());
    saveCache(req, 3600, JSON.stringify(events));
    console.log(events);
    return res.json(events);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/events/:id', checkCache, async (req, res) => {

  try {
    const id = req.params.id;
    const events = await fetch(`http://politicalpartytime.org/api/v1/event/?beneficiaries__crp_id=${id}&format=json`).then(r => r.json());
    saveCache(req, 3600, JSON.stringify(events));
    console.log(events);
    return res.json(events);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get('/congress/search/:name', checkCache, async (req, res) => {

  try {
    const name = req.params.name;
    const congress = await fetch('https://theunitedstates.io/congress-legislators/legislators-current.json').then(r => r.json());
    const filtered = congress.filter(rep => rep.id.wikipedia.toLowerCase().includes(name.toLowerCase()));

    filtered.forEach(rep => {
        rep.search = true;
    })
    saveCache(req, 3600, JSON.stringify(filtered));
    console.log(filtered);
    return res.json(filtered);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
