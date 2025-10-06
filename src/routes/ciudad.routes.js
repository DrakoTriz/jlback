const express=require('express');
const {PrismaClient}=require('@prisma/client');
const { parse } = require('dotenv');

const prisma= new PrismaClient();
const router=express.Router();

//CREAR CIUDAD
router.post('/', async(req , res)=>{
    try{
        const{nombre, precio_desplazamiento}=req.body;
        
        const nuevaCiudad= await prisma.ciudad.create({
            data: {nombre, precio_desplazamiento: parseFloat(precio_desplazamiento)}
        });
        res.json(nuevaCiudad);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando ciudad" });
  }
});

//OBTENER CIUDADES
router.get('/',async(req,res)=>{
    try{
        const ciudades=await prisma.ciudad.findMany();
        res.json(ciudades);
    }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo ciudades" });
  }
});

module.exports = router;