import { Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('signup')
    @UsePipes(ValidationPipe)
    @ApiBody({type: SignupDto})
    @ApiResponse({ status: 201, description: 'Inscription réussie / Registrazione completata / Signup successful' })
    @ApiResponse({ status: 400, description: 'Données invalides / Dati non validi / Invalid data' })
    async signup(@Body() signupDto: SignupDto, @I18n() i18n: I18nContext) {
        return this.authService.signup(signupDto, i18n);
    }

    @Post('verify')
    @ApiQuery({ name: 'token', type: String })
    @ApiResponse({ status: 200, description: 'Vérification réussie / Verifica completata / Verification successful' })
    @ApiResponse({ status: 400, description: 'Token invalide / Token non valido / Invalid token' })
    async verifyEmail(@Query('token') token: string,  @I18n() i18n: I18nContext){
        return this.authService.verifyEmail(token, i18n);
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    @ApiBody({type: LoginDto})
    @ApiResponse({ status: 200, description: 'Connexion réussie / Accesso riuscito / Login successful' })
    @ApiResponse({ status: 400, description: 'Données invalides / Dati non validi / Invalid data' })
    async login(@Body() loginDto: LoginDto, @I18n() i18n: I18nContext){
        return this.authService.login(loginDto, i18n);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    async getProfile(@Request() req:any, @I18n() i18n: I18nContext){
        console.log(req.user);
        return this.authService.validateUser(req.user.id, i18n);
    }

    @Post('forgot-password')
    @UsePipes(ValidationPipe)
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'Demande de réinitialisation envoyée / Richiesta di reimpostazione inviata / Reset request sent' })
    @ApiResponse({ status: 400, description: 'Email non trouvé / Email non trovato / Email not found' })
    async forgotPassword(@Body() forgotPwdDto:ForgotPasswordDto, @I18n() i18n: I18nContext){
        return this.authService.forgotPassoword(forgotPwdDto,i18n)
    }

    @Post('reset-password')
    @UsePipes(ValidationPipe)
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé / Password reimpostata / Password reset successful' })
    @ApiResponse({ status: 400, description: 'Token invalide / Token non valido / Invalid token' })
    async resetPasssowrd(@Body() resetPwdDto: ResetPasswordDto, @I18n() i18n: I18nContext){
        return this.authService.resetPassword(resetPwdDto,i18n)
    }

}
