import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isEmailEnabled = false;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {
    // Vérification des credentials
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');

    if (!user || !pass) {
      console.warn('⚠️  Credentials EMAIL_USER ou EMAIL_PASS manquants - Service email désactivé');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587, // Utiliser le port 587 au lieu de 465 pour TLS
        secure: false, // false pour 587, true pour 465
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } catch (error) {
      console.error('❌ Erreur création transporter SMTP:', error.message);
    }
  }

  // Vérification de la configuration SMTP au démarrage (non bloquante)
  async onModuleInit() {
    if (!this.transporter) {
      console.warn('⚠️  Service email non initialisé - Mode dégradé');
      return;
    }

    try {
      await this.transporter.verify();
      this.isEmailEnabled = true;
      console.log('✅ Configuration SMTP validée');
      console.log(`📧 Utilisation de l'email: ${this.configService.get('EMAIL_USER')}`);
    } catch (err) {
      console.error('❌ Erreur connexion SMTP:', err.message);
      console.warn('⚠️  Service email désactivé - L\'application continuera sans envoi d\'emails');
      this.isEmailEnabled = false;
      // Ne pas propager l'erreur - permettre à l'app de démarrer
    }
  }

  private checkEmailService() {
    if (!this.isEmailEnabled || !this.transporter) {
      console.warn('⚠️  Tentative d\'envoi d\'email mais service désactivé');
      return false;
    }
    return true;
  }

  async sendVerificationEmail(email: string, token: string, language: string) {
    if (!this.checkEmailService()) {
      console.log(`📧 Email de vérification non envoyé à ${email} (service désactivé)`);
      return false; // Retourner false au lieu de throw
    }

    try {
      const url = `${this.configService.get('FRONTEND_URL')}/${language}/auth/verify-email?token=${token}`;
      const subject = this.i18n.translate('common.VERIFICATION_SUBJECT', { lang: language });
      const body = this.i18n.translate('common.VERIFICATION_BODY', { lang: language, args: { url } });

      await this.transporter!.sendMail({
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

      console.log(`✅ Email de vérification envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email de vérification:', error.message);
      return false; // Retourner false au lieu de throw
    }
  }

  async sendResetPasswordEmail(email: string, token: string, language: string) {
    if (!this.checkEmailService()) {
      console.log(`📧 Email de reset non envoyé à ${email} (service désactivé)`);
      throw new InternalServerErrorException('Service email temporairement indisponible');
    }

    try {
      const url = `${this.configService.get('FRONTEND_URL')}/${language}/auth/reset-password?token=${token}`;
      const subject = this.i18n.translate('common.FORGOT_PASSWORD_SUBJECT', { lang: language });
      const body = this.i18n.translate('common.PASSWORD_RESET_BODY', { lang: language, args: { url } });

      await this.transporter!.sendMail({
        from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5">
              <h2>${subject}</h2>
              <p>${body}</p>
              <p>
                <a href="${url}" 
                   style="background:#4CAF50;color:#fff;padding:10px 15px;
                          text-decoration:none;border-radius:5px;">
                  ${this.i18n.translate('common.VERIFY_BUTTON', { lang: language })}
                </a>
              </p>
            </div>`,
      });

      console.log(`✅ Email de reset envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email de reset:', error.message);
      throw new InternalServerErrorException('Échec envoi email de réinitialisation');
    }
  }
}
