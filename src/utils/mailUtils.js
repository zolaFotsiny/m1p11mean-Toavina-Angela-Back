const nodemailer = require('nodemailer');
require('dotenv').config();

class MailUtils {

    constructor() {
        // Configurer le transporteur de messagerie
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,

            },
        });
    }

    async sendReminderEmail(clientEmail, subject, text) {
        try {
            const fullHtmlContent = MailUtils.createBasicEmailContent(text);
            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: clientEmail,
                subject: subject,
                html: fullHtmlContent,
            };

            // Envoyer l'e-mail
            await this.transporter.sendMail(mailOptions);
            console.log(`E-mail envoyé à ${clientEmail}`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'e-mail : ${error.message}`);
            throw error;
        }
    }

    static createBasicEmailContent(innerContent) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh; /* 100% de la hauteur de la vue */
                        background-color: #f0f0f0;
                    }
    
                    .container {
                        width: 600px;
                        text-align: center;
                        border: 2px solid #f0f0f0; /* Bordure gris foncé */
                        border-radius: 8px; /* Coins arrondis */
                        overflow: hidden; /* Empêche le contenu de déborder de la boîte */
                    }
    
                    .header {
                        background-color: #8CC84B; /* Vert pomme */
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                    }
    
                    .content {
                        padding: 20px;
                        background-color: #ffffff; /* Fond de la boîte */
                    }
    
                    .reminder-text {
                        font-size: 16px;
                        color: #333;
                    }
    
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #888;
                        padding: 10px;
                        background-color: #f0f0f0; /* Fond du footer */
                    }
                </style>
                <title>Reminder Email</title>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>BEAUTY FLY</h1>
                    </div>
                    <div class="content">
                        ${innerContent}
                    </div>
                    <div class="footer">
                        <p>Contactez-nous : contact@beautyfly.com</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }


}

module.exports = MailUtils;
