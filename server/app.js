const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const slack = require('./middleware/slackNotification');
require('dotenv').config(); // for environment variables

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// error handler 무조건 app.use 중 맨 마지막에 위치해야 한다.
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err) {
    const where = req._parsedOriginalUrl.pathname;
    console.log(`[${new Date().toLocaleString()}] Error occurred in - ${where}\n${err}`);
    slack.push(`[ERROR] Landing API 서버에서 에러가 발생했습니다.
      에러메시지 : 
      ${err}`, `${where}`, 'onad_web_api');
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
