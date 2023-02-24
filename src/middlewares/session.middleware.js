const sessionMiddleware = async (req, res, next) => {
  const user = await req.session.user;
  if (user) {
    res.redirect('/products');
  } else {
    next();
  }
};

module.exports = {
  sessionMiddleware
}