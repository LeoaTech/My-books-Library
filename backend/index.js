const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const  connectDb = require("./config/dbConfig.js");
const authRouter = require("./routes/authenticationRoutes/AuthRouter.js")

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth',authRouter)

app.get("/", (req,res)=>{
    res.send("Home Page")
})
app.listen(port, () => {
  console.log("Server is listening on port", port);
});

connectDb();
