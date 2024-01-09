const Menu = require('../models/menu');

async function createMenu(req, res) {
    const menu = new Menu(req.body);

    menu.save((error, menuStored) => {
        if(error){
            res.status(500).send({message: `Error al crear el menu: ${error}`});
        }else{
            res.status(201).send({menuStored});
        }
    });
}

//OBTENER TODOS LOS MENUS
async function getMenus(req, res){
    const {active} = req.query;

    let response = null;

    if(active == undefined){
        response = await Menu.find().sort({order: "asc"});
    }else{
        response = await Menu.find({active});
    }
    if(!response){
        res.status(404).send({message: "No hay menus"});
    }else{
        res.status(200).send(response);
    }
}

//ACTUALIZAR MENU

async function updateMenu(req, res){
    const {id} = req.params;
    const menuData = req.body;


    Menu.findByIdAndUpdate(id, menuData, (error, menuUpdate) => {
        if(error){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!menuUpdate){
                res.status(404).send({message: "No se ha encontrado ningun menu"});
            }else{
                res.status(200).send({message: "Menu actualizado correctamente"});
            }
        }
    });
}

//ELIMINAR MENU

async function deleteMenu(req, res){
    const {id} = req.params;

    Menu.findByIdAndRemove(id, (error, menuDeleted) => {
        if(error){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!menuDeleted){
                res.status(404).send({message: "Menu no encontrado"});
            }else{
                res.status(200).send({message: "El menu ha sido eliminado correctamente"});
            }
        }
    });
}


module.exports = {
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu
}