const express = require('express')
const dotenv = require('dotenv')
const coockieParser = require('cookie-parser')

const app = express()

// setteamos el motor de plantillas 

app.set('view engine', 'ejs')

// setteamos la carpeta public para archivos staticos

app.use(express.static('public'))

 
// para procesar datos enviados desde el frond end 

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// setteamos las variables de entorno

dotenv.config({path: './env/.env'})

// setteamos las coockies

app.use(coockieParser())

app.use(function(req,res,next){

if(!req.user)

    res.header('Cache-Control', 'private, no-store, must-revalidate')
    next();

})


// llamar al router

app.use('/', require('./router/router.js'))


app.listen(3000, (req, res) => {
console.log("El server esta en el puerto 3000");
});