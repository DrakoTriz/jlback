//services/emailService.js
const nodemailer=require('nodemailer');

//funcion principal: envia confirmacion de cita al cliente y al administrador
async function enviarConfirmacionCita(cita,usuario) {
    try{
        //confirmacion del transporte SMTP
        const trasporter= nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS //contraseña de aplicacion
            }
        });

        //verificacion rapida de conexion SMTP
        await trasporter.verify();
        console.log('Conexion SMPT verificada correctamente');

        //plantilla HTML del correo
        const html=`
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Confirmación de cita</h2>
        <p>Hola <strong>${usuario.nombre} ${usuario.apellidos}</strong>,</p>
        <p>Tu cita ha sido confirmada correctamente con los siguientes detalles:</p>

        <ul>
          <li><strong>Fecha:</strong> ${new Date(cita.fecha).toLocaleDateString()}</li>
          <li><strong>Hora:</strong> ${new Date(cita.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
          <li><strong>Ciudad:</strong> ${cita.ciudad?.nombre || 'N/A'}</li>
          <li><strong>Total:</strong> ${cita.total ? cita.total.toFixed(2) + ' €' : 'Pendiente'}</li>
        </ul>

        <p>Gracias por confiar en nosotros. Si necesitas modificar tu cita, contáctanos respondiendo a este correo.</p>

        <p style="margin-top:20px;">Un saludo,<br>
        <strong>Equipo de Tu Negocio</strong></p>
      </div>
    `;

    //Envio de correo
    const info= await trasporter.sendMail({
        from: `"JLproClean" <${process.env.EMAIL_USER}>`,
        to: [usuario.email, process.env.EMAIL_ADMIN],//CLIENTE mas ADMINISTRADOR
        subject: ' Confirmacion de su cita ✔',
        html
    });
    console.log('Correo enviado correctamente', info.messageId);

    }catch(error){
        console.error('Error enviando correo: ', error.mesdage);
    }
}
module.exports = { enviarConfirmacionCita };