function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        error: 'Brak informacji o roli użytkownika',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Brak uprawnień do wykonania tej operacji',
      });
    }

    next();
  };
}

module.exports = roleMiddleware;