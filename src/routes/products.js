const { getProducts } = require("../controllers/products");

const router = require("express").Router();

router.get("/", getProducts);

module.exports = router;