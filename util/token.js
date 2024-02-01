const jwt = require("jsonwebtoken");
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const decryptToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const jwtResult = jwt.verify(token, process.env.JWT_SECRET);

      resolve(jwtResult);
    } catch (error) {
      reject(error.message);
    }
  });
};

module.exports = {
  decryptToken,
  generateToken,
};
