const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../db_credentions')

class SigninContoller {
    async signIn(req, res) {
        const jwtSecret = process.env.JWT_SECRET;
        let authData = '';
        req.on('data', (chunk) => authData = JSON.parse(chunk.toString()));
        req.on('end', async () => {
            const jwtToken = jwt.sign({data: authData }, jwtSecret, { expiresIn: '1h' });
            try {
                const {email, password} = authData;
                const dbUser = await pool.query('SELECT * FROM users where email = $1', [email]);
                const isPasswordCorrect = await bcrypt.compare(password, dbUser.rows[0].password);
                if (!isPasswordCorrect) {
                    res.writeHead(403, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({message: 'Wrong email or password'}));
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                const response = {
                    id: dbUser.rows[0].id,
                    firstName: dbUser.rows[0].firstname,
                    lastName: dbUser.rows[0].lastname,
                    email: dbUser.rows[0].email,
                }
                return res.end(JSON.stringify({ token: jwtToken , user: response}));
            } catch (e) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify({message: e.message}));
            }
        })
    }
}

module.exports = new SigninContoller();