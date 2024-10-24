import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser = require('cookie-parser'); 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  
    forbidNonWhitelisted: true, 
    transform: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Prisma API') 
    .setDescription('Prisme API uchun dokumentatsiya')  
    .setVersion('1.0')  
    .addTag('Prisma')  
    .build();
  app.use(cookieParser());


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002,()=>{
    console.log('Server is running on http://localhost:3002/api')
  });
}
bootstrap();
