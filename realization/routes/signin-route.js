const authUserController = require("../controllers/signin-contoller");

async function singInRoute(req, res, parsedURL) {
    if(req.method === 'POST' && parsedURL.pathname === '/sign-in') {
        await authUserController.signIn(req,res);
    }
}
module.exports = { singInRoute };