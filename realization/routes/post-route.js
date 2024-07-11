const postController = require('../controllers/post-controller');

async function postsRoute(req, res, id, parsedURL) {
    if (req.method === 'GET' && parsedURL.pathname === '/posts') {
        await postController.getPosts(req,res,id);
    } else if(req.method === 'POST' && parsedURL.pathname === '/create-post') {
        await postController.createPost(req,res);
    } else if(req.method === 'DELETE' && parsedURL.pathname === '/posts') {
        await postController.deletePost(req,res,id);
    }
}

module.exports = { postsRoute }