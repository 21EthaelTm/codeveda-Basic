import ProductsModel from "../model/productsmodel.js"
export default class productController {

    static async fetchProducts(req, res) {

        try {

            const products = await ProductsModel.getProducts();
            if (products.success === false) {
                return res.json({ success: false, message: "no users available" });
            }
            res.json(products)
        } catch (error) {
            res.json({ success: false, message: `${error}` })
        }


    }

    static async createProduct(req, res) {
        try {
            console.log("from create pro controller")
            const products = req.body;
            const result = await ProductsModel.createProduct(products);
            if (result.success === false) {
                return res.json({ success: false, message: "user creation failed" });
            }
            res.json(result);
        } catch (error) {

        }
    }

    static async deleteProduct(req,res){
        try {
            const {id} = req.params;
                    const product = await ProductsModel.deleteProduct(id)
                    if (product.success === false) {
                        return res.status(400).json({ success: false, message: "user deletion failed" });
                    }
                    res.json(product)
                } catch (error) {
                    res.status(201).json({ success: false, message: `${error}` })
                }
                }

                static async updateProduct(req,res){
                   
                    try {
                         const {id} = req.params;
                        const data = req.body;
                        
                        const product = await ProductsModel.updateProduct(id,data);
                        if (product.success === false) {
                        return res.status(400).json({ success: false, message: "product update  failed" });
                    }
                    res.json(product)
                    } catch (error) {
                        res.status(201).json({ success: false, message: `${error}` })
                    }
                    
                }
   

}