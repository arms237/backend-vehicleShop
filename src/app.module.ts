import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {I18nModule, QueryResolver, HeaderResolver, CookieResolver} from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmailService } from './email/email.service';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // pour les variables d'environnement
    I18nModule.forRoot({
      fallbackLanguage: 'fr', // langue par défaut
      loaderOptions: {
        // Utilise le dossier i18n à la racine du projet, que ce soit en dev (src) ou en prod (dist)
        path: path.join(process.cwd(), '/src/i18n/'),
        watch: true, // recharge automatiquement si tu modifies les fichiers
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // permet de choisir ?lang=fr
        new HeaderResolver(['x-custom-lang']), // permet de choisir via un header
        new CookieResolver(['lang']), // permet de choisir via un cookie
      ],
    }),
    AuthModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
