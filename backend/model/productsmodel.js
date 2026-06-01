import { db } from '../config/db.js'
export default class ProductsModel {
    /*==============
       fetch single product from users table
   ================== */
    static async getproduct(id) {
        try {
            const queryString = `SELECT * FROM products WHERE id = $1`;
            const { rows } = await db.query(queryString, [id]);
            if (rows.length === 0) return { success: false, message: "no product found" };
            return { success: true, rows };
        } catch (error) {
            return { success: false, message: `${error}` }
        }


    }

    /*==============
      fetch all products from users table
  ================== */

    static async getProducts() {
        try {
            
            const queryString = `SELECT * FROM products`;
            const { rows } = await db.query(queryString);
            
            if (rows.length === 0) return { success: false, message: "no products found" };
            return { success: true, rows };
        } catch (error){
            return { success: false, message: `${error}` }
        }
    }

    /*==============
      used to create product
  ================== */

    static  async createProduct(users) {
        let client;
        try {
            client = await db.connect();
            const fieldKeys = Object.keys(users);
            const fieldarg = fieldKeys.map((keys, index) => `$${index + 1}`)
            const fieldvalues = Object.values(users);
            await client.query("BEGIN");
            const queryString = `INSERT INTO products (${fieldKeys.join(',')}) VALUES (${fieldarg.join(',')}) RETURNING *`;
            const { rows } = await client.query(queryString, fieldvalues);
            if (rows.length === 0) {
                await client.query("Rollback");
                return { success: false, message: "product Creation Faild" }
            }
            await client.query("COMMIT");
            return { success: true, rows };

        } catch (error) {
            if (client) {
                await client.query("ROLLBACK");
            }
            return { success: false, message: `${error}` }
        } finally {
            if (client) {
                client.release()
            }
        }
    }

    /*==============
        used to update product
    ================== */

    static async updateProduct(id, data) {
        let client;
        try {
            client = await db.connect()
            const fieldkey = Object.keys(data);
            const SETVALUES = fieldkey.map((key, index) => `${key}=$${index + 1}`);
            const idIndex = fieldkey.length + 1;
            const fieldarg = Object.values(data);
            fieldarg.push(id);
            const queryString = `UPDATE products SET ${SETVALUES.join(',')} WHERE id = $${idIndex} RETURNING *`;
            await client.query("BEGIN")
            const { rows } = await client.query(queryString, fieldarg);
            if (rows.length === 0) {
                await client.query("ROLLBACK");
                return { success: false, message: "products Creation Faild" }
            }
            await client.query("COMMIT");
            return { success: true, rows };
        } catch (error) {
            if (client) {
                await client.query("ROLLBACK");
            }
            return { success: false, message: `${error}` }
        } finally {
            if (client) {
                client.release()
            }
        }
    }

    /*==============
        used to Delete product
    ================== */
    static async deleteProduct(id) {
        let client;
        try {
            client = await db.connect();
            await client.query("BEGIN");
            const queryString = `DELETE FROM products WHERE id = $1 RETURNING *`;
            const { rows } = await client.query(queryString, [id]);
            if (rows.length === 0) {
                await client.query("Rollback");
                return { success: false, message: "product deletion Faild" }
            }
            await client.query("COMMIT");
            return { success: true, rows };

        } catch (error) {
            if (client) {
                await client.query("ROLLBACK");
            }
            return { success: false, message: `${error}` }
        } finally {
            if (client) {
                client.release()
            }
        }
    }
}