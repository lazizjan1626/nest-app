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
    .setTitle('crm API') 
    .setDescription('crm API uchun dokumentatsiya')  
    .setVersion('1.4')  
    .addTag('crm')  
    .build();
  app.use(cookieParser());


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = process.env.PORT ;

  await app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/api`)
  });
}
bootstrap();
