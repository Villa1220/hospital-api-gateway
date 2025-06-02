import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
  origin: ['https://doctor-fronted.vercel.app','http://localhost:5173','*'],
  credentials: true, // solo si usas cookies o auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});



  
  const config = new DocumentBuilder()
    .setTitle('API Documentación')
    .setDescription('Documentación generada automáticamente con Swagger')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(3006, '0.0.0.0');
}
bootstrap();
