async function handleSession(req, res, next) {
  if (req.session.user) {
    await res.redirect('profile');
    return;
  }

  next();
}