const { pool } = require('../db_credentions')
const bcrypt = require('bcryptjs');

class SignupController {
    crateUser(req,res) {
        let userData = '';
        req.on('data', (chunk) => userData = JSON.parse(chunk.toString()));
        req.on('end', async () => {
            const {firstName, lastName, email, password} = userData;
            const user = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
            if(!user.rows[0]) {
                const cryptSalt = await bcrypt.genSalt(3);
                const hashedPassword = await bcrypt.hash(password, cryptSalt);
                const dbScript = 'INSERT INTO users(firstName, lastName, email, password) VALUES ($1,$2,$3,$4)';
                const dbData = [firstName, lastName, email, hashedPassword];
                try {
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    await pool.query(dbScript, dbData);
                    res.end(JSON.stringify({ message: 'User successfully created!' }));
                } catch (e) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(e.message)
                }
            } else {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Such user has been already registered.!' }));
            }

        });
    }

    //TODO only for remove user purpose from db
    async deleteUser(req, res, id) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('User successfully deleted!');
    }
}

module.exports = new SignupController();