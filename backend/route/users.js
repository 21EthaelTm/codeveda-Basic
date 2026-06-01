import express from "express";
import { db } from "../config/db.js"
const route = express.Router();
import path from "path";

route.get('/', async (req, res) => {

    try {
        const queryString = "SELECT * FROM users"
        const { rows } = await db.query(queryString);
        if (rows.length === 0) return res.send("no user available");
        res.json(rows)
    } catch (error) {
        res.send(error)
    }
});



route.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryString = "SELECT * FROM users WHERE id = $1";
        const { rows } = await db.query(queryString, [id]);
        if (rows.length === 0) return res.send("no user found")
        res.json(rows[0])
    } catch (error) {
        res.send(error)
    }
});

route.post("/", async (req, res) => {
    let client;
    try {

        client = await db.connect()
        await client.query("BEGIN")
        const { name, email } = req.body

        const queryString = "INSERT INTO users (name,email) VALUES($1,$2) RETURNING *"
        await client.query(queryString, [name, email])
        await client.query('COMMIT');
        res.status(201).send({ message: "user created successfully" })
    } catch (error) {
        res.status(500).send(`error`)
        await client.query('ROLLBACK');
    } finally {
        if (client) {
            client.release();
        }

    }

});

route.patch("/:id", async (req, res) => {
    let client;
    try {
        let queryString;
        let queryArg
        const { id } = req.params;
        const { email, name } = req.body;
        client = await db.connect();

        await client.query("BEGIN");
        if (email && name) {
            queryString = `UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *`;
            queryArg = [email, name, id];
        }
        else if (email) {
            queryString = `UPDATE users SET email = $1 WHERE id = $2`;
            queryArg = [email, id];
        }
        else if (name) {
            queryString = `UPDATE users SET name = $1  WHERE id = $2`;
            queryArg = [name, id];
        } else {
            await client.query("ROLLBACK");
            res.status(404).send({ message: "no value provided" });
        }
        await client.query(queryString, queryArg)
        await client.query("COMMIT")
        res.status(202).send({ message: "user updated" })

    } catch (error) {
        if (client) { await client.query("ROLLBACK") }
        return res.status(500).send({ message: `${error}` })
    } finally {
        if (client) {
            client.release()
        }
    }
});

route.delete('/:id', async (req, res) => {
    let client;
    try {
        const { id } = req.params;
        const queryString = `DELETE FROM users WHERE id = $1 RETURNING *`;
        client = await db.connect();

        await client.query("BEGIN");
        const deleteduser = await client.query(queryString, [id]);
        if (deleteduser.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).send("user not found");
        }
        await client.query("COMMIT")
        res.status(201).send({ message: "user removed!" })
    } catch (error) {
        if (client) {
            await client.query("ROLLBACK");
            res.status(500).send({ message: "delete failed,Rollback done" })
        }
    } finally {
        if (client) {
            client.release()
        }
    }
});

export default route



