class apiErrorMessage {
  constructor(errCode, errMsg) {
    this.errCode = errCode;
    this.errMsg = errMsg;
  }
}

module.exports = {
  apiErrorMessage,
  AUTH_ERROR: 1,
  MONGO_ERROR: 2,
};
