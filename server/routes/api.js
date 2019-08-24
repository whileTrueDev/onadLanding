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
          lastResult = { error: null, result: row.result[0] };
          res.send(lastResult);
        } else {
          // 쿼리 결과가 없는 경우
          lastResult = { error: true, result: null, };
          res.send(lastResult);
        }
      } else {
        // 쿼리 과정에서 오류인 경우
        lastResult = { error: true, result: error, };
        res.send(lastResult);
      }
    }).catch((reason) => {
      // db 쿼리 수행 과정의 오류인 경우
      console.log(`[${new Date().toLocaleString()}] - /user\n`, reason);
      lastResult = { error: true, reason };
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
          lastResult = { error: null, result: row.result[0] };
          res.send(lastResult);
        } else {
        // 쿼리 결과가 없는 경우
          lastResult = { error: true, result: null, };
          res.send(lastResult);
        }
      } else {
      // 쿼리 과정에서 오류인 경우
        lastResult = { error: true, result: error, };
        res.send(lastResult);
      }
    }).catch((reason) => {
    // db 쿼리 수행 과정의 오류인 경우
      console.log(`ERROR - [${new Date().toLocaleString()}] - /description\n`, reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 계약되었던 모든 배너, 배너당 클릭 수, 컨트렉션ID
router.get('/banner', (req, res) => {
  const { name } = req.query;
  const query = `
    SELECT
    bannerSrc, clickCount, transferCount, contractionId,
    bannerDescription, companyDescription, landingUrl,
    substring_index(contractionId, '/', -1) as contractionDate
    
    FROM landingClick
    JOIN creatorLanding
      ON substring_index(substring_index(contractionId, '/', 2), '/', -1) = creatorId
    JOIN bannerRegistered as br
      ON br.bannerId = substring_index(contractionId, '/', 1)
    WHERE creatorTwitchId = ?
    ORDER BY contractionDate DESC
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
          lastResult = { error: null, result: row.result };
          res.send(lastResult);
        } else {
        // 쿼리 결과가 없는 경우
          lastResult = { error: true, result: null, };
          res.send(lastResult);
        }
      } else {
      // 쿼리 과정에서 오류인 경우
        lastResult = { error: true, result: error, };
        res.send(lastResult);
      }
    }).catch((reason) => {
    // db 쿼리 수행 과정의 오류인 경우
      console.log(`ERROR - [${new Date().toLocaleString()}] - /banner\n`, reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 배너딩 클릭 수의 모든 합, 진행한 광고의 수
router.get('/clicks', (req, res) => {
  const { name } = req.query;
  const query = `
    SELECT count(*) as bannerCount,
          sum(clickCount) as totalClickCount,
          sum(transferCount) as totalTransferCount
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
          lastResult = { error: null, result: row.result[0] };
          res.send(lastResult);
        } else {
        // 쿼리 결과가 없는 경우
          lastResult = { error: true, result: null, };
          res.send(lastResult);
        }
      } else {
      // 쿼리 과정에서 오류인 경우
        lastResult = { error: true, result: error, };
        res.send(lastResult);
      }
    }).catch((reason) => {
    // db 쿼리 수행 과정의 오류인 경우
      console.log(`ERROR - [${new Date().toLocaleString()}] - /clicks\n`, reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 배너 클릭시, 클릭 수 + 1
router.post('/banner/click', (req, res) => {
  const TRANSFER_TYPE_NUM = 0; // db에서 이동의 type 넘버
  const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const { contractionId } = req.body;

  // ip체크쿼리
  const ipCheckQuery = `
    SELECT ipAddress
    FROM landingClickIp
    WHERE contractionId = ?
    AND type = ?
    AND date >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `;
  const ipCheckArray = [contractionId, TRANSFER_TYPE_NUM];

  const ipInsertQuery = `
    INSERT INTO landingClickIp 
    (contractionId, ipAddress, type)
    VALUES (?, ?, ?)
    `;
  const ipInsertArray = [contractionId, userIp, TRANSFER_TYPE_NUM];

  const clickUpdateQuery = `
    UPDATE landingClick
    SET clickCount = clickCount + ?
    WHERE contractionId = ?`;
  const clickUpdateArray = [1, contractionId];

  //
  let lastResult = {
    error: null,
    result: {
      ipCheck: {},
      ipInsert: {},
      clickUpdate: {}
    }
  };

  doQuery(ipCheckQuery, ipCheckArray)
    .then((row) => {
      const { error, result } = row;
      if (!error) {
        if (result.length === 0) {
          lastResult.result.ipCheck = { error: null, result: 'success' };
          // 이전에 찍힌 ip가 없는 경우
          console.log('<조회> 이전에 찍힌 ip 가 아니기 때문에 작업합니다...');
          Promise.all([
            doQuery(ipInsertQuery, ipInsertArray)
              .then((ipInsertRow) => {
                console.log(`[click-ipInsert] - ${contractionId} - ${new Date().toLocaleString()}`);
                const { ipInsertError, ipInsertResult } = ipInsertRow;
                if (!ipInsertError) { // 쿼리 과정에서 오류가 아닌 경우
                  if (result) { // 쿼리 결과가 존재하는 경우
                    lastResult.result.ipCheck = { error: null, result: ipInsertResult };
                  } else { // 쿼리 결과가 없는 경우
                    lastResult.result.ipCheck = { error: true, result: null };
                  }
                } else { // 쿼리 과정에서 오류인 경우
                  lastResult.result.ipCheck = { error: true, result: error };
                }
              })
              .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                console.log(`ERROR - [${new Date().toLocaleString()}] - /banner/click=>ipInsert\n`, reason);
                lastResult.result.ipCheck = { error: true, reason };
              }),
            doQuery(clickUpdateQuery, clickUpdateArray)
              .then((clickUpdateRow) => {
                console.log(`[clickUpdate] - ${contractionId} - ${new Date().toLocaleString()}`);
                const { clickUpdateError, clickUpdateResult } = clickUpdateRow;
                if (!clickUpdateError) { // 쿼리 과정에서 오류가 아닌 경우
                  if (result) { // 쿼리 결과가 있는 경우
                    lastResult.result.clickUpdate = { error: null, result: clickUpdateResult };
                  } else { // 쿼리 결과가 없는 경우
                    lastResult.result.clickUpdate = { error: true, result: null };
                  }
                } else { // 쿼리 과정에서 오류인 경우
                  lastResult.result.clickUpdate = { error: true, result: error };
                }
              })
              .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                console.log(`ERROR - [${new Date().toLocaleString()}] - /banner/click=>clickUpdate\n`, reason);
                lastResult.result.clickUpdate = { error: true, reason };
              })
          ])
            .then(() => {
              res.send(lastResult);
            });
        } else {
          // 이전에 찍힌 ip가 있는 경우
          console.log('<조회> - 이전에찍힌 IP가 있기 때문에 skip합니다...');
          lastResult = { error: null, result: 'fail' };
          res.send(lastResult);
        }
      }
    })
    .catch((reason) => {
      console.log(reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 배너 <이동> 버튼 클릭 시, 이동 수 + 1
router.post('/banner/transfer', (req, res) => {
  const TRANSFER_TYPE_NUM = 1; // db에서 이동의 type 넘버
  const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const { contractionId } = req.body;

  // Queries
  // ip 체크가 1시간 이내에 찍힌게 있는지 확인
  const ipCheckQuery = `
    SELECT ipAddress
    FROM landingClickIp
    WHERE contractionId = ?
    AND date >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    AND type = ?
    `;
  const ipCheckArray = [contractionId, TRANSFER_TYPE_NUM];

  const ipInsertQuery = `
    INSERT INTO landingClickIp 
    (contractionId, ipAddress, type)
    VALUES (?, ?, ?)
    `;
  const ipInsertArray = [contractionId, userIp, TRANSFER_TYPE_NUM];

  // <이동>클릭 수 증가쿼리
  const clickUpdateQuery = `
    UPDATE landingClick
    SET transferCount = transferCount + ?
    WHERE contractionId = ?`;
  const clickUpdateArray = [1, contractionId];

  let lastResult = {
    error: null,
    result: {
      ipCheck: {},
      ipInsert: {},
      clickUpdate: {}
    }
  };

  doQuery(ipCheckQuery, ipCheckArray)
    .then((row) => {
      const { error, result } = row;
      if (!error) {
        if (result.length === 0) {
          lastResult.result.ipCheck = { error: null, result: 'success' };
          // 이전에 찍힌 ip가 없는 경우
          console.log('<이동> 이전에 찍힌 ip 가 아니기 때문에 작업합니다...');
          Promise.all([
            doQuery(ipInsertQuery, ipInsertArray)
              .then((ipInsertRow) => {
                console.log(`[click-ipInsert] - ${contractionId} - ${new Date().toLocaleString()}`);
                const { ipInsertError, ipInsertResult } = ipInsertRow;
                if (!ipInsertError) { // 쿼리 과정에서 오류가 아닌 경우
                  if (result) { // 쿼리 결과가 존재하는 경우
                    lastResult.result.ipCheck = { error: null, result: ipInsertResult };
                  } else { // 쿼리 결과가 없는 경우
                    lastResult.result.ipCheck = { error: true, result: null };
                  }
                } else { // 쿼리 과정에서 오류인 경우
                  lastResult.result.ipCheck = { error: true, result: error };
                }
              })
              .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                console.log(`ERROR - [${new Date().toLocaleString()}] - /banner/transfer=>ipInsert\n`, reason);
                lastResult.result.ipCheck = { error: true, reason };
              }),
            doQuery(clickUpdateQuery, clickUpdateArray)
              .then((clickUpdateRow) => {
                console.log(`[transferUpdate] - ${contractionId} - ${new Date().toLocaleString()}`);
                const { clickUpdateError, clickUpdateResult } = clickUpdateRow;
                if (!clickUpdateError) { // 쿼리 과정에서 오류가 아닌 경우
                  if (result) { // 쿼리 결과가 있는 경우
                    lastResult.result.clickUpdate = { error: null, result: clickUpdateResult };
                  } else { // 쿼리 결과가 없는 경우
                    lastResult.result.clickUpdate = { error: true, result: null };
                  }
                } else { // 쿼리 과정에서 오류인 경우
                  lastResult.result.clickUpdate = { error: true, result: error };
                }
              })
              .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                console.log(`ERROR - [${new Date().toLocaleString()}] - /banner/transfer=>transferUpdate\n`, reason);
                lastResult.result.clickUpdate = { error: true, reason };
              })
          ])
            .then(() => {
              res.send(lastResult);
            });
        } else {
          // 이전에 찍힌 ip가 있는 경우
          console.log('<이동> - 이전에찍힌 IP가 있기 때문에 skip합니다...');
          lastResult = { error: null, result: 'fail' };
          res.send(lastResult);
        }
      }
    })
    .catch((reason) => {
      console.log(reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

module.exports = router;
