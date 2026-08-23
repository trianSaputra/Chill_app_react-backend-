const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new ApiError("Token autentikasi diperlukan", 401);
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new ApiError("Format token tidak valid", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    throw new ApiError("Token tidak valid atau sudah kedaluwarsa", 401);
  }
};

module.exports = {
  verifyToken,
};
