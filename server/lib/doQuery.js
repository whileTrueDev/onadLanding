const mysql = require('mysql');
const logger = require('../middleware/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  charset: process.env.DB_CHARSET,
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
  connectionLimit: 100,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
});
console.log('create pool!');

const doQuery = (query, queryArray = []) => new Promise((resolve, reject) => {
  pool.getConnection((err, conn) => {
    // 커넥션 시 에러발생
    if (err) {
      console.log('conn in err - getConnection 함수', conn);
      console.log(`DB연결 오류${err.message}`);
      logger.error(`DB연결 관련 오류${err}`);
      reject({
        error: err,
      });
    } else {
      conn.query(query, queryArray, (error, result) => {
        if (error) {
          conn.release();
          logger.error(`query 관련 오류 : ${error}`);
          reject({
            error: error.sqlMessage,
          });
        } else {
          conn.release();
          logger.info(query);
          resolve({
            error: null,
            result,
          });
        }
      });
    }
  });
});

module.exports = doQuery;
