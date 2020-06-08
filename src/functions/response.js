module.exports = response = (res, code, message, token) => {
  return res.send({
    code,
    message,
    token,
  });
};

// class Response {
//   res;
//   constructor(res) {
//     this.res = res;
//   }

//   sendResponse(responseData) {
//     return this.res.send({
//       code: responseData.code,
//       message: responseData.message,
//       token: responseData.token,
//     });
//   }
// }

// module.exports = Response;
