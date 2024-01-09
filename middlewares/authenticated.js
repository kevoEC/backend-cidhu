const jwt = require("../utils/jwt");

function asureAuth(req, res, next) {
    if (!req.headers.authorization) {
        res
        .status(403)
        .send({ message: "La peticion no tiene la cabecera de autenticacion" });
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    try{
        const payload = jwt.decodeToken(token);
        const { exp } = payload;
        const currentData = new Date().getTime();

        if (currentData >= exp) {
            return res.status(404).send({ message: "El token ha expirado" });
        }

        req.user = payload;
        next();
    }catch (error){
        return res.status(404).send({message: "Token invalido"});
    }
}

module.exports = {
    asureAuth,
};
