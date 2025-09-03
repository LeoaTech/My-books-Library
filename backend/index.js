const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { notfound, errorHanlder } = require("./middleware/errorMiddleware.js");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const pgSession = require('connect-pg-simple')(session);

// * Import routes
const authRouter = require("./routes/authenticationRoutes/AuthRouter.js");
const booksRouter = require("./routes/booksRoutes/BooksRoutes.js");
const googleOAuthRouter = require("./routes/authenticationRoutes/GoogleAuthRoute.js");
const userRouter = require("./routes/UserRoutes.js");
const rolesRouter = require("./routes/RolesRoute.js");
const permissionsRouter = require("./routes/PermissionsRoutes.js");
const rolePermissionsRouter = require("./routes/RolesPermissionRoute.js");
const authorsRouter = require("./routes/AuthorsRoutes.js");
const conditionsRoutes = require("./routes/ConditionsRoutes.js");
const categoryRoutes = require("./routes/CategoriesRoutes.js");
const coversRoutes = require("./routes/CoversRoutes.js");
const publisherRoutes = require("./routes/PublishersRoutes.js");
const vendorsRoutes = require("./routes/VendorsRoutes.js");
const branchRoutes = require("./routes/BranchRoutes.js");
const ordersRoutes = require("./routes/OrdersRoutes/OrdersRoutes.js");
const bookingRoutes = require("./routes/BookingsRoutes/index.js");
const { pool } = require("./config/dbConfig.js");
const port = process.env.PORT || 8100;


const app = express();
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false || process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       // maxAge: 3600000,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day max
//     },
//   })
// );


app.use(session({
  store: new pgSession({
    pool: pool, // Use the same pool as your app
    tableName: 'session' // Optional: custom table name
  }),
  secret: process.env.SESSION_SECRET || 'test', // Use env var in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


// app.options("*", cors());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());
app.use(cookieParser()); //cookies middleware
app.use(passport.initialize());

app.use(passport.session());

app.get("/", (req, res) => {
  
  req.session.views = (req.session.views || 0) + 1;
  console.log(`Views: ${req.session.views}`);

  res.json({ status: "Backend is running", clientUrl: process.env.CLIENT_URL });
});
// * Routes
app.use("/", googleOAuthRouter);
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/permissions", permissionsRouter);
app.use("/api/roles-permissions", rolePermissionsRouter);

app.use("/api/authors", authorsRouter);
app.use("/api/conditions", conditionsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/covers", coversRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/orders", ordersRoutes);
// Bookings Routes
app.use(bookingRoutes);

app.use(notfound);
app.use(errorHanlder);


if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log("Server is listening on port", port);
  });
}
module.exports = app;
