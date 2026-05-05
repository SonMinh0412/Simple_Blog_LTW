function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  next();
}
module.exports = requireAuth;
