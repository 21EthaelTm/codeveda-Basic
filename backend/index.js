import express from 'express';
import {fileURLToPath} from "url";
import path from "path";
import UserControllers from './controller/userController.js';
import productController from "./controller/productcontroller.js"
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")));
app.get("/",(req,res)=>{
    const filePath = path.join(__dirname,"public","home","index.html")
    res.sendFile(filePath);
})
app.get("/products",(req,res)=>{
    const filePath = path.join(__dirname,"public","products","products.html")
    res.sendFile(filePath);
})
app.get("/users",(req,res)=>{
    const filePath = path.join(__dirname,"public","users","users.html")
    res.sendFile(filePath);
})


app.get('/api/products',productController.fetchProducts);
app.post('/api/createProduct',productController.createProduct);
app.delete('/api/deleteProduct/:id',productController.deleteProduct);
app.patch('/api/editProduct/:id',productController.updateProduct);


app.get('/api/users',UserControllers.fetchUsers);
app.post('/api/createUser',UserControllers.createUser)
app.delete('/api/deleteUser/:id',UserControllers.deleteUser)
app.patch('/api/updateUser/:id',UserControllers.updateUser)

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})



