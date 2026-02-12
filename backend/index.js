const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

// Subscribe Route
const { notfound, errorHanlder } = require("./middleware/errorMiddleware.js");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);

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
const settingsRoutes = require("./routes/SettingsRoutes/SettingsRoutes.js");
const pricingRoutes = require("./routes/SettingsRoutes/Pricing/PricingRoutes.js");

// Client Checkout session routes
const stripeCheckout = require("./routes/PaymentRoutes/StripeCheckout.js");
const cancelSubscription = require("./routes/PaymentRoutes/CancelSubscriptionRoute.js"); //active Free Plan
const resumeSubscription = require("./routes/PaymentRoutes/ResumeSubscriptionRoute.js");
const changeSubscription = require("./routes/PaymentRoutes/ChangeSubscriptionRoute.js"); //active School Plan
const currentPlan = require("./routes/PaymentRoutes/CurrentActivePlan.js");
const dashboardRoute = require("./routes/dashboardRoutes/DashboardRoutes.js");
const stripeStatus = require("./routes/PG_Onboarding/StripeStatus.js");
const stripeConnect = require("./routes/PG_Onboarding/StripeConnect.js");
const stripeOnboarding = require("./routes/PG_Onboarding/StripeOnboarding.js");

const fineCheckoutSession = require("./routes/PaymentRoutes/FineCheckout.js")
const wishlistRoute = require("./routes/ProductWishlist/ProductWishlistRoute.js")
const uploadBooksFromFile = require("./routes/booksRoutes/FileUploadBooks.js");

const webhooks = require("./webhooks/stripe/index.js"); //Stripe webhook


const notificationRoute = require("./routes/NotificationRoutes/NotificationRoutes.js");
const libraryRoutes = require("./routes/LibraryRoutes");

// Cron Job
require("./services/scheduleTask.js"); //Add Due Date Fine

const { pool } = require("./config/dbConfig.js");
const stripeRouter = require("./routes/PG_Onboarding/StripeOauth.js");
const port = process.env.PORT || 8100;

const app = express();

app.set("trust proxy", 1);

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      createTable: true,
      errorLog: (err) => console.error("Session store error:", err), // Log DB errors
    }),
    secret: process.env.SESSION_SECRET || "test", // Use env var in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.options("*", cors());
app.use(webhooks); //stripe webhook,

// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(cookieParser()); //cookies middleware
app.use(passport.initialize());

app.use(passport.session());

app.get("/", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  // console.log(`Views: ${req.session.views}`);

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
// Pricing Plans and Settings
app.use("/api/settings", settingsRoutes);
app.use("/api/pricing", pricingRoutes);

//Dashboard Routes

app.use("/api/dashboard", dashboardRoute);
app.use("/api/create-checkout-session", stripeCheckout);
app.use("/api/cancel-subscription", cancelSubscription);
app.use("/api/resume-subscription", resumeSubscription);
app.use("/api/change-subscription", changeSubscription);
app.use("/api/current-plan", currentPlan);

// Fine Payment Session
app.use("/api/create-fine-checkout-session", fineCheckoutSession);

/* Payment Method - Connect Stripe Account for Client Onboarding  */
app.use("/api/library/:entityId/stripe/status", stripeStatus);
app.use("/api/library/:entityId/stripe/onboarding-complete", stripeOnboarding);
app.use("/api/library/:entityId/stripe/connect", stripeConnect);

app.use("/api/library", libraryRoutes);

// Stripe Oauth Flow for Connecting Existing Accounts
app.use(stripeRouter);
app.use(uploadBooksFromFile);


// Add Book Item to Wishlist:
app.use(wishlistRoute)

// Notification templates
app.use("/api/notifications", notificationRoute)


app.use(notfound);
app.use(errorHanlder);

app.listen(port, () => {
  // console.log("Server is listening on port", port);
});

module.exports = app;
