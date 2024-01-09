const mongoose = require('mongoose');
const app = require('./app');
const {
    DB_USER, 
    DB_PASSWORD,
    DB_HOST,
    IP_SERVER,
    API_VERSION
} = require('./constants');

const PORT = process.env.PORT || 3977;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`,
    (error) => {
        if(error) throw error;

        app.listen(PORT, () => {
            console.log('######################');
            console.log('###### API REST ######');
            console.log('######################');
            console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        });
    });

    // const connectDB = async () => {
    //     try {
    //       await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`)
      
    //       app.listen(PORT, () => {
    //         console.log('######################');
    //         console.log('###### API REST ######');
    //         console.log('######################');
    //         console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    //     });

    //     } catch (err) {
    //       console.log('Error al conectar a la base de datos', err);
    //     }
    //   }
      
    //   connectDB()