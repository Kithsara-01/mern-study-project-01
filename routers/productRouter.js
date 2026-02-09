import express from "express" ;
import { createProduct, deleteProduct, getProduct, getProductInfo, updateProducts } from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post("/" , createProduct);

productRouter.get("/" , getProduct);
productRouter.get("/:productId" , getProductInfo);

productRouter.delete("/:productId" , deleteProduct);
productRouter.put("/:productId" , updateProducts);

export default productRouter;