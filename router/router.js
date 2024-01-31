const express = require('express')
const router = express.Router()
const conection = require('../database/db.js')
const authController = require('../controllers/authcontroller.js')


// rutas para las vistas

 router.get('/', authController.isAnthentication , (req, res) =>{
    res.render('index', {user:req.usuario})
});

router.get('/login', (req, res) =>{
    res.render('login', {alert:false})
});

router.get('/registrarusuario',authController.isAnthentication, (req, res) =>{
    res.render('register')
});

router.get('/logout', authController.logout)

// rutas para los controladores

router.post('/login', authController.login)
router.post('/registrarusuario', authController.registrarusuario)



module.exports = router