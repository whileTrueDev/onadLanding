const express = require('express');
const doQuery = require('../lib/doQuery');

const router = express.Router();
/* GET home page. */

router.get('/user', (req, res) => {
  const { name } = req.query;

  const query = 'SELECT creatorName FROM creatorInfo WHERE creatorTwitchId = ?';
  let lastResult;
  doQuery(query, [name])
    .then((row) => {
      const { error, result } = row;
      if (!error) {
        if (result.length > 0) {
          lastResult = {
            error: null,
            result: row.result[0]
          };
          res.send(lastResult);
        }
      }
    }).catch((reason) => {
      console.log(`[${new Date()}] - /user\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

module.exports = router;
