import { Body, Controller, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LoginDto } from './dto/login.dto';

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
}
