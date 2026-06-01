import usersModel from "../model/usersmodel.js"
export default class UserControllers {

    static async fetchUsers(req, res) {

        try {

            const users = await usersModel.getUsers();
            if (users.success === false) {
                return res.json({ success: false, message: "no users available" });
            }
            res.json(users)
        } catch (error) {
            res.json({ success: false, message: `${error}` })
        }


    }
    static async createUser(req, res) {
        try {
            const data = req.body;

            const users = await usersModel.createUser(data);
            if (users.success === false) {
                return res.json({ success: false, message: "user creation failed" });
            }
            res.json(users)


        } catch (error) {
            res.json({ success: false, message: `${error}` })
        }

    }

   
    static async deleteUser(req,res){
        try {
            const {id} = req.params;
            const user = await usersModel.deleteUser(id)
            if (user.success === false) {
                return res.status(400).json({ success: false, message: "user deletion failed" });
            }
            res.json(user)
        } catch (error) {
            res.status(201).json({ success: false, message: `${error}` })
        }
        }

        static async updateUser(req,res){
            try {
                
                const data = req.body
                console.log('body',data);
                const {id} = req.params;
                console.log('id',id);
                
                const user = await usersModel.updateUser(id,data);
                console.log(user)
                if (user.success === false) {
                return res.status(400).json({ success: false, message: "user update failed" });
            }
            res.json(user)
            } catch (error) {
                res.status(201).json({ success: false, message: `${error}` })
            }
        }
    
}