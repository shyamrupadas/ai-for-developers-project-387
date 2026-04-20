import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { validationError } from './common/api-errors'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ origin: true })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const details = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints ?? {}),
        }))
        return validationError('Validation failed', { errors: details })
      },
    }),
  )

  const port = process.env.PORT ? Number(process.env.PORT) : 4010
  await app.listen(port)
}

bootstrap()
