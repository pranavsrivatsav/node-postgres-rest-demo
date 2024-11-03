const express = require("express");
const env = require("./config");

const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");

const app = express();

app.use(express.json());
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter)

app.listen(env.PORT, () => {
  console.log(`listening at port ${env.PORT}`);
});
