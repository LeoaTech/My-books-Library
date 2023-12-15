const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { Client } = require("pg");
const connectionUrl = process.env.CONNECTION_URL;

const client = new Client(connectionUrl);

// async function run() {
//   try {
//     await client.connect();

//     console.log("Connected");
//   } catch (error) {
//     console.log(error);
//     await client.end();
//   }
//   run().catch(console.dir);
// };

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "59s" });
};

const refreshToken = (id) => {
  return jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "10m" });
};

// Create New User Account
const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(req.body);

  try {
    if (!name || !email || !password || !role) {
      res.status(400);
      throw Error("Please add all required fields");
    }
    // Vaidation of Signup Form fileds

    if (!validator.isEmail(email)) {
      throw Error("Email must be a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Please enter a strong password");
    }
    try {
      await client.connect();

      // check if user exists
      const userExists = await client.query(
        "SELECT * FROM users Where email = $1",
        [email]
      );

      if (userExists?.rowCount === 1) {
        res.status(400).json({ message: "User already exists" });
      }

      // create hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt?.hash(password, salt);

      console.log("Connected", hashedPassword);

      // create user
      const user = await client.query(
        `INSERT INTO users (name, email, password, role,auth_token) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPassword, role, ""]
      );

      console.log(user.rowCount);

      if (user.rowCount > 0) {
        let userToken = generateToken(user?.rows[0]?.id);
        try {
          const userUpdate = await client.query(
            `update users set auth_token=$1 where email= $2 Returning *`,
            [userToken, email]
          );

          console.log(userUpdate, "update");
          if (userUpdate?.rowCount > 0) {
            res.status(201).json(userUpdate?.rows[0]);
          } else {
            res.status(201).json({ ...user?.rows[0], auth_token: userToken });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        res.status(400).json("Invalid user data");
      }
    } catch (error) {
      console.log(error);
      await client.end();
    } finally {
      await client.end();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//   Authenticate user on Logged in
const LoginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res.status(400);
    throw Error("Please add all fields");
  }
  try {
    await client.connect();
    // Check for user email
    const userEmail = await client.query(
      `SELECT * from users where email= $1`,
      [email]
    );
    let user = userEmail?.rows[0];

    if (!user) {
      throw Error("Invalid Email Address");
    }
    let matchPassword = await bcrypt.compare(password, user?.password);

    if (!matchPassword) {
      throw Error("Invalid Password");
    }

    const AuthToken = generateToken(user.id);
    if (user && matchPassword) {
      console.log(user.auth_token, "DB", AuthToken);
      try {
        const userUpdate = await client.query(
          `update users set auth_token=$1 where email= $2 Returning *`,
          [AuthToken, email]
        );

        if (userUpdate?.rowCount > 0) {
          let data = userUpdate?.rows[0];
          res.status(201).json({
            id: data?.id,
            name: data?.name,
            email: data?.email,
            token: data?.auth_token,
          });
        } else {
          res.status(201).json({
            id: user?.id,
            name: user?.name,
            email: user?.email,
            token: AuthToken,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(400).json({ error: error.message } || "Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    await client.end();
  } finally {
    await client.end();
  }
};

const RefreshToken = async (req, res) => {
  try {
    await client.connect();

    const token = await client.query(``)
  } catch (error) {
    console.log(error);
    await client.end();
  } finally {
    await client.end();
  }
};
const ForgetPassword = (req, res) => {};

const LogoutUser = (req, res) => {};

module.exports = { RefreshToken,LoginUser, LogoutUser, ForgetPassword, RegisterUser };
