import { IsEmail, IsString, IsNotEmpty, MinLength, Matches, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RoleName {
  client = 'client',
  admin = 'admin',
  seller = 'seller',
}

export class SignupDto {
  @ApiProperty({ description: 'Prénom de l\'utilisateur / Nome dell\'utente / User\'s first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom de famille / Cognome / User\'s last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Numéro de téléphone (optionnel) / Numero di telefono (opzionale) / Phone number (optional)' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Email unique' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mot de passe (min 8 chars, avec majuscule, minuscule, chiffre) / Password (min 8 chars, with uppercase, lowercase, number) / Password (min 8 caratteri, con maiuscola, minuscola, numero)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'common.PASSWORD_TOO_WEAK',
  })
  password: string;

  @ApiProperty({ description: 'Rôle (client, admin, seller)', enum: RoleName })
  @IsEnum(RoleName)
  @IsNotEmpty()
  roleName: RoleName;

  @ApiProperty({ description: 'Langue préférée (fr, en, it) / Lingua preferita / Preferred language', required: false })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;
}