const redis = require('redis');

const client = redis.createClient(6379);

function checkCache(req, res, next) {
  const id = [req.originalUrl, ...Object.values(req.params)].join(':');
  client.get(id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    if (data) {
      console.log('retrieving cache');
      res.send(data);
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