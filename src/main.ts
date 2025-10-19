import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS améliorée
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000', 
      'http://127.0.0.1:3001',
      'https://vehicleshop-frontend.vercel.app',
      'https://go4motors.vercel.app',
      process.env.FRONTEND_URL || 'http://localhost:3001'
    ],
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Accept', 
      'Authorization', 
      'Access-Control-Allow-Credentials', 
      'x-custom-lang',
      'X-Requested-With'
    ],
    optionsSuccessStatus: 200
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Go4Motors API')
    .setDescription('API pour la gestion des véhicules, marques et catégories')
    .setVersion('1.0')
    .addTag('Auth', 'Authentification et gestion des utilisateurs')
    .addTag('Marques', 'Gestion des marques de véhicules')
    .addTag('Catégories', 'Gestion des catégories de véhicules')
    .addTag('Véhicules', 'Gestion des véhicules')
    .addTag('Email', 'Tests et diagnostic des emails')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Go4Motors API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuration du port pour la production (Render)
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Important: écouter sur toutes les interfaces
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();