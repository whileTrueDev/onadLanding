const express = require('express');
const doQuery = require('../lib/doQuery');
const logger = require('../middleware/landingActionLogging');
const axios = require('axios');
const router = express.Router();
const MobileDetect = require('mobile-detect');

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
    
  WHERE creatorTwitchId = ? AND campaign.deletedState = 0
    AND campaign.onOff = 1 AND mi.marketerContraction = 1
    AND campaign.optionType != 0
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

// manplus에서 배너이미지 가져오기.
// check가 참이라는 의미는 입장시에 size가 모바일이었다.
router.post('/manplus', (req, res)=>{
 
  const { 
    name,
    dscreen, 
    dosindex,
    dosv,
    dmaker,
    dmodel,
    dos
   } = req.body;

  const params = {
    e_version:'2',
    a_publisher:'1543',
    a_media:'32014',
    a_section:'804388',
    i_response_format:"json",
    i_rich_flag	: '1',
    d_used_type : "api",
    d_screen: dscreen,
    d_os_index: dosindex,
    d_osv: dosv,
    d_maker: dmaker,
    d_model: dmodel,
    d_os:  dos
  }

  // 모바일이나 데스크탑일 경우에만 작동
  if(dscreen  === '1' && name === 'iamsupermazinga') {
    console.log('광고 노출을 위해 요청합니다.');
    axios.get('https://mtag.mman.kr/get_ad.mezzo/', {params})
    .then((row)=>{
      try {
        if(row.data === null){
          res.send({ error: true, result: {}});
        }
        const {adsinfo} = row.data;
        const {error_code, use_ssp} = adsinfo;
        
        // 하우스일 경우, SSP 호출 추후에는 0=> 5로변경
        // 광고 성공 및 SSP 사용일 경우
        if(error_code === '0' && use_ssp === '1'){
          console.log('하우스 이므로 SSP 요청합니다.');
          const ssp_params = {...params, i_banner_w: '320', i_banner_h:'50'};
          console.log(ssp_params);
          axios.get('http://ssp.meba.kr/ssp.mezzo/', {params : {...params, i_banner_w: '320', i_banner_h:'50'}})
          .then((inrow)=>{
            const ssp_error_code = inrow.data.error_code;
            // 반드시 error_code 존재, 광고가 없음 => 하우스 광고 진행
            // 광고성공, SSP요청을 진행하였으나 광고가없으므로 하우스로진행
            if(ssp_error_code === "5"){
              console.log("SSP광고가 없으므로 하우스광고를 진행합니다.");
              const { impression_api, click_api, click_tracking_api, img_path, logo_img_path } = adsinfo.ad[0];
              const sendData =  { error: null, result: {img_path, impression_api, click_api, click_tracking_api, logo_img_path} }
              axios.get(impression_api)
              .then(()=>{
                console.log('노출 API를 통해 체크를 진행합니다.');
                res.send(sendData);
              })
              .catch(()=>{
                res.send(sendData);
              })
            } else if(ssp_error_code === "0") {
              const { img_path, landing_url, ssp_imp, ssp_click} = row.result[0];
              const sendData =  { error: null, result: { img_path, impression_api: ssp_imp, click_api: landing_url, click_tracking_api: ssp_click } }
              
              // 노출 API가 null일경우 회피하기위한 에러핸들링
              if(ssp_imp === null || ssp_imp === 'null' || ssp_imp === ''){
                axios.get(ssp_imp)
                  .then(()=>{
                    console.log('노출 API를 통해 체크를 진행합니다.');
                    res.send(sendData);
                  })
                  .catch(()=>{
                    res.send(sendData);
                  })
              }else{
                res.send(sendData);
              }
            } else{
              res.send({ error: true, result: {}});
            }
          })
        } else if (error_code !== '0'){
          //광고 성공이 아닐때, 
          res.send({ error: true, result: {}});
        }
        else {
          const { impression_api, click_api, click_tracking_api, img_path, logo_img_path } = adsinfo.ad[0];
          const sendData =  { error: null, result: {img_path, impression_api, click_api, click_tracking_api, logo_img_path} }

          axios.get(impression_api)
          .then(()=>{
            console.log('노출 API를 통해 체크를 진행합니다.');
            res.send(sendData);
          })
          .catch(()=>{
            res.send(sendData);
          })
        }
      }
        catch (e) {
        console.log(e);
        res.send({ error: true, result: {}});
      }
    })
  } else {
    res.send({ error: true, result: {}});
  }
})

// 광고가 노출되었다는 것을 manplus에 전달한다.
router.post('/manplus/impression', (req, res)=>{
  const { impression_api } = req.body;
  axios.get(impression_api)
  .then(()=>{
    res.send(true);
  })
})

// 광고가 클릭돠었음을 manplus에 전달한다.
router.post('/manplus/click', (req, res)=>{
  console.log('클릭을 체크합니다.')
  const { click_tracking_api } = req.body;

  // 클릭 API가 null일경우 회피하기위한 에러핸들링
  if(click_tracking_api === null || click_tracking_api === 'null' || click_tracking_api === ''){
    axios.get(click_tracking_api)
    .then(()=>{
      console.log('API로 클릭 체크를 진행합니다.');
      res.end();   
    });
  }else{
    res.end();   
  }
})

module.exports = router;
