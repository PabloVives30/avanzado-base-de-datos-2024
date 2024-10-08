import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar si hay un token en los headers de autorización
            2. Verificar que el token esté en el formato correcto (Bearer <token>)
            3. Verificar que el token sea válido (utilizando la librería jsonwebtoken)
            4. Verificar que tenga un id de usuario al decodificarlo
    
        Recordar también que si sucede cualquier error en este proceso, deben devolver un error 401 (Unauthorized)
    */
   console.log("ver1");
    const step1 = req.headers['authorization'];
    if(!step1){
        return res.status(401).json({ error: 'No hay token'})
    }

    const step2 = step1.split(' ')[1];
    if (!step2 || step1.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token inválido1' });
    }

    try {
        const verifiedToken = jwt.verify(step2, "tu_secreto"/*process.env.SECRET_KEY*/);
        req.userId = verifiedToken.id;
    } catch (error) {
        return res.status(401).json({ error11: 'Token inválido2', error });
    }

    if (!req.userId) {
        return res.status(401).json({ error: 'Token inválido3' });
    }

    next();

};

export const verifyAdmin = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el id de usuario en la request es un administrador (utilizando el servicio de usuarios)
            2. Si no lo es, devolver un error 403 (Forbidden)
    
    */

    try{
        const usuario = await UsuariosService.getUsuarioById(req.userId);
        if (!usuario || usuario.admin === false){
            return res.status(403).json({ error: 'No tiene permisos para realizar esta acción'});
        }
    } catch (error){
        return res.status(403).json({error: 'No sos administrador para realizar esta acción'})
    }

    next();
};
