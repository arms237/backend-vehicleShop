import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Email de l'utilisateur (ou téléphone si disponible)",
    example: "john.doe@example.com",
  })
  @IsString()
  @IsNotEmpty()
  email: string; // Peut être un email ou un numéro de téléphone

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: "Password123",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
