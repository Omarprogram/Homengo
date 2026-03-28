
// middlewares/roleMiddleware.js
// ✅ Single source of truth — DELETE permit.js, only keep this file
export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient rights" });
    }
    next();
  };
};