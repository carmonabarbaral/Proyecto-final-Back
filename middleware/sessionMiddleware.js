const sessionMiddleware = async (req, res, next) => {
  if (req.session.user) {
    // El usuario está conectado, permitir que la solicitud continúe
    await next();
  } else {
    // El usuario no está conectado, redireccionar a la página de inicio de sesión
    return res.redirect('/login');
  }
};