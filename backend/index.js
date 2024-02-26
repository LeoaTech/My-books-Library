const express = require("express");
const cors = require("cors");
require("dotenv").config();
const store = require("./config/dbConfig.js");
const bodyParser = require("body-parser");
const { notfound, errorHanlder } = require("./middleware/errorMiddleware.js");
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
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
const port = process.env.PORT || 8100;

const app = express();

app.use(passport.initialize());

// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );

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
    origin: ["http://localhost:5173", "http://localhost:8000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); //cookies middleware

app.use("/", googleOAuthRouter);
app.use("/auth", authRouter);
app.use("/books", booksRouter);
app.use("/users", userRouter);
app.use("/roles", rolesRouter);
app.use("/permissions", permissionsRouter);
app.use("/roles-permissions", rolePermissionsRouter);

app.use("/authors", authorsRouter);
app.use("/conditions", conditionsRoutes);
app.use("/categories", categoryRoutes);
app.use("/covers", coversRoutes);
app.use("/publishers", publisherRoutes);
app.use("/vendors", vendorsRoutes);
app.use("/branches", branchRoutes);
app.use(notfound);
app.use(errorHanlder);

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
