const express= require('express');
const cors=require('cors');
require('dotenv').config();

const app=express();

//middlewares 
app.use(cors()); // permite solicitudes desde otros origenes, back y front en distintos servidores etc
app.use(express.json()); //permite que tu servidor interprete JSON en las peticiones req.body

//RUTAS

//Ruta de Usuario
const usuarioRoutes=require('./routes/usuraio.routes');
app.use('/usuarios',usuarioRoutes);

//Rute de Servicios
const servicioRoutes=require('./routes/servicio.routes');
app.use('/servicios',servicioRoutes);

//Ruta de Ciudades
const ciudadRoutes=require('./routes/ciudad.routes');
app.use('/ciudades',ciudadRoutes);

//Rute Citas
const citaRoutes = require('./routes/cita.routes');
app.use('/citas', citaRoutes);

//rutas de prueba simple 
app.get('/', (req,res)=>{
    res.send('Servidor JLproClean funcionando')
});

//puerto
const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});