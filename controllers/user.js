const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const image = require('../utils/image');
const { path } = require('../app');
const { mongo } = require('mongoose');

//OBTENER EL USUARIO LOGUEADO
async function getMe(req, res){
    const {user_id} = req.user;
    const response = await User.findById(user_id).populate(
        {
            path: "denuncias",
            populate: {
              path: "procesos",
              model: "procesos",
              populate: {
                path: "fechas",
                model: "fechas",
              },
            },
          }
    );

    if(!response){
        res.status(404).send({message: "Usuario no encontrado"});
    } else {
        res.status(200).send(response);
    }
}

//OBTENER EL USUARIO LOGUEADO
async function getUser(req, res){
    const { user_id } = req.params;

    try {
      const user = await User.findOne({ _id: user_id, active: true }).populate(
        {
          path: "denuncias",
          select: "_id",
          populate: {
            path: "procesos",
            select: "_id",
            populate: {
              path: "fechas",
                select: "_id",
            },
          },
        }
      );
  
      if (!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado', status: false });
      }
  
      res.status(200).json({ data: user, status: true });
    } catch (error) {
      res.status(500).json({ msg: `Error al obtener el usuario: ${error}`, status: false });
    }
  };

//OBTENER TODOS LOS USUARIOS
// async function getUsers(req, res){
//     const {active} = req.query;
//     let response = null;

//     response = await User.find({active});

//     if(active == undefined){
//         response = await User.find();
//     }else{
//         response = await User.find({active}).populate("denuncias");
//     }
//     res.status(200).send(response);
// }

const getUsers = async (req, res) => {
    const { user } = req;
  
    try {
      const users = await User.find({ active: true }).populate(
        {
            path: "denuncias",
            select: "_id",
            populate: {
              path: "procesos",
                select: "_id",
                populate: {
                    path: "fechas",
                    select: "_id",
                },
            },

        }
      );
      res.status(200).json({ data: users, status: true });
      console.log(users);
    } catch (error) {
      res.status(400).json({ msg: error.message, status: false });
    }
  };

//CREAR EL USUARIO Y GUARDARLO EN LA BASE DE DATOS
async function createUser(req, res){
    const {password} = req.body;
    const user = new User({...req.body, active: false});
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;


    if(req.files.avatar){
        //TO DO: Procesar avatar
        const imageName = image.getFilePath(req.files.avatar);
        user.avatar = imageName;
    }

    // GUARDAR USUARIO
    user.save((error, userStored) => {
        if(error){
            res.status(500).send({message: `Error al crear el usuario`});
        }else{
            res.status(201).send(userStored);
        }
    });
}

//ACTUALIZAR USUARIO
async function updateUser(req, res){
     const {id} = req.params;
     const userData = req.body;

     //Password
     if(userData.password){
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password, salt);
        userData.password = hashPassword;
     }else{
        delete userData.password;
     }
     //Avatar
        if(req.files.avatar){
            const imageName = image.getFilePath(req.files.avatar);
            userData.avatar = imageName;
        }

     User.findByIdAndUpdate({_id: id}, userData, (error) => {
        if(error){
            res.status(400).send({message: `Error al actualizar el usuario: ${error}`});
        }else{
            res.status(200).send({message: "Actualización exitosa"});
        }	
     });
}

//ELIMINAR USUARIO
async function deleteUser(req, res){
    const {id} = req.params;
    User.findByIdAndDelete({_id: id}, (error) => {
        if(error){
            res.status(400).send({message: `Error al eliminar el usuario: ${error}`});
        }else{
            res.status(200).send({message: "Eliminación exitosa"});
        }	
     });
}

//EXPORTAR LOS MÉTODOS
module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
}