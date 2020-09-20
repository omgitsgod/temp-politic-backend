const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 6379;
const client = redis.createClient(REDIS_URL);

function checkCache(req, res, next) {
  const id = [req.originalUrl, ...Object.values(req.params)].join(':');
  client.get(id, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (data) {
      console.log('retrieving cache');
      return res.send(data);
    } else {
      next();
    }
  });
}

function saveCache(req, time, data) {
  const id = [req.originalUrl, ...Object.values(req.params)].join(':');
  client.setex(id, time, data);
}

module.exports = {checkCache, saveCache};