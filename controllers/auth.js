const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../utils/jwt');


function register(req, res){
    const {firstname, lastname, email, password} = req.body;

    console.log(req.body);
    if(!email) res.status(400).send({message: "El email es obligatorio"});
    if(!password) res.status(400).send({message: "La contraseña es obligatoria"});

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false
    });
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt); 
    user.password = hashPassword;
    console.log(user);

    user.save((error, userStored) => {

    if(error){
        res.status(500).send({message: `Error al crear el usuario: ${error}`});
    }else{
        res.status(200).send({userStored});
    }

    });
}


    function login(req, res){
        const {email, password} = req.body;
        if(!email) res.status(400).send({message: "El email es obligatorio"});
        if(!password) res.status(400).send({message: "La contraseña es obligatoria"});
        
        const emailLowerCase = email.toLowerCase();

        User.findOne({email: emailLowerCase}, (error, userStored) => {
            if(error){
                res.status(500).send({message: `Error del servidor: ${error}`});
            }else{
                bcrypt.compare(password, userStored.password, (bcryptError, check) => {
                    if(bcryptError){
                        res.status(500).send({message: `Error del servidor`});
                    }else if(!check){
                        res.status(400).send({message: "La contraseña es incorrecta"});
                    }else if(!userStored.active){
                        res.status(401).send({message: "El usuario no se ha activado"});
                    }else{
                        res.status(200).send({
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: jwt.createRefreshToken(userStored)
                        });
                    }
                });

            }

        });
    }

    function refreshAccessToken(req, res){
        const {token} = req.body;
        if(!token) res.status(400).send({message: "El token es requerido"});
        const {user_id} = jwt.decodeToken(token);

        User.findOne({_id: user_id}, (error, userStorage) => {
            if(error){
                res.status(500).send({message: "Error del servidor"});
            }else{
                if(!userStorage){
                    res.status(404).send({message: "Usuario no encontrado"});
                }else{
                    if(!userStorage.active){
                        res.status(401).send({message: "El usuario no se ha activado"});
                    }else{
                        res.status(200).send({
                            accessToken: jwt.createAccessToken(userStorage)
                        });
                    }
                }
            }
        });
    }

module.exports = {  
    register,
    login,
    refreshAccessToken
};


