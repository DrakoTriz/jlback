const nodemailer = require('nodemailer');

/**
 * Envía una confirmación de cita tanto al cliente como al administrador.
 * @param {Object} cita - Datos completos de la cita creada.
 * @param {Object} usuario - Datos del usuario (nombre, apellidos, email...).
 */
async function enviarConfirmacionCita(cita, usuario) {
  try {
    // 🔧 Configuración del transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // contraseña o token de aplicación
      },
    });

    // Verificación rápida de conexión SMTP
    await transporter.verify();
    console.log(' Conexión SMTP verificada correctamente');

    //  Plantilla HTML del correo
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; background:#f8f8f8; padding:20px; border-radius:10px;">
        <h2 style="color:#007BFF;">Confirmación de cita</h2>
        <p>Hola <strong>${usuario.nombre} ${usuario.apellidos}</strong>,</p>
        <p>Tu cita ha sido confirmada correctamente con los siguientes detalles:</p>

        <table style="margin-top:10px; border-collapse:collapse;">
          <tr><td style="padding:6px;"><strong>📅 Fecha:</strong></td><td>${new Date(cita.fecha).toLocaleDateString()}</td></tr>
          <tr><td style="padding:6px;"><strong>⏰ Hora:</strong></td><td>${new Date(cita.hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td></tr>
          <tr><td style="padding:6px;"><strong>🏙️ Ciudad:</strong></td><td>${cita.ciudad?.nombre || 'No especificada'}</td></tr>
          <tr><td style="padding:6px;"><strong>💰 Total:</strong></td><td>${cita.total ? cita.total.toFixed(2) + ' €' : 'Pendiente de calcular'}</td></tr>
        </table>

        <p style="margin-top:15px;">Gracias por confiar en nosotros. Si necesitas modificar tu cita, contáctanos respondiendo a este correo.</p>

        <hr style="margin:20px 0; border:none; border-top:1px solid #ccc;">
        <p style="font-size:13px; color:#555;">📞 Este es un correo automático de <strong>JLproClean</strong>. Por favor, no respondas directamente a este mensaje.</p>
      </div>
    `;

    //  Envío del correo (a cliente y administrador)
    const info = await transporter.sendMail({
      from: `"JLproClean" <${process.env.EMAIL_USER}>`,
      to: [usuario.email, process.env.EMAIL_ADMIN].filter(Boolean).join(','),
      subject: '✔ Confirmación de tu cita - JLproClean',
      html,
    });

    console.log(' Correo enviado correctamente:', info.messageId);
  } catch (error) {
    console.error(' Error enviando correo:', error.message);
  }
}

module.exports = { enviarConfirmacionCita };
