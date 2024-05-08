import { UserMongo } from "../daos/mongo/user.daoMongo.js";
import { logger } from "../utils/logger.js";

class UsersController {
  constructor() {
    this.service = new UserMongo();
  }

  getDataUserById = async (id) => {
    const user = await this.service.getUserById(id);

    return {
      userId: id,
      userName: user?.first_name,
      userLName: user?.last_name,
      userEmail: user?.email,
      userRole: user?.role,
      userCart: user?.cart,
      ...this.handleAccess(user?.role),
    };
  };

  createUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      const newUser = { first_name, last_name, password, email };

      const result = await this.usersService.create(newUser);

      res.status(201).send({
        status: "success",
        payload: result,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  updateUser = async (req, res) => {
    const { uid } = req.params;
    const userToReplace = req.body;

    const result = await this.usersService.update({ _id: uid }, userToReplace);
    res.status(201).send({
      status: "success",
      payload: result,
    });
  };

  deleteUser = async (req, res) => {
    const { uid } = req.params;

    const result = await this.usersService.delete({ _id: uid });
    res.status(200).send({
      status: "success",
      payload: result,
    });
  };

  toggleUserRole = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.service.getUserById(uid);
      if (!user) return res.status(404).send({ message: "User not found" });

      user.role = user.role === "user" ? "premium" : "user";
      await user.save();

      res.sendSuccess({ message: "Rol del usuario actualizado", user });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  deleteInactiveUsers = async (req, res) => {
    try {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const inactiveUsers = await this.userService.findInactiveUsers(
        twoDaysAgo
      );

      if (inactiveUsers.length === 0) {
        return res.status(200).json({ message: "No inactive users found" });
      }

      for (const user of inactiveUsers) {
        await this.userService.deleteUser(user._id);

        const subject = "Account deleted by inactivity";
        const html = `
                <div>
                    <h2>Hola ${user.first_name},</h2>
                    <p>Tu cuenta ha sido cerrada por inactividad. Si tenes alguna pregunta, no dudes en consultarnos!</p>
                </div>`;
        await sendEmail(user.email, subject, html);
      }

      res
        .status(200)
        .json({ message: `Removed ${inactiveUsers.length} inactive users` });
    } catch (error) {
      console.error("Error deleting inactive users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default UsersController;
