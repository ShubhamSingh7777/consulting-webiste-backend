import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS — allow your frontend origin
// CORS — allow your frontend origin
app.enableCors({
  origin: [
    'https://sharmaassociates.in',           // production domain
    'https://www.sharmaassociates.in',        // www version
    'https://consulting-website-two-silk.vercel.app',  // Vercel frontend
    'http://localhost:3000',                  // local dev
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Serve admin panel UI
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/admin',
  });

  // Swagger docs (disable in prod if needed)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Sharma & Associates — Admin API')
      .setDescription('Admin panel API for managing candidates and users')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 Sharma Admin API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`🖥️  Admin Panel: http://localhost:${port}/admin\n`);
}

bootstrap();
