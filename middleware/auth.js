const { decryptToken } = require("../util/token");

const Authorization = async (req, res, next) => {
  if (!(req.session.jwt || req.cookies)) {
    return next({ message: "Please login to continue" });
  }
  try {
    let token = req.cookies ? req.cookies.omio : req.session.jwt;
    
    const payload = await decryptToken(token);
    console.log(payload);
    req.currentUser = {
      email: payload.email,
      id: payload.id,
    };

    next();
  } catch (error) {
    return next({ message: error.message });
  }
};

module.exports = Authorization;
