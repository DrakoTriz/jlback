const express=require('express');
const {PrismaClient}=require('@prisma/client');

const prisma=new PrismaClient();
const router=express.Router();

//CREAR UN SERVICIO
router.post('/', async(req, res)=>{
    try{
        const{nombre,descripcion, precio, duracion_minutos}=req.body;

        const nuevoServicio=await prisma.servicio.create({
            data:{nombre,descripcion,precio:parseFloat(precio),duracion_minutos}
        });

        res.json(nuevoServicio);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error creando servicio"})
    }
});

//LISTAR SERVICIOS
router.get('/', async(req,res)=>{
    try{
        const servcios=await prisma.servcio.findMany();
        res.json(servcios);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error obteniendo servicios"});}
});

module.exports=router;