import {promises as fs} from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productAll= new ProductManager

class CartManager{
    constructor(){
        this.path="./src/models/carts.json";
    }

    //metodo para leer todos los productos ya paseados
    readCarts=async()=>{
        let carts= await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    //metodo para escribir los productos en json
    writeCarts= async(carts)=>{
        await fs.writeFile(this.path,JSON.stringify(carts))
    }

    exist= async(id)=>{
        let carts= await this.readCarts()
       return carts.find(cart=> cart.id === id)
    }

    addCarts=async()=>{
        let cartsOld= await this.readCarts()
        let id= nanoid()
        let cartsConcat= [{id:id, products:[]}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "Carrito agregado"
    }

    //Busca por id y devuelve  el producto por su ID
    getCartsById=async(id)=>{
        let cartById= await this.exist(id)
        if(!cartById) return "Carrito No encontrado"
        return cartById
    }

    addProductInCart=async(cartId, productId)=>{
        let cartById= await this.exist(cartId)
        if(!cartById) return "Carrito No encontrado"
        let productById= await productAll.exist(productId)
        if(!cartById) return "Producto No encontrado"

        let cartsAll =  await this.readCarts()
        let cartFilter= cartsAll.filter((cart)=> cart.id != cartId)

        if(cartById.products.some((prod)=>prod.id===productId)){
            let moreproductInCart = cartById.products.find(
                (prod)=>prod.id===productId
                );
            moreproductInCart.cantidad ++;
            console.log(moreproductInCart.cantidad);
            let cartsConcat=[cartById, ...cartFilter];
            await this.writeCarts(cartsConcat)
            return "producto sumado al carrito"
        }

        cartById.products.push({ id : productById.id, cantidad:1 })
        let cartsConcat=[cartById, ...cartFilter];
        await this.writeCarts(cartsConcat)
        return "producto agregado al carrito"
    }

}

export default CartManager