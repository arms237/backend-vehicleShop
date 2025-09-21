import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private i18n: I18nService,
  ) {}

  //Inscription
  async signup(signupDto: SignupDto) {
    const { email, firstName, lastName, phone, password, preferredLanguage } =
      signupDto;
    const lang = preferredLanguage || 'it';
     //Générer les token
    const verificationToken = uuidv4();
    //Vérifier si l'email existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      if(!existingUser.isVerified){
        // Resend verification email
        await this.prisma.user.update(
          { where: { email }, data: { verificationToken } })
        await this.emailService.sendVerificationEmail(
          existingUser.email,
          verificationToken,
          lang,
        );
        throw new BadRequestException(
          this.i18n.translate('common.EMAIL_NOT_VERIFIED_RESEND', { lang }),
        );
      }
      console.log(preferredLanguage)
      throw new BadRequestException(
        this.i18n.translate('common.EMAIL_ALREADY_USED', { lang: 'it' }),
      );
    }
    
    //Vérifier le numero de téléphone
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        this.i18n.translate('common.PHONE_ALREADY_USED', { lang }),
      );
    }
   
    //Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    //Vérifier/Créer le role
    let clientRole = await this.prisma.role.findFirst({
      where: { name: 'client' },
    });
    if (!clientRole) {
      clientRole = await this.prisma.role.create({
        data: {
          name: 'client',
        },
      });
    }
    //Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword,
        roleId: clientRole?.id || 1, // Par défaut client
        preferredLanguage: lang,
        verificationToken,
      },
      include: { role: true },
    });

    //Envoyer l'email de vérification
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      lang,
    );

    //Traduire le role

    const roleName = this.i18n.translate(
      `common.ROLE_${user.role.name.toUpperCase()}`,
      { lang },
    );

    return {
      message: this.i18n.translate(`common.SIGNUP_SUCCESS`, { lang }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
        preferredLanguage: user.preferredLanguage,
      },
    };
  }

  //Vérification de l'email
  async verifyEmail(token: string, i18nContext: I18nContext) {
    const lang = i18nContext.lang || 'it';
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
      include: { role: true },
    });
    if (!user) {
      throw new BadRequestException(
        this.i18n.translate('common.INVALID_TOKEN', { lang }),
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
      include: { role: true },
    });

    const roleName = this.i18n.translate(
      `common.ROLE_${updatedUser.role.name.toUpperCase()}`,
      { lang },
    );

    const payload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role.name,
    };
    const jwtToken = await this.jwtService.signAsync(payload);

    return {
      message: this.i18n.translate(`common.VERIFICATION_SUCCESS`, { lang }),
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: roleName,
        preferredLanguage: updatedUser.preferredLanguage,
      },
      token: jwtToken,
    };
  }

  // Connexion
  async login(loginDto: LoginDto, i18nContext: I18nContext) {
    const { email, password } = loginDto;
    //vérifier l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('common.INVALID_CREDENTIALS', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }
    //vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18n.translate('common.INVALID_CREDENTIALS', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }
    //vérifier si l'email est vérifié
    if (!user.isVerified) {
      throw new UnauthorizedException(
        this.i18n.translate('common.EMAIL_NOT_VERIFIED', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }

    //Générer le token JWT
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const token = await this.jwtService.signAsync(payload);

    //Traduire le role
    const roleName = this.i18n.translate(
      `common.ROLE_${user.role.name.toUpperCase()}`,
      { lang: i18nContext.lang || 'fr' },
    );

    return {
      message: this.i18n.translate('common.LOGIN_SUCCESS', {
        lang: i18nContext.lang || 'fr',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
        preferredLanguage: user.preferredLanguage,
      },
      token: token,
    };
  }
  //Reinitialisation du mot de passe
  async forgotPassoword(
    forgotPwdDto: ForgotPasswordDto,
    i18nContext: I18nContext,
  ) {
    const { email } = forgotPwdDto;
    //Vérifier l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException(
        this.i18n.translate('common.USER_NOT_FOUND', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }
    // Génerer token et une expiration
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 heure

    // Envoyer un email avec le token
    await this.emailService.sendResetPasswordEmail(
      user.email,
      resetToken,
      i18nContext.lang || 'fr',
    );

    //Sauvegarder le token et l'expiration dans la base de données
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        verificationExpiresAt: resetExpires,
      },
    });
    return{
      message:this.i18n.translate("common.RESET_EMAIL_SENT", {lang:i18nContext.lang|| 'fr'})
    }
  }

  async resetPassword(resetPswDto: ResetPasswordDto, i18nContext:I18nContext) {
    const {token,password} = resetPswDto;
    // Vérifier le token
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
      include: { role: true },
    });

   if (!user || (user.resetPasswordExpiresAt && user.resetPasswordExpiresAt < new Date())) {
      throw new BadRequestException(this.i18n.translate('common.INVALID_TOKEN', { lang:i18nContext.lang || 'fr' }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
      include: { role: true },
    });

    const roleName = this.i18n.translate(`common.ROLE_${updatedUser.role.name.toUpperCase()}`, { lang:i18nContext.lang || 'fr' });

    return {
      message: this.i18n.translate('common.RESET_PASSWORD_SUCCESS', { lang:i18nContext.lang || 'fr' }),
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: roleName,
        preferredLanguage: updatedUser.preferredLanguage,
      },
    };
  }
  //validation de l'utilisateur
  async validateUser(userId: string, i18nContext: I18nContext) {
    if (!userId) {
      throw new Error(
        this.i18n.translate('common.INVALID_USER_ID', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new Error(
        this.i18n.translate('common.USER_NOT_FOUND', {
          lang: i18nContext.lang || 'fr',
        }),
      );
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role.name,
      isVerified: user.isVerified,
      preferredLanguage: user.preferredLanguage,
    };
  }
}
