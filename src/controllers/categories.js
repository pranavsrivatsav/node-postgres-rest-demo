const { pool } = require("../services/database");

exports.getCategories = async function (req, res) {
  try {
    const result = await pool.query("select * from category");
    return res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send("Sorry, We encountered an error! Please try again.");
  }
};

exports.createCategory = async function (req, res) {
  try {
    const { name: categoryName } = req.body;

    //check if category Name is not null in the body
    if (!categoryName) throw new Error("NO_CATEGORY");

    //check if category already exists in the table
    const existQuery = {
      text: "SELECT EXISTS (SELECT * from category WHERE name = $1)",
      values: [categoryName],
    };
    const existRes = await pool.query(existQuery);
    if (existRes.rows[0].exists) throw new Error("ALREADY_EXISTS");

    const insertQuery = {
      text: "INSERT INTO category(name) VALUES($1) RETURNING *",
      values: [categoryName],
    };
    const insertRes = await pool.query(insertQuery);
    res.status(200).send(insertRes.rows[0]);
  } catch (error) {
    console.error(error);
    let statusCode, errorMessage;
    switch (error.message) {
      case "NO_CATEGORY":
        statusCode = 422;
        errorMessage = "category: name is a mandatory field";
        break;
      case "ALREADY_EXISTS":
        statusCode = 409;
        errorMessage = "category already exists";
        break;
      default:
        statusCode = 500;
        errorMessage = "Sorry, We encountered an error! Please try again.";
        break;
    }
    res.status(statusCode).send(errorMessage);
  }
};

exports.updateCategory = async function (req, res) {
  try {
    const id = req.params.id;
    const name = req.body.name;

    if (!name) {
      throw new Error("NO_CATEGORY");
    }

    const updateQuery = {
      text: "UPDATE category set name = $1, updated_date = CURRENT_TIMESTAMP where id = $2 returning *",
      values: [name, id],
    };
    const updateRes = await pool.query(updateQuery);

    if (updateRes.rowCount === 0) {
      throw new ERROR("DOES_NOT_EXIST");
    }

    res.status(200).send(updateRes.rows[0]);
  } catch (error) {
    console.error(error);
    let statusCode, errorMessage;
    switch (error.message) {
      case "NO_CATEGORY":
        statusCode = 422;
        errorMessage = "category: name is a mandatory field";
        break;
      case "DOES_NOT_EXIST":
        statusCode = 422;
        errorMessage = "No such category found";
        break;
      default:
        statusCode = 500;
        errorMessage = "Sorry, We encountered an error! Please try again.";
        break;
    }
    res.status(statusCode).send(errorMessage);
  }
};

exports.deleteCategory = async function (req, res) {
  try {
    const id = req.params.id;

    const deleteQuery = {
      text: "DELETE from category where id = $1 returning *",
      values: [id],
    };
    const deleteRes = await pool.query(deleteQuery);
    if (deleteRes.rowCount === 0) {
      throw new Error("DOES_NOT_EXIST");
    }

    res.status(200).send(deleteRes.rows[0]);
  } catch (error) {
    console.error(error);
    let statusCode, errorMessage;
    switch (error.message) {
      case "DOES_NOT_EXIST":
        statusCode = 422;
        errorMessage = "No such category found";
        break;
      default:
        statusCode = 500;
        errorMessage = "Sorry, We encountered an error! Please try again.";
        break;
    }
    res.status(statusCode).send(errorMessage);
  }
};
