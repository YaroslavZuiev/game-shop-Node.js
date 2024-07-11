const createUserController = require('../controllers/signup-controller');

async function singUpRoute(req, res, id, parsedURL) {
    if (req.method === 'POST' && parsedURL.pathname === '/sign-up') {
        await createUserController.crateUser(req, res);
    } else if (req.method === 'DELETE' && parsedURL.pathname === '/sign-up') {
        //TODO only for remove user purpose from db
        await createUserController.deleteUser(req, res, id);
    }
}

module.exports = {singUpRoute};
