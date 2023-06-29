import sql from "mssql";
import config from "../db/config.js";

//fetching all the bookings
export const getBookings = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM Bookings");
    res.send(result.recordset);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const getSingleBookings = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("select * from Bookings WHERE booking_id=@id");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
//deleting user by using id
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query(`DELETE FROM Bookings WHERE booking_id = ${id} `);
    res.status(200).json({ message: "Deleted booking successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createBookings = async (req, res) => {
  try {
    const { booking_id, property_id, user_id, check_in_date, check_out_date } =
      req.body;

    // if (!user_id) {
    //   throw new Error("Missing 'user_id' property in request body");
    //}
    let pool = await sql.connect(config.sql);
    await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .input("booking_id", sql.Int, booking_id)
      .input("property_id", sql.Int, property_id)
      .input("check_in_date", sql.Date, check_in_date)
      .input("check_out_date", sql.Date, check_out_date)

      .query(
        "INSERT INTO Bookings (booking_id, property_id, user_id, check_in_date, check_out_date) VALUES(@user_id, @booking_id, @property_id, @check_in_date, @check_out_date) "
      );

    res.status(200).json("created successfully");
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
