import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-custom-lang',
  });
  const config = new DocumentBuilder()
    .setTitle('API Vente/Location Véhicules')
    .setDescription('API pour la gestion de véhicules avec authentification multilingue')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
 
  // Pipe de validation global avec i18n
  app.useGlobalPipes(new I18nValidationPipe());

  // Filtre d'exception global pour i18n
  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap()