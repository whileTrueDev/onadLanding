const express = require('express');
const doQuery = require('../lib/doQuery');

const router = express.Router();

/* GET method of API server */
router.get('/user', (req, res) => {
  const { name } = req.query;
  const query = 'SELECT creatorName FROM creatorInfo WHERE creatorTwitchId = ?';
  let lastResult;
  doQuery(query, [name])
    .then((row) => {
      const { error, result } = row;
      if (!error) {
        // 쿼리 과정에서 오류가 아닌 경우
        if (result.length > 0) {
          // 쿼리 결과가 있는 경우
          lastResult = {
            error: null,
            result: row.result[0]
          };
          res.send(lastResult);
        } else {
          // 쿼리 결과가 없는 경우
          lastResult = {
            error: true,
            result: null,
          };
          res.send(lastResult);
        }
      } else {
        // 쿼리 과정에서 오류인 경우
        lastResult = {
          error: true,
          result: error,
        };
        res.send(lastResult);
      }
    }).catch((reason) => {
      // db 쿼리 수행 과정의 오류인 경우
      console.log(`[${new Date()}] - /user\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

module.exports = router;
