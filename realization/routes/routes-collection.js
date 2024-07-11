const signUp = require('./signup-route');
const signIn = require('./signin-route');
const posts = require('./post-route');
const {URL} = require("url");
const {validateJWTToken} = require("../controllers/jwt-token-controller");

async function routesCollection(req, res) {
    const parsedURL = new URL(req.url, `http://localhost`);
    const id = parsedURL.searchParams.get('id');
    setResponseHeaders(req,res);
    if(parsedURL.pathname !== '/sign-in' && parsedURL.pathname !== '/sign-up') {
        // validateJWTToken(req, res);
    }
    await signUp.singUpRoute(req, res, id, parsedURL);
    await signIn.singInRoute(req, res, parsedURL);
    await posts.postsRoute(req, res, id, parsedURL)
}

module.exports = routesCollection;

function setResponseHeaders(req, res) {
    const allowedOrigins = 'http://localhost:4200'
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
    if(req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
}