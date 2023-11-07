import {promises as fs} from 'fs'
import { nanoid } from 'nanoid';

class ProductManager{
    constructor(){
        this.path="./src/models/products.json";
    }

    async saveImages(thumbnails, productId) {
        // Crea la carpeta 'public' si no existe
        await fs.mkdir('public', { recursive: true });
    
        // Guarda cada imagen en la carpeta 'public' con un nombre generado por 'nanoid()'
        const savedImages = await Promise.all(thumbnails.map(async (thumbnail) => {
          const data = thumbnail.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(data, 'base64');
          const imageName = `${nanoid()}.jpg`;
          const imagePath = `public/${productId}/${imageName}`;
          await fs.mkdir(`public/${productId}`, { recursive: true });
          await fs.writeFile(imagePath, buffer);
          return `/${imagePath}`;
        }));
    
        return savedImages;
      }
    

    //metodo para leer todos los productos ya paseados
    readProducts=async()=>{
        let products= await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }

    //metodo para escribir los productos en json
    writeProducts= async(product)=>{
        await fs.writeFile(this.path,JSON.stringify(product))
    }

    exist= async(id)=>{
        let products= await this.readProducts()
       return products.find(prod=> prod.id === id)
    }

 

    //lectura del array y agregado de productos
    addProducts=async(product)=>{

         //Validación
         if (!ProductManager.isValidProduct(product)) {
            return 'Producto inválido. Faltan campos obligatorios.';
          }

        // Crea un nuevo objeto producto con el id generado por 'nanoid()'
            const newProduct = {
            ...product,
            id: nanoid(),
            status: true,
           thumbnails: [],
            };

            // Guarda las imágenes en la carpeta 'public'
            const thumbnails = await this.saveImages(product.thumbnails, newProduct.id);

            // Agrega las rutas de las imágenes al objeto producto
            newProduct.thumbnails = thumbnails;

            // Lee los productos existentes y agrega el nuevo producto
            const products = await this.readProducts();
            const productAll = [...products, newProduct];

            // Guarda el array de productos en el archivo JSON
            await this.writeProducts(productAll);
            return 'Producto Agregado';

    }

    //Validación
    static isValidProduct = (product) => {
        const requiredFields = ['title', 'description', 'category','price','code', 'stock'];
        const missingFields = requiredFields.filter(field => !product.hasOwnProperty(field));
        if (missingFields.length > 0) return false;
        // Validar que 'thumbnails' sea un array de strings
        if (product.thumbnails && !Array.isArray(product.thumbnails)) return false;
        if (product.thumbnails && product.thumbnails.some(thumbnail => typeof thumbnail !== 'string')) return false;
        return true;
      }

    //creo el getproducts que llamo desde index.js
    getProducts=async()=>{
        return await this.readProducts()
    }

    //Busca por id y devuelve  el producto por su ID
    getProductsById=async(id)=>{
        let productById= await this.exist(id)
        if(!productById) return "Producto No encontrado"
        return productById
    }

    //actualizar producto
    updateProducts= async(id, updateProduct)=>{
        let productById= await this.exist(id)
        if(!productById) return "Producto No encontrado"

        //Validación
        if (!ProductManager.isValidProduct(updateProduct)) {
            return 'Producto inválido. Faltan campos obligatorios.';
          }

        await this.deleteProducts(id)
        let productOld= await this.readProducts()
        let products = [{...updateProduct, id : id}, ...productOld]
        await this.writeProducts(products)
        return "Producto actualizado"
    }

    deleteProducts= async(id)=>{
        let products= await this.readProducts()
        let existeProducts=products.some(prod=> prod.id === id)
        if(existeProducts){
            //filtro todos los id que sean DISTINTOS AL ID QUE RECIBO
            let filterProducts= products.filter(prod=> prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto Eliminado"
        }
       return "Producto a eliminar inexistente"

    }
}

export default ProductManager

