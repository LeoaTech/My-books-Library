const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("./config/dbConfig.js");
const { notfound, errorHanlder } = require("./middleware/errorMiddleware.js");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authenticationRoutes/AuthRouter.js");
const booksRouter = require("./routes/booksRoutes/BooksRoutes.js");

const port = process.env.PORT || 8100;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());  //cookies middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/books", booksRouter);
app.use(notfound);
app.use(errorHanlder);

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.listen(port, () => {
  console.log("Server is listening on port", port);
});

connectDb();
