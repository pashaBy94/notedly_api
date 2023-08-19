const mongoose = require('mongoose');
module.exports = {
    connect: DB_HOST =>{
        mongoose.connect(DB_HOST,{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        mongoose.connection.on('error', err=>{
            console.error(err);
            console.log('MongoDB connection error.');
            process.exit();
        });
    },
    close: ()=>{
        mongoose.connection.close();
    }
};
























