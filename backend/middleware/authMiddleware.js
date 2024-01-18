const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

client.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("auth-middlware connected");
  }
});
const requireAuth = async (req, res, next) => {
  // Verify Authorized access

  console.log(req.headers, "Headers");
  // Bearer Token
  const authorization =
    req.headers?.Authorization || req.headers?.authorization;

  if (!authorization?.startsWith("Bearer "))
    return res.status(401).json({ error: "Un-authorized" });

  const token = authorization.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid Token" });
      console.log(decoded);
      req.user = decoded?.UserInfo?.id;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not Authorized" });
  }
};

module.exports = requireAuth;
