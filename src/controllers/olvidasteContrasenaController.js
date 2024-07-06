import { pool } from '../databases/conexion.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt'


export const solicitarCambioContrasena = async (req, res) => {
  const { email_user } = req.body;

  try {
    const query = 'SELECT pk_cedula_user FROM usuarios WHERE email_user = ?';
    const [rows] = await pool.query(query, [email_user]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const codigo = crypto.randomBytes(3).toString('hex'); 
    const expireDate = new Date(Date.now() + 3600000);

    const updateQuery = 'UPDATE usuarios SET reset_code = ?, reset_code_expires = ? WHERE email_user = ?';
    await pool.query(updateQuery, [codigo, expireDate, email_user]);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
    //   service: 'gmail',
      auth: {
        user: 'subcoffeerecuperacion@gmail.com',
        pass: 'ibuv oltd mfad vqzz'
      }
    });
    transporter.verify().then(() => {
        console.log("esta funcionando");
    })

    const mailOptions = {
      from: 'subcoffeerecuperacion@gmail.com',
      to: email_user,
      subject: 'Código de cambio de contraseña',
      text: `Estimado/a usuario/a,
    
    Hemos recibido una solicitud para restablecer la contraseña de su cuenta asociada con este correo electrónico. Para completar el proceso de cambio de contraseña, por favor utilice el siguiente código de verificación:
    
    Código de verificación: ${codigo}
    
    Este código es válido por 1 hora. Si no solicitó un cambio de contraseña, por favor ignore este mensaje.
    
    Para cambiar su contraseña, siga estos pasos:
    1. Ingrese a nuestro sitio web y navegue a la página de cambio de contraseña.
    2. Introduzca su correo electrónico y el código de verificación proporcionado.
    3. Siga las instrucciones para crear una nueva contraseña segura.
    
    Si necesita asistencia adicional, no dude en ponerse en contacto con nuestro equipo de soporte.
    
    Gracias por confiar en nosotros.
    
    Atentamente,
    El equipo de Soporte de SubCoffee
    subcoffeerecuperacioncontrasena@gmail.com
    `
    };
   

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error al enviar el correo' , error});
      } else {
        return res.status(200).json({ mensaje: 'Código enviado correctamente' });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


export const verificarCodigo = async (req, res) => {
  const { codigo } = req.body;

  try {
    // Verificar si el código es correcto y no ha expirado
    const query = 'SELECT pk_cedula_user FROM usuarios WHERE reset_code = ? AND reset_code_expires > NOW()';
    const [rows] = await pool.query(query, [codigo]);

    if (rows.length === 0) {
      return res.status(400).json({ mensaje: 'Código incorrecto o expirado' });
    }

    return res.status(200).json({ mensaje: 'Código verificado correctamente' });
  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


  export const cambiarContrasenaConCodigo = async (req, res) => {
    const { nuevaContrasena } = req.body;
    const email_user = req.session.email_user;  // Recuperar el email de la sesión
  
    if (!email_user) {
      return res.status(400).json({ mensaje: 'Correo electrónico no encontrado en la sesión' });
    }
  
    try {
      const query = 'SELECT pk_cedula_user, reset_code, reset_code_expires FROM usuarios WHERE email_user = ?';
      const [rows] = await pool.query(query, [email_user]);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      const usuario = rows[0];
  
      if (new Date(usuario.reset_code_expires) < new Date()) {
        return res.status(400).json({ mensaje: 'Código inválido o expirado' });
      }
  
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
  
      const updateQuery = 'UPDATE usuarios SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email_user = ?';
      await pool.query(updateQuery, [hashedPassword, email_user]);
  
      return res.status(200).json({ mensaje: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }
  };
  