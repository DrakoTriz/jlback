const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();


//  CREAR NUEVA CITA
router.post('/', async (req, res) => {
  try {
    const { usuarioId, ciudadId, fecha, hora_inicio, servicios } = req.body;

    // obtener servicios
    const serviciosDb = await prisma.servicio.findMany({
      where: { id: { in: servicios } }
    });

    if (serviciosDb.length === 0) {
      return res.status(400).json({ error: "No se encontraron los servicios seleccionados" });
    }

    // calcular duración total y precio
    const duracionTotal = serviciosDb.reduce((acc, s) => acc + s.duracion_minutos, 0);
    const precioServicios = serviciosDb.reduce((acc, s) => acc + s.precio, 0);

    // obtener ciudad
    const ciudad = await prisma.ciudad.findUnique({ where: { id: ciudadId } });
    if (!ciudad) return res.status(400).json({ error: "Ciudad no encontrada" });

    const precioTotal = precioServicios + ciudad.precio_desplazamiento;

    // calcular hora fin
    const horaInicioDate = new Date(`${fecha}T${hora_inicio}`);
    const horaFinDate = new Date(horaInicioDate.getTime() + duracionTotal * 60000);

    // comprobar solapamientos
    const solapada = await prisma.cita.findFirst({
      where: {
        fecha: new Date(fecha),
        OR: [
          {
            hora_inicio: { lte: horaFinDate },
            hora_fin: { gte: horaInicioDate }
          }
        ]
      }
    });

    if (solapada) {
      return res.status(400).json({ error: "El rango horario ya está ocupado" });
    }

    // crear la cita
    const nuevaCita = await prisma.cita.create({
      data: {
        usuarioId,
        ciudadId,
        fecha: new Date(fecha),
        hora_inicio: horaInicioDate,
        hora_fin: horaFinDate,
        total: precioTotal,
        servicios: {
          create: serviciosDb.map(s => ({
            servicioId: s.id,
            precio: s.precio,
            duracion_minutos: s.duracion_minutos
          }))
        }
      },
      include: {
        usuario: true,
        ciudad: true,
        servicios: { include: { servicio: true } }
      }
    });

    res.json(nuevaCita);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando cita" });
  }
});


//  LISTAR TODAS LAS CITAS
router.get('/', async (req, res) => {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        usuario: true,
        ciudad: true,
        servicios: { include: { servicio: true } }
      },
      orderBy: { fecha: 'asc' }
    });
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo citas" });
  }
});


//  DISPONIBILIDAD DE UN DÍA
router.get('/disponibilidad', async (req, res) => {
  try {
    const { fecha } = req.query; //  AHORA CON req.query

    if (!fecha) {
      return res.status(400).json({ error: "Debe proporcionar una fecha en formato YYYY-MM-DD" });
    }

    const fechaDate = new Date(fecha);

    // obtener citas de ese día
    const citas = await prisma.cita.findMany({
      where: { fecha: fechaDate },
      orderBy: { hora_inicio: 'asc' }
    });

    // transformar a rangos ocupados
    const ocupadas = citas.map(c => ({
      hora_inicio: c.hora_inicio.toISOString().substring(11, 16),
      hora_fin: c.hora_fin.toISOString().substring(11, 16)
    }));

    res.json({ fecha, ocupadas });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo disponibilidad" });
  }
});


module.exports = router;
