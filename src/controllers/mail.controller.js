import generateHtml from "../utils/generateHtml.js";
import sendEmail from "../middleware/sendMail.js";
import { logger } from "../utils/logger.js";

class MailController {
  constructor() {}

  async send(req, res, next) {
    try {
      const { detail, products } = req.body;
      const user = req.user;

      const to = user.email;
      const subject = 'Detalle de tu Compra';
      const htmlContent = generateHtml(detail, products);

      await sendEmail(to, subject, htmlContent);

      logger.info('Email sent successfully!');
      res.json({ success: true, message: 'Email enviado exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  async sendPasswordReset(req, res, next) {
    try {
      const { email, token, newPassword } = req.body;

      const currentTime = new Date();
      if (new Date(token.expiryTime) < currentTime) {
        return res.status(400).json({ success: false, message: 'Password reset link has expired' });
      }

      if (newPassword === req.user.password) {
        return res.status(400).json({ success: false, message: 'New password must be different from the old one' });
      }

      await sendEmail(email, 'Password Reset', `Your password reset token is: ${token}`);

      logger.info('Password reset email sent successfully!');
      res.json({ success: true, message: 'Password reset email sent successfully!' });
    } catch (error) {
      next(error);
    }
  }
}

export default MailController;
