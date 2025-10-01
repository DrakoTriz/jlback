const express=require('express');
const {PrismaClient}=require('@prisma/client');

const prisma=new PrismaClient();
const router=express.Router();

//CREAR USUARIO
router.post('/', async(req , res)=>{
    try{
        const {nombre,apellidos,direccion, email, telefono}=req.body;

        const nuevoUsuario= await prisma.usuario.create({
            data: {nombre,apellidos,direccion,email,telefono}
        });

        res.json(nuevoUsuario);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Error creando usuario"});
    }
});

//LISTAR USUARIOS
router.get('/', async(req, res)=>{
    try{
        const usuarios= await prisma.usuario.findMany();
        res.json(usuarios);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error al obtener ususarios"})
    }
});

module.exports=router;