import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email de l\'utilisateur / Email dell\'utente / User\'s email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}