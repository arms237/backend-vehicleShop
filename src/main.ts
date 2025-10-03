import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-custom-lang',
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('VehicleShop API')
    .setDescription('API pour la gestion des véhicules, marques et catégories')
    .setVersion('1.0')
    .addTag('Marques', 'Gestion des marques de véhicules')
    .addTag('Catégories', 'Gestion des catégories de véhicules')
    .addTag('Véhicules', 'Gestion des véhicules')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'VehicleShop API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();