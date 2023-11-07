import express from "express"
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js"


const app= express()
const PORT=8080

app.use(express.json())
app.use (express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get( "/products", async(req,res)=>{
    //creo el limite que le paso a traves de query por navegador
    let limit=parseInt(req.query.limit);
    //si no se pasa un limite, entonces me devuelve todos los productos
    if(!limit)return res.send(await readProducts)
    //en caso de que si se pase un limit entonces me devuelve el producto indicado
    let allProduct=await readProducts
    let productLimit=allProduct.slice(0, limit)
    console.log(limit)
    res.send(productLimit)
});

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

app.get("*", (req, res) => {
    return res
      .status(404)
      .json({ status: "error", msg: "No se encuentra esa ruta", data: {} });
  });

app.listen(PORT,()=>{
    console.log(`Servidor express puerto ${PORT}`);
});