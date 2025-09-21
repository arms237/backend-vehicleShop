import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {I18nModule, QueryResolver, HeaderResolver, CookieResolver, I18nService} from 'nestjs-i18n';
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
        // Ce chemin pointe vers 'src/i18n' en dev et 'dist/i18n' en prod
        path: path.join(__dirname, '/i18n/'),
        watch: true, // recharge automatiquement si tu modifies les fichiers
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // Priorité 1
        new HeaderResolver(['x-custom-lang']), // Priorité 2 (c'est ce que nous allons utiliser)
        new CookieResolver(['lang']), // Priorité 3
      ],
    }),
    AuthModule,
    PrismaModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly i18n: I18nService) {}

  onModuleInit() {
    console.log('--- [I18n Debug] Langues chargées au démarrage ---');
    // @ts-ignore - Accès à une propriété interne pour le debug
    const loadedLanguages = Object.keys(this.i18n.translations);
    console.log('Langues détectées dans les fichiers:', loadedLanguages);
    console.log('Langue de secours configurée:', this.i18n.getSupportedLanguages());
    console.log('-------------------------------------------------');

    if (!loadedLanguages.includes('it')) {
      console.error(
        "--- [I18n Debug] ERREUR: Le fichier de langue 'it' n'a pas été chargé. Vérifiez le chemin et le contenu du fichier 'i18n/it.json'.",
      );
    }
  }
}
