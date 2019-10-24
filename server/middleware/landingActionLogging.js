function actionLogging(a, b, c) {
  const date = new Date().toLocaleString();
  const log = `[${date}] [${a}] [${b}] ${c}`;
  console.log(log);
  return log;
}

module.exports = actionLogging;
