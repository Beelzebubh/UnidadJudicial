const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const conection = require("../database/db")
const {promisify} = require('util')
const { error } = require("console")
const { nextTick } = require("process")

// metodo para loguearse


exports.login = async(req, res)=>{

    try {
        const usuario = req.body.usuario
        const password = req.body.password

        if(!usuario || !password){

            res.render('login', {
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingresar usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{

            conection.query('SELECT * FROM users WHERE user = ?', [usuario], async (error, results)=>{
                
                if( results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
                    res.render('login', {
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "Ingresar usuario y / o  contraseña",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
             
                 }else{
                    const id = results[0].id
                    const token = jwt.sign(
                        {
                            id:id
                            
                        }
                        
                        , process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA

                    })

                    console.log(process.env.JWT_SECRETO)

                    const cookiesOption = {
                        expires: new Date(Date.now()+ process.env.JWT_COOKI_EXPIRES * 24 * 60 * 1000),
                        httpOnly: true,
                        
                    }
                    res.cookie('jwt', token, cookiesOption)
                    res.render('login', {
                        alert:true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "Login Correcto",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: ''
                    })
                 }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.registrarusuario = async(req, res)=>{

    try {
        const usuario = req.body.usuario
        const password = req.body.password
        const nombre = req.body.nombre
        let passHash = await bcryptjs.hash(password, 8)
        conection.query('INSERT INTO users SET ?', {user: usuario, name: nombre, password: passHash}, (error, resultados )=>{
            if(error){console.log(error)}
            res.redirect('/')
        } )
        
    } catch (error) {
        console.log(error)
    }
}

exports.isAnthentication = async(req, res, next)=>{

if (req.cookies.jwt){
    try {
        const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
        conection.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, resultados)=>{
            if(!resultados){return next()}
            req.user = resultados[0]
            return next()
        })
    } catch (error) {
        console.log(error)
        
    }

}else{
    res.redirect('/login')

}   

}

exports.logout = (req, res)=>{
res.clearCookie('jwt')  
return res.redirect('/')  
}