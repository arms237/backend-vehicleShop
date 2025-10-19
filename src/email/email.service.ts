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
      return false;
    }

    try {
      const url = `${this.configService.get('FRONTEND_URL')}/${language}/auth/verify-email?token=${token}`;
      const subject = this.i18n.translate('common.VERIFICATION_SUBJECT', { lang: language });
      const body = this.i18n.translate('common.VERIFICATION_BODY', { lang: language, args: { url } });
      const appName = this.configService.get('APP_NAME') || 'Go4Motors';

      await this.transporter!.sendMail({
        from: `"${appName}" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject,
        html: `
          <!DOCTYPE html>
          <html lang="${language}">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f9fafb;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              }
              
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
              }
              
              .logo {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              
              .header-subtitle {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 300;
              }
              
              .content {
                padding: 40px 30px;
              }
              
              .welcome-text {
                font-size: 24px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 16px;
                text-align: center;
              }
              
              .message {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 32px;
                text-align: center;
                line-height: 1.7;
              }
              
              .cta-container {
                text-align: center;
                margin: 40px 0;
              }
              
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
              }
              
              .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
              }
              
              .security-notice {
                background-color: #fef3cd;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
              }
              
              .security-notice-title {
                font-weight: 600;
                color: #92400e;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .security-notice-text {
                font-size: 14px;
                color: #92400e;
                line-height: 1.5;
              }
              
              .footer {
                background-color: #f9fafb;
                padding: 24px 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              
              .footer-text {
                font-size: 14px;
                color: #9ca3af;
                margin-bottom: 16px;
              }
              
              .alternative-link {
                font-size: 12px;
                color: #9ca3af;
                word-break: break-all;
                margin-top: 16px;
                padding: 12px;
                background-color: #f3f4f6;
                border-radius: 6px;
              }
              
              @media (max-width: 600px) {
                .container {
                  margin: 0;
                  border-radius: 0;
                }
                
                .header, .content, .footer {
                  padding: 24px 20px;
                }
                
                .welcome-text {
                  font-size: 20px;
                }
                
                .cta-button {
                  padding: 14px 24px;
                  font-size: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🚗 ${appName}</div>
                <div class="header-subtitle">${language === 'fr' ? 'Votre partenaire automobile' : language === 'en' ? 'Your automotive partner' : 'Il vostro partner automobilistico'}</div>
              </div>
              
              <div class="content">
                <div class="welcome-text">
                  ${language === 'fr' ? '🎉 Bienvenue !' : language === 'en' ? '🎉 Welcome!' : '🎉 Benvenuto!'}
                </div>
                
                <div class="message">
                  ${body}
                </div>
                
                <div class="cta-container">
                  <a href="${url}" class="cta-button">
                    ✅ ${this.i18n.translate('common.VERIFY_BUTTON', { lang: language })}
                  </a>
                </div>
                
                <div class="security-notice">
                  <div class="security-notice-title">
                    🔐 ${language === 'fr' ? 'Note de sécurité' : language === 'en' ? 'Security Notice' : 'Avviso di Sicurezza'}
                  </div>
                  <div class="security-notice-text">
                    ${language === 'fr' 
                      ? 'Ce lien est valide pendant 24 heures. Si vous n\'avez pas créé de compte, ignorez cet email.' 
                      : language === 'en' 
                      ? 'This link is valid for 24 hours. If you didn\'t create an account, please ignore this email.'
                      : 'Questo link è valido per 24 ore. Se non hai creato un account, ignora questa email.'
                    }
                  </div>
                </div>
                
                <div class="alternative-link">
                  ${language === 'fr' ? 'Lien direct' : language === 'en' ? 'Direct link' : 'Link diretto'}: <br>
                  ${url}
                </div>
              </div>
              
              <div class="footer">
                <div class="footer-text">
                  ${language === 'fr' 
                    ? 'Merci de nous faire confiance pour vos besoins automobiles.' 
                    : language === 'en' 
                    ? 'Thank you for trusting us with your automotive needs.'
                    : 'Grazie per averci scelto per le vostre esigenze automobilistiche.'
                  }
                </div>
                
                <div class="footer-text">
                  © 2024 ${appName}. ${language === 'fr' ? 'Tous droits réservés' : language === 'en' ? 'All rights reserved' : 'Tutti i diritti riservati'}.
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`✅ Email de vérification envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email de vérification:', error.message);
      return false;
    }
  }
//--------------------------------------------------------------
  async sendResetPasswordEmail(email: string, token: string, language: string) {
    if (!this.checkEmailService()) {
      console.log(`📧 Email de reset non envoyé à ${email} (service désactivé)`);
      throw new InternalServerErrorException('Service email temporairement indisponible');
    }

    try {
      const url = `${this.configService.get('FRONTEND_URL')}/${language}/auth/reset-password?token=${token}`;
      const subject = this.i18n.translate('common.FORGOT_PASSWORD_SUBJECT', { lang: language });
      const body = this.i18n.translate('common.PASSWORD_RESET_BODY', { lang: language, args: { url } });
      const appName = this.configService.get('APP_NAME') || 'Go4Motors';

      await this.transporter!.sendMail({
        from: `"${appName}" <${this.configService.get('EMAIL_USER')}>`,
        to: email,
        subject,
        html: `
          <!DOCTYPE html>
          <html lang="${language}">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f9fafb;
              }
              
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              }
              
              .header {
                background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
              }
              
              .logo {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              
              .header-subtitle {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 300;
              }
              
              .content {
                padding: 40px 30px;
              }
              
              .alert-icon {
                text-align: center;
                font-size: 64px;
                margin-bottom: 24px;
              }
              
              .welcome-text {
                font-size: 24px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 16px;
                text-align: center;
              }
              
              .message {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 32px;
                text-align: center;
                line-height: 1.7;
              }
              
              .cta-container {
                text-align: center;
                margin: 40px 0;
              }
              
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
              }
              
              .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
              }
              
              .security-notice {
                background-color: #fef2f2;
                border: 1px solid #fca5a5;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
              }
              
              .security-notice-title {
                font-weight: 600;
                color: #dc2626;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .security-notice-text {
                font-size: 14px;
                color: #dc2626;
                line-height: 1.5;
              }
              
              .warning-box {
                background-color: #fffbeb;
                border: 1px solid #fbbf24;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
              }
              
              .warning-title {
                font-weight: 600;
                color: #d97706;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              
              .warning-text {
                font-size: 14px;
                color: #d97706;
                line-height: 1.5;
              }
              
              .footer {
                background-color: #f9fafb;
                padding: 24px 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              
              .footer-text {
                font-size: 14px;
                color: #9ca3af;
                margin-bottom: 16px;
              }
              
              .alternative-link {
                font-size: 12px;
                color: #9ca3af;
                word-break: break-all;
                margin-top: 16px;
                padding: 12px;
                background-color: #f3f4f6;
                border-radius: 6px;
              }
              
              @media (max-width: 600px) {
                .container {
                  margin: 0;
                  border-radius: 0;
                }
                
                .header, .content, .footer {
                  padding: 24px 20px;
                }
                
                .welcome-text {
                  font-size: 20px;
                }
                
                .cta-button {
                  padding: 14px 24px;
                  font-size: 15px;
                }
                
                .alert-icon {
                  font-size: 48px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🚗 ${appName}</div>
                <div class="header-subtitle">${language === 'fr' ? 'Réinitialisation du mot de passe' : language === 'en' ? 'Password Reset' : 'Reimpostazione Password'}</div>
              </div>
              
              <div class="content">
                <div class="alert-icon">🔐</div>
                
                <div class="welcome-text">
                  ${language === 'fr' ? 'Réinitialisation demandée' : language === 'en' ? 'Reset Requested' : 'Reset Richiesto'}
                </div>
                
                <div class="message">
                  ${body}
                </div>
                
                <div class="cta-container">
                  <a href="${url}" class="cta-button">
                    🔑 ${this.i18n.translate('common.VERIFY_BUTTON', { lang: language })}
                  </a>
                </div>
                
                <div class="security-notice">
                  <div class="security-notice-title">
                    ⚠️ ${language === 'fr' ? 'Important' : language === 'en' ? 'Important' : 'Importante'}
                  </div>
                  <div class="security-notice-text">
                    ${language === 'fr' 
                      ? 'Ce lien expire dans 1 heure pour votre sécurité. Ne partagez jamais ce lien.' 
                      : language === 'en' 
                      ? 'This link expires in 1 hour for your security. Never share this link.'
                      : 'Questo link scade in 1 ora per la tua sicurezza. Non condividere mai questo link.'
                    }
                  </div>
                </div>
                
                <div class="warning-box">
                  <div class="warning-title">
                    🚨 ${language === 'fr' ? 'Vous n\'avez pas demandé ceci ?' : language === 'en' ? 'Didn\'t request this?' : 'Non hai richiesto questo?'}
                  </div>
                  <div class="warning-text">
                    ${language === 'fr' 
                      ? 'Si vous n\'avez pas demandé de réinitialisation, ignorez cet email et contactez-nous immédiatement.' 
                      : language === 'en' 
                      ? 'If you didn\'t request a password reset, ignore this email and contact us immediately.'
                      : 'Se non hai richiesto un reset della password, ignora questa email e contattaci immediatamente.'
                    }
                  </div>
                </div>
                
                <div class="alternative-link">
                  ${language === 'fr' ? 'Lien direct' : language === 'en' ? 'Direct link' : 'Link diretto'}: <br>
                  ${url}
                </div>
              </div>
              
              <div class="footer">
                <div class="footer-text">
                  ${language === 'fr' 
                    ? 'Pour votre sécurité, ce lien sera automatiquement désactivé après utilisation.' 
                    : language === 'en' 
                    ? 'For your security, this link will be automatically disabled after use.'
                    : 'Per la tua sicurezza, questo link sarà automaticamente disabilitato dopo l\'uso.'
                  }
                </div>
                
                <div class="footer-text">
                  © 2024 ${appName}. ${language === 'fr' ? 'Tous droits réservés' : language === 'en' ? 'All rights reserved' : 'Tutti i diritti riservati'}.
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`✅ Email de reset envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email de reset:', error.message);
      throw new InternalServerErrorException('Échec envoi email de réinitialisation');
    }
  }
}
