const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { notfound, errorHanlder } = require("./middleware/errorMiddleware.js");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

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
const port = process.env.PORT || 8100;

const app = express();

app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.session());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "process.env.SERVER_URL"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json());
app.use(cookieParser()); //cookies middleware

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
app.get("/test", (req, res) => {
  res.send("Home Page");
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
