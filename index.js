const http = require('http');
require('dotenv').config();

const routeCollection = require('./realization/routes/routes-collection');

const server = http.createServer(async (req, res) => {
    await routeCollection(req,res);
});

server.listen(8080, () => {
    console.log('Server has running on port 8080');
})




















const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { pool } =require('./realization/db_credentions')

// test().then()
// async function test() {
//     const createTableQuery = `
//     CREATE TABLE posts (
//       id SERIAL PRIMARY KEY,
//       image bytea NOT NUll,
//       title VARCHAR NOT NUll,
//       description VARCHAR NOT NUll,
//       price VARCHAR(255) NOT NUll,
//       user_id INTEGER,
//       FOREIGN KEY (user_id) REFERENCES users(id)
//     );
//   `;
//     try {
//         await pool.query(createTableQuery).then();
//         console.log('Table created successfully');
//     } catch (err) {
//         console.error('Error creating table', err);
//     }
// }