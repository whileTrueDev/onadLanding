const express = require('express');
const doQuery = require('../lib/doQuery');

const router = express.Router();

/* GET method of API server */
// 랜딩페이지 크리에이터 이름
router.get('/user', (req, res) => {
  const { name } = req.query;
  const query = `SELECT
    creatorName, creatorLogo
    FROM creatorInfo
    WHERE creatorTwitchId = ?`;
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
      console.log(`[${new Date().toLocaleString()}] - /user\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

// 랜딩 디스크립션, 디스크립션 제목, 디스크립션 링크
router.get('/description', (req, res) => {
  const { name } = req.query;
  const query = `
    SELECT creatorDesc, creatorDescTitle, creatorDescLink
    FROM creatorLanding
    WHERE creatorTwitchId = ?`;
  const queryArray = [name];

  let lastResult;

  doQuery(query, queryArray)
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
      console.log(`ERROR - [${new Date().toLocaleString()}] - /description\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

// 계약되었던 모든 배너, 배너당 클릭 수, 컨트렉션ID
router.get('/banner', (req, res) => {
  const { name } = req.query;
  const query = `
    SELECT bannerSrc, clickCount, contractionId
    FROM landingClick
    JOIN creatorLanding
      ON substring_index(substring_index(contractionId, '/', 2), '/', -1) = creatorId
    JOIN bannerRegistered as br
      ON br.bannerId = substring_index(contractionId, '/', 1)
    WHERE creatorTwitchId = ?
    `;
  const queryArray = [name];

  let lastResult;

  doQuery(query, queryArray)
    .then((row) => {
      const { error, result } = row;
      if (!error) {
      // 쿼리 과정에서 오류가 아닌 경우
        if (result.length > 0) {
          // 쿼리 결과가 있는 경우
          lastResult = {
            error: null,
            result: row.result
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
      console.log(`ERROR - [${new Date().toLocaleString()}] - /banner\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

// 배너딩 클릭 수의 모든 합, 진행한 광고의 수
router.get('/clicks', (req, res) => {
  const { name } = req.query;
  const query = `
    SELECT count(*) as bannerCount, sum(clickCount) as totalClickCount
    FROM landingClick as lc
    JOIN creatorLanding as cl
    ON cl.creatorId = SUBSTRING_INDEX(SUBSTRING_INDEX(lc.contractionId, '/', 2), '/', -1)
    WHERE creatorTwitchId = ?
    LIMIT 1
    `;
  const queryArray = [name];

  let lastResult;

  doQuery(query, queryArray)
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
      console.log(`ERROR - [${new Date().toLocaleString()}] - /clicks\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});

// 배너 클릭시, 클릭 수 + 1
router.post('/banner/click', (req, res) => {
  const { contractionId } = req.body;
  const query = `
    UPDATE landingClick
    SET clickCount = clickCount + ?
    WHERE contractionId = ?`;
  const queryArray = [1, contractionId];

  let lastResult;

  doQuery(query, queryArray)
    .then((row) => {
      console.log(`[BannerClick] - ${contractionId} - ${new Date().toLocaleString()}`);
      const { error, result } = row;
      if (!error) {
      // 쿼리 과정에서 오류가 아닌 경우
        if (result) {
          // 쿼리 결과가 있는 경우
          lastResult = {
            error: null,
            result: row.result
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
      console.log(`ERROR - [${new Date().toLocaleString()}] - /banner/click\n`, reason);
      lastResult = {
        error: true,
        reason
      };
      res.send(lastResult);
    });
});


module.exports = router;
