import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js"

const ProductRouter=Router()
const product=new ProductManager();



//listar todos los productos que estan en el json
ProductRouter.get("/", async (req, res)=>{
    res.send(await product.getProducts()) 
})

//consulta por id
ProductRouter.get("/:id", async (req, res)=>{
    let id =req.params.id
    res.send(await product.getProductsById(id))

})


//envio de productos al JSON
ProductRouter.post("/", async (req, res)=>{
    let newProduct= req.body
    res.send(await product.addProducts(newProduct))

})

//actualizar productos
ProductRouter.put("/:id", async (req, res)=>{
    let id =req.params.id 
    let updateProduct= req.body
    res.send(await product.updateProducts(id, updateProduct))
})


//elimina producto por id
ProductRouter.delete("/:id", async (req, res)=>{
    let id =req.params.id
    res.send(await product.deleteProducts(id))
})

export default ProductRouter