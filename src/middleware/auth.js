import passport from "passport";
import UsersController from "../controllers/users.controller.js";

const uControl = new UsersController();

const handleAuth = (policies) => {
  return async (req, res, next) => {
    try {
      passport.authenticate('jwt', { session: false }, async function (err, user, info) {
        if (err) return next(err);

        if (user) {
          req.user = await uControl.getDataUserById(user.id);
        }

        if (policies[0] === 'PUBLIC') return next();

        if (!user) {
          return res.redirect("/login");
        }

        if (user.role.toUpperCase() === 'ADMIN') return next();
        if (user.role.toUpperCase() === 'PREMIUM' && req.method === 'DELETE' && req.params.owner !== user.id) {
          throw new Error('Solo puedes eliminar tus productos.');
        }
        if (!policies.includes(user.role.toUpperCase())) return res.render('error', { title: 'Ha ocurrido un error', answer: 'Usuario no autorizado', ...req.user });
        
        next();
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default handleAuth;
