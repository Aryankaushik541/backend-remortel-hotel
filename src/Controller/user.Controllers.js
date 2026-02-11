const User = require('../Models/user.Models');
const { sendMail } = require('../utils/mailer');

exports.Usercreate = async (req, res) => {
  try {
    const { name, email, contact, message } = req.body;

    // ✅ Step 1: Validate input
    if (!name || !email || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
  //
    // ✅ Step 2: Create user safely
    const user = await User.create({
      name,
      email,
      contact,
      message
    });

    // ✅ Step 3: Send confirmation email to user
    await sendMail({
      to: email,
      subject: "Merci pour vos commentaires - Auberge Motel Drakkar",
      text: `Bonjour ${name}, merci de nous avoir contactés!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Bonjour ${name}!</h2>
          <p>Merci de nous avoir fait part de vos commentaires. Nous avons bien reçu votre message :</p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
            <em>"${message}"</em>
          </div>
          <p>Nous examinerons vos commentaires et travaillerons à améliorer votre expérience.</p>
          <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Cordialement,<br>
            <strong>L'équipe Auberge Motel Drakkar</strong><br>
            Email:rohan.ahir46@gmail.com
          </p>
        </div>
      `
    });

    // ✅ Step 4: Send notification to business
    await sendMail({
      to: "rohan.ahir46@gmail.com",
      subject: `Nouveaux commentaires de ${name}`,
      text: `Nouveaux commentaires reçus de ${name} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Nouveaux commentaires reçus</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Nom:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Contact:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${contact}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Message:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Reçu le: ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      `
    });

    // ✅ Step 5: Success response
    res.status(201).json({
      success: true,
      message: "Commentaires envoyés avec succès",
      data: user
    });

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "Erreur du serveur",
      error: error.message
    });
  }
};