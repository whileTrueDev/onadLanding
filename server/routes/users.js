// import
const express = require('express');
const doQuery = require('../model/doQuery');
const preprocessing = require('../middlewares/preprocessingData/');
const CustomDate = require('../middlewares/customDate');

const router = express.Router();
const listOfWithdrawal = preprocessing.withdrawalList;
const { preprocessingBannerData } = preprocessing;


// 크리에이터 수익금 라우터 및 정보조회
// doQuery 완료.
router.get('/income', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const dataQuery = `
  SELECT 
  creatorTotalIncome, creatorReceivable, creatorAccountNumber, DATE_FORMAT(creatorIncome.date, '%y년 %m월 %d일 %T') as date
  FROM creatorInfo as ci
  JOIN creatorIncome 
  ON ci.creatorId = creatorIncome.creatorId
  WHERE ci.creatorId= ? 
  ORDER BY date desc
  LIMIT 1`;

  doQuery(dataQuery, [creatorId])
    .then((row) => {
      const result = row.result[0];
      result.date = result.date.toLocaleString();
      res.json(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 크리에이터 광고 내역 라우터
// doQuery 완료.
router.get('/matchedBanner', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const bannerQuery = `
  SELECT bm.contractionTime, mi.marketerName, bm.contractionState, br.bannerSrc
  FROM bannerMatched as bm
  JOIN bannerRegistered as br 
  ON SUBSTRING_INDEX(bm.contractionId, '/', 1) = br.bannerId
  JOIN marketerInfo as mi
  ON SUBSTRING_INDEX(br.bannerId, '_', 1) = mi.marketerId
  WHERE contractionId LIKE CONCAT('%', ?, '%')
  ORDER BY contractionTime DESC
  `;
  doQuery(bannerQuery, [creatorId])
    .then((row) => {
      if (row.result.length > 0) {
        const result = preprocessingBannerData(row.result);
        res.send(result);
      } else {
        res.send({
          columns: ['배너', '광고주', '첫 게시일', '현재 상태'],
          data: []
        });
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 크리에이터 현재 광고 중 배너
// doQuery 완료.
router.get('/currentBanner', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  // DB연결후 query문을 통한 데이터 삽입
  const queryState = `
  SELECT marketerName, bannerSrc FROM contractionTimestamp AS ct
  JOIN marketerInfo as mi
  ON substring_index(ct.contractionId, '_', 1) = mi.marketerId
  JOIN bannerRegistered as br
  ON substring_index(ct.contractionId, '/', 1) = br.bannerId
  WHERE ct.contractionId like concat('%', ?, '%')
  ORDER BY ct.date DESC
  LIMIT 1`;

  doQuery(queryState, [creatorId])
    .then((row) => {
      const result = row.result.map((value) => {
        value = Object.values(value);
        return value;
      });
      res.send(result);
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// 배너 오버레이 URL 주소 가져오기
// doQuery 완료.
router.get('/overlayUrl', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const urlQuery = `
  SELECT advertiseUrl, creatorContractionAgreement
  FROM creatorInfo
  WHERE creatorId = ?
  `;
  doQuery(urlQuery, [creatorId])
    .then((row) => {
      res.send(row.result[0]);
    })
    .catch(() => {
      res.end();
    });
});


// 수익관리 탭의 크리에이터 별 수익금 차트 데이터
// doQuery 완료
router.get('/chartdata', (req, res, next) => {
  // creatorId 가져오기
  const { creatorId } = req._passport.session.user;
  const { dateRange } = req.query;
  // 하루마다 가장 마지막 시간의 데이터를 가져온다.
  const rangeQuery = `
  SELECT
  creatorTotalIncome, creatorReceivable, DATE_FORMAT(date, '%m-%d') as date
  FROM creatorIncome
  JOIN (
    SELECT 
    MAX(date) as d1
    FROM creatorIncome
    WHERE creatorId = ?
    AND date >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE_FORMAT(date, '%y%m%d')
  ) tmp
  ON creatorIncome.date = tmp.d1
  WHERE creatorId = ?
  ORDER BY tmp.d1 ASC
  `;

  const accountQuery = `
  SELECT creatorAccountNumber 
  FROM creatorInfo 
  WHERE creatorId = ?`;

  doQuery(accountQuery, [creatorId])
    .then((row) => {
      doQuery(rangeQuery, [creatorId, dateRange, creatorId])
        .then((inrows) => {
          const result = {
            creatorAccountNumber: row.result[0].creatorAccountNumber,
            totalIncomeData: [],
            receivableData: [],
            labels: [],
          };
          if (inrows.result.length > 0) {
            inrows.result.map((inrow) => {
              result.totalIncomeData.push(inrow.creatorTotalIncome);
              result.receivableData.push(inrow.creatorReceivable);
              result.labels.push(inrow.date);
            });
            res.send(result);
          } else {
            res.end();
          }
        })
        .catch((errorData) => {
          console.log(errorData);
          res.end();
        });
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

// creator contraction Update
// doQuery 완료
router.post('/contraction', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const updateQuery = `
  UPDATE creatorInfo
  SET creatorContractionAgreement = ?
  WHERE creatorInfo.creatorId = ?`;

  doQuery(updateQuery, [1, creatorId])
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.end();
    });
});

// 크리에이터 출금신청 / 출금신청 금액만큼 creatorIncome에서 제외
// doQuery 완료
router.post('/withdrawal', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const withdrawlAmount = req.body.withdrawalAmount;

  const creatorWithdrawalQuery = `
  INSERT INTO creatorWithdrawal
  (creatorId, creatorWithdrawalAmount, withdrawalState)
  VALUES (?, ?, ?)`;

  const creatorIncomeQuery = `
  INSERT INTO creatorIncome 
  (creatorId, creatorTotalIncome, creatorReceivable)
  SELECT creatorId, creatorTotalIncome, creatorReceivable - ?
  FROM creatorIncome
  WHERE creatorId = ?
  ORDER BY date DESC
  LIMIT 1`;

  Promise.all([
    doQuery(creatorWithdrawalQuery, [creatorId, withdrawlAmount, 0]),
    doQuery(creatorIncomeQuery, [withdrawlAmount, creatorId])
  ])
    .then(() => {
      res.send({
        error: null
      });
    })
    .catch(() => {
      res.send({
        error: true
      });
    });
});

// doQuery 완료
router.get('/profile', (req, res) => {
  const profileQuery = `
  SELECT creatorId, creatorName, creatorIp, creatorMail, creatorAccountNumber, creatorContractionAgreement
  FROM creatorInfo 
  WHERE creatorId = ?`;
  if (req._passport.session === undefined) {
    res.send({
      error: true,
    });
  } else {
    const { creatorId } = req._passport.session.user;
    doQuery(profileQuery, [creatorId])
      .then((data) => {
        const userData = data.result[0];
        const localIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트 ip주소 얻는 부분
        userData.localIp = localIp;
        userData.creatorLogo = req._passport.session.user.creatorLogo;
        res.send({
          error: false,
          result: userData,
        });
      })
      .catch(() => {
        res.send({
          error: true,
        });
      });
  }
});

// 크리에이터 출금 내역 불러오기
// doQuery 완료
router.get('/listOfWithdrawal', (req, res, next) => {
  // creatorID 가져오기
  const { creatorId } = req._passport.session.user;

  const listQuery = `
  SELECT
  date, creatorWithdrawalAmount, withdrawalState
  FROM creatorWithdrawal
  WHERE creatorId= ?
  ORDER BY date DESC
  `;

  doQuery(listQuery, creatorId)
    .then((row) => {
      if (row.result.length > 0) {
        const result = listOfWithdrawal(row.result);
        res.send(result);
      } else {
        res.end();
      }
    })
    .catch((errorData) => {
      console.log(errorData);
      res.end();
    });
});

router.post('/ipchange', (req, res, next) => {
  const newIp = req.body.value;
  const { creatorId } = req._passport.session.user;
  console.log(req);
  const ipQuery = 'UPDATE creatorInfo SET creatorIp = ? WHERE creatorId = ?';
  doQuery(ipQuery, [newIp, creatorId])
    .then(() => {
      console.log(`${creatorId}님 IP변경완료`);
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

// doQuery 수정
router.post('/welcome', (req, res, next) => {
  const { creatorId } = req._passport.session.user;
  const dateCode = new CustomDate().getCode();

  const insertQuery = `
  INSERT INTO bannerMatched 
  (contractionId)
  SELECT CONCAT("onad6309_01", "/", creatorId, "/", ?)
  FROM creatorInfo
  WHERE creatorId = ?
  `;
  const updateQuery = `
  UPDATE creatorInfo
  SET creatorContractionAgreement = ?
  WHERE creatorInfo.creatorId = ?`;

  Promise.all([
    doQuery(insertQuery, [dateCode, creatorId]),
    doQuery(updateQuery, [1, creatorId])
  ])
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

module.exports = router;
