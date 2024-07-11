const {pool} = require('../db_credentions')
const Busboy = require('busboy');

class PostController {
    async getPosts(req, res, id) {
        if (id) {
            await getPostsByUser(req, res, id);
        } else {
            await getAllPosts(req, res);
        }
    }

    async createPost(req, res) {
        const busboy = Busboy({headers: req.headers});
        let fileData = [];
        let data = {};

        busboy.on('file', (fieldname, file) => {
            file.on('data', (data) => {
                fileData.push(data);
            });
        });

        busboy.on('field', (fieldname, value) => {
            data = {
                ...data,
                [fieldname]: value
            }
        });

        busboy.on('finish', async () => {
            const fileBuffer = Buffer.concat(fileData);
            const dbScript = 'INSERT INTO posts (title, description, image, price, user_id) VALUES ($1, $2, $3, $4, $5)';
            const { title, description, price, userId } = data;

            await pool.query(dbScript, [title, description, fileBuffer, price, userId],
                (err) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        return res.end(JSON.stringify({error: err.message}));
                    }
                    res.writeHead(201, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({success: 'Post successfully created!'}));
                }
            );
        });
        req.pipe(busboy);
    }

    async deletePost(req, res, id) {
        try {
            await pool.query('DELETE FROM posts WHERE id = $1', [id]);
            return res.end('Post has been deleted')
        } catch (e) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({error: e.message}));
        }
    }
}

async function getAllPosts(req, res) {
    try {
        let posts = await pool.query('SELECT * FROM posts');
        posts = posts.rows.map((post) => {
            return {
                ...post,
                image: post.image.toString(),
            }
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(posts));
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({error: e.message}));
    }
}

async function getPostsByUser(req, res, id) {
    try {
        const postsByUser = await pool.query('SELECT * FROM posts WHERE user_id = $1', [id]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(postsByUser.rows));
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({error: e.message}));
    }
}

module.exports = new PostController();