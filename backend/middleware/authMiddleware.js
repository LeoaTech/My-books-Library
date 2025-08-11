const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  // Verify Authorized access

  console.log(req.headers, "Headers");
  // Bearer Token
  const authorization =
    req.headers?.Authorization || req.headers?.authorization;

  if (!authorization?.startsWith("Bearer "))
    return res.status(401).json({ error: "Un-authorized" });

  const token = authorization.split(" ")[1];

  console.log(req.user, "Auth");
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid Token" });
      console.log(decoded);
      req.user = decoded?.UserInfo;
      req.userId = decoded.UserInfo.id;
      req.role = decoded.UserInfo.role_id;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not Authorized" });
  }
};

// Verify Authorization of a User using JWT or User Authentication
const checkAuth = async (req, res, next) => {
  const authorization = req.headers?.cookie;

  // Parsing the cookie string to extract individual cookie values
  const cookiesArray = authorization.split(";").map((cookie) => cookie.trim());

  if (!cookiesArray?.length)
    return res.status(401).json({ error: "Un-authorized" });

  if (req.user) {
    console.log(req.user, "Check Auth");

    //extract user data from request
    req.user = req.user;
    next();
  } else {
    // Find the "refreshToken" cookie and extract its value
    let refreshTokenValue;
    for (const cookie of cookiesArray) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === "refreshToken") {
        refreshTokenValue = cookieValue;
        break;
      }
    }

    try {
      jwt.verify(
        refreshTokenValue,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err) return res.status(403).json({ error: "Invalid Token" });
          console.log(decoded, "refersh token cookie");
          req.user = decoded?.data;
          req.userId = decoded?.data.userId;
          req.roleId = decoded?.data.roleId;
          req.entityId = decoded?.data?.entityId;
          req.branchId = decoded?.data?.branchId;
          next();
        }
      );
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Request is not Authorized" });
    }
  }
};

module.exports = { requireAuth, checkAuth };
