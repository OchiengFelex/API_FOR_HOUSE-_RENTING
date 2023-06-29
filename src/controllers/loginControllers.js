import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { FirstName, LastName, Password, Email, username } = req.body;
  const hashedPassword = bcrypt.hashSync(Password, 10);
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("Email", sql.VarChar, Email)
      .query(
        "SELECT * FROM users WHERE username = @username OR Email = @Email"
      );
    const user = result.recordset[0];
    if (user) {
      res.status(409).json({ error: "Unauthorized, wrong credentials" });
    } else {
      await pool
        .request()
        .input("FirstName", sql.VarChar, FirstName)
        .input("LastName", sql.VarChar, LastName)
        .input("Email", sql.VarChar, Email)
        .input("Password", sql.VarChar, hashedPassword)
        .input("username", sql.VarChar, username)
        .query(
          "INSERT INTO Users (username, Email, Password, FirstName, LastName) VALUES (@username, @Email, @Password, @FirstName, @LastName)"
        );
      res.status(200).send({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

//

export const loginUser = async (req, res) => {
  const { username, Password } = req.body;
  let pool;
  try {
    pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM users WHERE username = @username");
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    if (!Password) {
      return res.status(401).json({ error: "Password is missing" });
    }

    // console.log("User:", user);
    // console.log("Password:", password);

    const PasswordMatch = await bcrypt.compare(Password, user.Password);

    if (!PasswordMatch) {
      return res.status(401).json({ error: "Unauthorized , wrong password" });
    }

    const token = jwt.sign(
      { username: user.username, Email: user.Email },
      config.jwt_secret
      //    { expiresIn: "1h" }
    );

    return res.status(200).json({
      Email: user.Email,
      username: user.username,
      id: user.id,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (pool) {
      pool.close();
    }
  }
};
