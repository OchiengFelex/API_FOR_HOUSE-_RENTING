import sql from "mssql";
import config from "../db/config.js";

//fetch all owners
export const getOwners = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query(" select * from owner");
    !result.recordset[0]
      ? res.status(404).json({ message: "owners not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
export const getSingleOwner = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("select * from owner WHERE owner_id=@id");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createOwner = async (req, res) => {
  const { owner_id, owner_name, contact } = req.body;

  try {
    let pool = await sql.connect(config.sql);
    let result1 = await pool
      .request()
      .input("owner_id", sql.Int, owner_id)
      .input("owner_name", sql.VarChar, owner_name)
      .input("contact", sql.VarChar, contact)
      .query(
        "INSERT INTO owner (owner_id, owner_name, contact) VALUES (@owner_id, @owner_name, @contact)"
      );
    // console.log(result1);
    res.status(201).json({ message: "Owner created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    sql.close();
  }
};

export const updateOwners = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_name, contact } = req.body;
    let pool = await sql.connect(config.sql);
    let request = pool.request();
    //  The input function to define the input parameters
    request
      .input("id", sql.Int, id)
      .input("owner_name", sql.VarChar, owner_name)
      .input("contact", sql.VarChar, contact);

    await request.query(
      "UPDATE owner SET owner_name=@owner_name, contact=@contact WHERE owner_id=@id"
    );
    res.status(200).json({ message: "Owner updated successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

//delete owners

export const deleteOwners = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query`DELETE FROM owner WHERE owner_id = ${id}`;
    res.status(200).json({ message: " deleted owner successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    sql.close();
  }
};
