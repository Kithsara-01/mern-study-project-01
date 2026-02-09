import Product from "../models/products.js";
import { isAdmin } from "./userController.js";


//create product
export async function createProduct(req,res){

    if(!isAdmin(req)){   // !isAdmin - admin newyi nam meka wenawa
        return res.status(403).json({
            message : "Access denied, This only for admins"
        })

    }

    const product = new Product(req.body)

    try{
        const response = await product.save()

        res.json({
            message : "Product creted successfully",
            product : response
        })

    }catch(error){
        console.error("Error creating product : " , error);
        return res.status(500).json({
            message : "Failed to create product"
        })
    }
}

// read product
export async function getProduct(req,res){
    try{
        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products);
        }else{
            const products = await Product.find({isAvailable : true});
            return res.json(products)
        }

    }catch(error){
        console.error("Error fetching products : " , error);
        return res.status(500).json({message : "Failed to fetch products"})
    }
    
}

// delete product
export async function deleteProduct(req, res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Access denide, Admin only!"
        })
    }

    try{
        const productId = req.params.productId;

        await Product.deleteOne({
            productId : productId 
        })

        res.json({
            message : "Product delete successfully !"
        })
    }catch(error){
        console.error("Error of deleting product" , error) ;
        res.satatus(500).json({
            message : "Failed to delete product !"
        })

    }
}

//update products
export async function updateProducts(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : " Access denide, only admin !"
        })
    }

    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;

    try{
        await Product.updateOne({
            productId : productId,
        },
        data // update kl yuthu data tika
    );
    res.json({
        message : "Products update successfuly ! "
    })

    }catch(error){
        console.error("Error upading products" , error);
        res.status(500).json({
            message : "Failed to product data update !"   
        })
        return;       

    }
}

// Extra feature - get/read product details by productId
export async function getProductInfo(req,res){
    try{
        const productId = req.params.productId;
        const product = await Product.findOne({productId : productId })

        if(product == null){
            res.status(404).json({
                message : "Product is not found !"
            })
            return;
        }

        if(isAdmin(req)){
            res.json(product);

        } else {
            if(product.isAvailable){
                res.json(product);
            }else{
                res.status(404).json({
                    message : "Product is not available !"
                })
            }
        }
    }catch(error){
        console.error("Error fetching information" , error)
        res.status(500).json({message : "Failed to fetching information"})
        return;

    }
    

}