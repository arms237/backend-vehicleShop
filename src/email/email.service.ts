import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {
    // Vérification des credentials
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    if (!user || !pass) {
      throw new Error('Credentials EMAIL_USER ou EMAIL_PASS manquants');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      logger:true,
      debug: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  }

    // Vérification de la configuration SMTP au démarrage
  async onModuleInit() {
    try {
      await this.transporter.verify();
      console.log('✅ Configuration SMTP validée');
      // Afficher l'email utilisé (sans le mot de passe)
      console.log(
        `📧 Utilisation de l'email: ${this.configService.get('EMAIL_USER')}`,
      );
    } catch (err) {
      console.error('❌ Erreur connexion SMTP:', err.message);
       console.log(
        `📧 Utilisation de l'email: ${this.configService.get('EMAIL_PASS')}`,
      );
      throw err; // Propager l'erreur pour empêcher le démarrage si la config est invalide
    }
  }

  async sendVerificationEmail(email: string, token: string, language: string) {
    try {
      const url = `${this.configService.get(
        'APP_URL',
      )}/auth/verify?token=${token}`;

      const subject = this.i18n.translate('common.VERIFICATION_SUBJECT', {
        lang: language,
      });

      const body = this.i18n.translate('common.VERIFICATION_BODY', {
        lang: language,
        args: { url },
      });

      await this.transporter.sendMail({
        from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.5">
            <h2>${subject}</h2>
            <p>${body}</p>
            <p>
              <a href="${url}" 
                 style="background:#4CAF50;color:#fff;padding:10px 15px;
                        text-decoration:none;border-radius:5px;">
                ${this.i18n.translate('common.VERIFY_BUTTON', { lang: language })}
              </a>
            </p>
          </div>
        `,
      });

      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw new InternalServerErrorException('Email not sent');
    }
  }
}
