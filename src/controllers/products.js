const { pool } = require("../services/database");

exports.getProducts = async function(req, res) {
  try {
    const result =
      await pool.query(`SELECT p.name, p.description, p.price, p.currency, p.quantity, 
	p.active, p.category_id, p.created_date, p.updated_date,
	(SELECT ROW_TO_JSON(category_obj) from 
		(select id, name from category where id = p.category_id)
	category_obj) as category
from product p;	`);
    return res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send("Sorry, We encountered an error! Please try again.");
  }
}