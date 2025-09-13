import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {I18nModule, QueryResolver, HeaderResolver, CookieResolver} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // langue par défaut
      loaderOptions: {
        // Utilise le dossier i18n à la racine du projet, que ce soit en dev (src) ou en prod (dist)
        path: path.join(process.cwd(), 'src/i18n/'),
        watch: true, // recharge automatiquement si tu modifies les fichiers
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // permet de choisir ?lang=fr
        new HeaderResolver(['x-custom-lang']), // permet de choisir via un header
        new CookieResolver(['lang']), // permet de choisir via un cookie
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
