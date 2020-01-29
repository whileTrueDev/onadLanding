const express = require('express');
const doQuery = require('../lib/doQuery');
const logger = require('../middleware/landingActionLogging');

const router = express.Router();

/* GET method of API server */

/* ***********************************
 * data fetch
 * *********************************** */

// 랜딩페이지 크리에이터 이름
router.get('/user', (req, res) => {
  const { name } = req.query;
  const query = `SELECT
    creatorName, creatorLogo, creatorBackgroundImage, creatorTheme, visitCount
    FROM creatorInfo as ci
    JOIN creatorLanding as cl
    ON ci.creatorTwitchId = cl.creatorTwitchId
    JOIN creatorRoyaltyLevel as crl
    ON ci.creatorId = crl.creatorId
    WHERE ci.creatorTwitchId = ?`;
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
    SELECT creatorDesc
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

// 계약되었던 모든 배너, 배너당 클릭수, 이동수, 배너 정보들 조회
router.get('/banner', (req, res) => {
  const NOT_DELETED_CAMPAIGN_STATE = 0;
  const ON_STATE = 1;
  const { name } = req.query;
  const query = `
  SELECT
  bannerSrc, clickCount, mi.marketerName, transferCount, campaign.campaignId, lc.creatorId,
  bannerDescription, companyDescription, links,
  DATE_FORMAT(lc.regiDate, "%Y년 %m월 %d일") as regiDate
  
  FROM landingClick as lc

  JOIN marketerInfo as mi
    ON SUBSTRING_INDEX(lc.campaignId, "_", 1) = mi.marketerId
    
  JOIN creatorLanding as cl
    ON lc.creatorId = cl.creatorId
    
  JOIN campaign
    ON lc.campaignId = campaign.campaignId
    
  JOIN bannerRegistered as br
    ON campaign.bannerId = br.bannerId
    
  JOIN linkRegistered as  lr
    ON lr.linkId = campaign.connectedLinkId
    
  WHERE creatorTwitchId = "we10802" AND campaign.deletedState = 0
    AND campaign.onOff = 1 AND mi.marketerContraction = 1
  ORDER BY regiDate DESC`;
  const queryArray = [name, NOT_DELETED_CAMPAIGN_STATE, ON_STATE, ON_STATE];

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
            result: row.result.map(r => ({
              ...r,
              links: JSON.parse(r.links)
            }))
          };
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

// 지금껏 진행한 모든 (삭제된 캠페인 포함된 통계정보) 배너딩 클릭 수의 모든 합, 진행한 광고의 수
router.get('/clicks', (req, res) => {
  const { name } = req.query;
  const query = `
  SELECT
  count(*) as bannerCount,
    sum(clickCount) as totalClickCount,
    sum(transferCount) as totalTransferCount
  FROM landingClick as lc
  JOIN creatorLanding as cl
  ON cl.creatorId = lc.creatorId
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

// 크리에이터 레벨
router.get('/level', (req, res) => {
  const { name } = req.query;
  const query = `
  SELECT exp, level
  FROM creatorRoyaltyLevel as crl
  JOIN creatorLanding as cl
  ON cl.creatorId = crl.creatorId
  WHERE cl.creatorTwitchId = ?
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
      console.log(`ERROR - [${new Date().toLocaleString()}] - /level\n`, reason);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

/* ***********************************
 * ACTIONS
 * *********************************** */


// visitCount 처리 ( 아이피에 따른 카운트 차단 )
router.post('/visit', (req, res) => {
  const { name } = req.body;
  const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const VISIT_TYPE_NUM = 0; // db에서 방문의 type 넘버
  // ip 체크가 1시간 이내에 찍힌게 있는지 확인
  const ipCheckQuery = `
    SELECT ipAddress
    FROM landingClickIp as cli
    JOIN creatorInfo as ci
    ON ci.creatorId = cli.creatorId
    WHERE ci.creatorTwitchId = ? AND cli.ipAddress = ?
    AND type = ? AND cli.date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    `;
  const ipCheckArray = [name, userIp, VISIT_TYPE_NUM];

  const ipInsertQuery = `
    INSERT INTO landingClickIp  (creatorId, ipAddress, type)
    VALUES (
    (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?), ?, ?)
    `;
  const ipInsertArray = [name, userIp, VISIT_TYPE_NUM];

  // <랜딩페이지 입장>클릭 수 증가쿼리
  const visitUpdateQuery = `
    UPDATE creatorRoyaltyLevel
    SET visitCount = visitCount + ?
    WHERE creatorId = (SELECT creatorId FROM creatorInfo WHERE creatorTwitchId = ?)`;
  const visitUpdateArray = [1, name];

  let lastResult = {
    error: null,
    result: { ipCheck: {}, ipInsert: {}, visitUpdate: {} }
  };
  doQuery(ipCheckQuery, ipCheckArray)
    .then((row) => {
      console.log('========================= [방문] =========================');
      const { error, result } = row;

      if (!error) {
        if (result.length === 0) {
          lastResult.result.ipCheck = { error: null, result: 'success' };
          // 이전에 찍힌 ip가 없는 경우
          logger(`방문-${name}`, userIp, '이전의 IP가 아니기 때문에 작업');
          Promise.all([
            doQuery(ipInsertQuery, ipInsertArray)
              .then((ipInsertRow) => {
                logger(`방문-${name},ipInsert`, userIp, '새로운 IP 적재 완료');
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
                logger(`방문-${name},ipInsert`, userIp, `새로운 IP 적재오류 - ${reason}`);
                lastResult.result.ipCheck = { error: true, reason };
              }),

            doQuery(visitUpdateQuery, visitUpdateArray)
              .then((clickUpdateRow) => {
                logger(`방문-${name},visitUpdate`, userIp, '방문 수 업데이트 작업 완료');
                const { clickUpdateError, clickUpdateResult } = clickUpdateRow;
                if (!clickUpdateError) { // 쿼리 과정에서 오류가 아닌 경우
                  if (result) { // 쿼리 결과가 있는 경우
                    lastResult.result.visitUpdate = { error: null, result: clickUpdateResult };
                  } else { // 쿼리 결과가 없는 경우
                    lastResult.result.visitUpdate = { error: true, result: null };
                  }
                } else { // 쿼리 과정에서 오류인 경우
                  lastResult.result.visitUpdate = { error: true, result: error };
                }
              })
              .catch((reason) => { // db 쿼리 수행 과정의 오류인 경우
                logger(`방문-${name},visitUpdate`, userIp, `방문 수 업데이트 오류 - ${reason}`);
                lastResult.result.visitUpdate = { error: true, reason };
              })
          ])
            .then(() => {
              res.send(lastResult);
            });
        } else {
          // 이전에 찍힌 ip가 있는 경우
          logger(`방문-${name}`, userIp, '이미 방문한 IP, SKIP');
          lastResult = { error: null, result: 'fail' };
          res.send(lastResult);
        }
      }
    })
    .catch((reason) => {
      logger(`방문-${name}`, userIp, `아이피 조회 에러 - ${reason}`);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 배너 클릭시, 클릭 수 + 1
router.post('/banner/click', (req, res) => {
  const TRANSFER_TYPE_NUM = 1; // db에서 이동의 type 넘버
  const { name } = req.body;
  const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const { campaignId, creatorId } = req.body;

  // ip체크쿼리
  const ipCheckQuery = `
    SELECT ipAddress
    FROM landingClickIp
    WHERE campaignId = ? AND creatorId = ?
    AND type = ? AND ipAddress = ?
    AND date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    `;
  const ipCheckArray = [campaignId, creatorId, TRANSFER_TYPE_NUM, userIp];

  const ipInsertQuery = `
    INSERT INTO landingClickIp 
    (campaignId, creatorId, ipAddress, type)
    VALUES (?, ?, ?, ?)
    `;
  const ipInsertArray = [campaignId, creatorId, userIp, TRANSFER_TYPE_NUM];

  const clickUpdateQuery = `
    UPDATE landingClick
    SET clickCount = clickCount + ?
    WHERE campaignId = ? AND creatorId = ?`;
  const clickUpdateArray = [1, campaignId, creatorId];

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
      console.log('========================= [조회] =========================');
      const { error, result } = row;
      if (!error) {
        if (result.length === 0) {
          lastResult.result.ipCheck = { error: null, result: 'success' };
          // 이전에 찍힌 ip가 없는 경우
          logger(`조회-${name}`, userIp, '이전의 IP가 아니기 때문에 작업');
          Promise.all([
            doQuery(ipInsertQuery, ipInsertArray)
              .then((ipInsertRow) => {
                logger(`조회-${name},ipInsert`, userIp, '새로운 IP 적재 완료');
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
                logger(`조회-${name},ipInsert`, userIp, `새로운 IP 적재오류 - ${reason}`);
                lastResult.result.ipCheck = { error: true, reason };
              }),
            doQuery(clickUpdateQuery, clickUpdateArray)
              .then((clickUpdateRow) => {
                logger(`조회-${name},visitUpdate`, userIp, '방문 수 업데이트 작업 완료');
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
                logger(`조회-${name},visitUpdate`, userIp, `방문 수 업데이트 오류 - ${reason}`);
                lastResult.result.clickUpdate = { error: true, reason };
              })
          ])
            .then(() => {
              res.send(lastResult);
            });
        } else {
          // 이전에 찍힌 ip가 있는 경우
          logger(`조회-${name}`, userIp, '이미 방문한 IP, SKIP');
          lastResult = { error: null, result: 'fail' };
          res.send(lastResult);
        }
      }
    })
    .catch((reason) => {
      logger(`조회-${name}`, userIp, `아이피 조회 에러 - ${reason}`);
      lastResult = { error: true, reason };
      res.send(lastResult);
    });
});

// 배너 <이동> 버튼 클릭 시, 이동 수 + 1
router.post('/banner/transfer', (req, res) => {
  const TRANSFER_TYPE_NUM = 2; // db에서 이동의 type 넘버
  const { name } = req.body;
  const userIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
  const { campaignId, creatorId } = req.body;

  // Queries
  // ip 체크가 1시간 이내에 찍힌게 있는지 확인
  const ipCheckQuery = `
    SELECT ipAddress
    FROM landingClickIp
    WHERE campaignId = ? AND creatorId = ?
    AND date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    AND type = ? AND ipAddress = ?
    `;
  const ipCheckArray = [campaignId, creatorId, TRANSFER_TYPE_NUM, userIp];

  const ipInsertQuery = `
    INSERT INTO landingClickIp 
    (campaignId, creatorId, ipAddress, type)
    VALUES (?, ?, ?, ?)
    `;
  const ipInsertArray = [campaignId, creatorId, userIp, TRANSFER_TYPE_NUM];

  // <이동>클릭 수 증가쿼리
  const clickUpdateQuery = `
    UPDATE landingClick
    SET transferCount = transferCount + ?
    WHERE campaignId = ? AND creatorId = ?`;
  const clickUpdateArray = [1, campaignId, creatorId];

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
      console.log('========================= [이동] =========================');
      const { error, result } = row;
      if (!error) {
        if (result.length === 0) {
          lastResult.result.ipCheck = { error: null, result: 'success' };
          // 이전에 찍힌 ip가 없는 경우
          logger(`이동-${name}`, userIp, '이전의 IP가 아니기 때문에 작업');
          Promise.all([
            doQuery(ipInsertQuery, ipInsertArray)
              .then((ipInsertRow) => {
                logger(`이동-${name},ipInsert`, userIp, '새로운 IP 적재 완료');
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
                logger(`이동-${name},ipInsert`, userIp, `새로운 IP 적재오류 - ${reason}`);
                lastResult.result.ipCheck = { error: true, reason };
              }),
            doQuery(clickUpdateQuery, clickUpdateArray)
              .then((clickUpdateRow) => {
                logger(`이동-${name},visitUpdate`, userIp, '방문 수 업데이트 작업 완료');
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
                logger(`이동-${name},visitUpdate`, userIp, `방문 수 업데이트 오류 - ${reason}`);
                lastResult.result.clickUpdate = { error: true, reason };
              })
          ])
            .then(() => {
              res.send(lastResult);
            });
        } else {
          // 이전에 찍힌 ip가 있는 경우
          logger(`이동-${name}`, userIp, '이미 방문한 IP, SKIP');
          lastResult = { error: null, result: 'fail' };
          res.send(lastResult);
        }
      }
    })
    .catch((reason) => {
      console.log(reason);
      logger(`이동-${name}`, userIp, `아이피 조회 에러 - ${reason}`);
      res.send(lastResult);
    });
});

module.exports = router;
