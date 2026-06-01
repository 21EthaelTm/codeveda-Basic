import express from "express";
import { db } from "../config/db.js"
const route = express.Router();


route.get("/", async (req, res) => {
    try {
        const queryString = "SELECT * FROM products";
        const { rows } = await db.query(queryString);
        if (rows.length === 0) {
            return res.status(404).send({ message: "no user found" });
        }
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).send({ message: `${error}` })
    }
});
route.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const queryString = "SELECT * FROM products WHERE id = $1";
        const { rows } = await db.query(queryString, [id]);
        if (rows.length === 0) {
            return res.status(404).send({ message: "no user found" });
        }
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).send({ message: `${error}` })
    }

});
route.post("/", async (req, res) => {
    let client;
    try {
        // const { product_name, product_type, product_description, product_exp_date, product_manu_date, prod_price } = req.body;
        const fieldskeys = Object.keys(req.body);
        const fieldarg = fieldskeys.map((key, index) => `$${index + 1}`);
        const fieldarray = Object.values(req.body);
        client = await db.connect();
        await client.query("BEGIN");
        const queryString = `INSERT INTO products (${fieldskeys.join(',')}) VALUES (${fieldarg.join(',')}) RETURNING *`;
        const { rows } = await client.query(queryString, fieldarray);
        if (rows.length === 0) {
            await client.query("Rollback");
            return res.status(401).send({ message: "product not created!" })
        }

        await client.query("COMMIT");
        res.status(201).json(rows);


    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
            res.status(404).send({ message: `${error}` });
        }
    } finally {
        if (client) {
            client.release()
        }
    }

});

route.patch("/:id", async (req, res) => {
    let client;
    const { id } = req.params;
    const fieldKey = Object.keys(req.body);
    if (fieldKey.length === 0) return res.status(404).send({ message: "product not found" })
    try {

        const fieldarray = Object.values(req.body);
        const setvalue = fieldKey.map((key, index) => `${key} = $${index + 1}`).join(',');
        fieldarray.push(id);
        const idindex = fieldarray.length;
        const queryString = `UPDATE products SET ${setvalue} WHERE id = $${idindex} RETURNING * `;

        client = await db.connect();
        await client.query("BEGIN");

        const { rows } = await client.query(queryString, fieldarray);

        if (rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).send({ message: "no product found with this id" });
        }

        await client.query("COMMIT");

        res.status(201).json(rows);

    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");

        }
        res.status(500).send({ message: "no product found" });
    } finally {
        if (client) {
            client.release();
        }
    }

});
route.delete("/:id", async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        const queryString = `DELETE FROM products WHERE id = $1 RETURNING *`
        client = await db.connect();
        await client.query("BEGIN")
        const { rows } = await client.query(queryString, [id]);

        if (rows.length === 0) {
            await client.query("ROLLBACK")
            return res.status(401).send({ message: "product not found" })
        }
        await client.query("COMMIT");
        res.status(200).json(rows[0])
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
        }
        res.status(404).send({ message: "cant be deleted" })
    } finally {
        if (client) {
            client.release()
        }
    }
});

export default route