import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private i18n: I18nService,
  ) {}

  //Inscription
  async signup(signupDto: SignupDto, i18nContext: I18nContext) {
    const { email, firstName, lastName, phone, password } = signupDto;
    const lang = signupDto.preferredLanguage || i18nContext.lang || 'fr';

    //Vérifier si l'email existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        this.i18n.translate('common.EMAIL_ALREADY_USED', { lang }),
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

    //Générer les token
    const verificationToken = uuidv4();
    const hashed_verificationToken = await bcrypt.hash(verificationToken, 10);

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
    const lang = i18nContext.lang || 'fr';
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

    const payload = {sub: updatedUser.id , email: updatedUser.email, role: updatedUser.role.name};
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
    const payload  = {sub: user.id , email: user.email, role: user.role.name};
    const token = await this.jwtService.signAsync(payload);

    //Traduire le role 
    const roleName = this.i18n.translate(
      `common.ROLE_${user.role.name.toUpperCase()}`,
      { lang: i18nContext.lang || 'fr' },
    );

    return {
      message: this.i18n.translate('common.LOGIN_SUCCESS', { lang: i18nContext.lang || 'fr' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName, 
        preferredLanguage: user.preferredLanguage,
      },
      token:  token,
    }
  }
  //Reinitialisation du mot de passe

  //
}
