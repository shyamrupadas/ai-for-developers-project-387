import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { validationError } from './common/api-errors'
import { AppModule } from './app.module'

type SpaFallbackRequest = {
  method: string
  path?: string
  url: string
  accepts: (type: string) => string | false
}

type SpaFallbackResponse = {
  sendFile: (path: string) => void
}

type SpaFallbackNext = () => void

const frontendRoutePatterns = [
  /^\/$/,
  /^\/book(?:\/.*)?$/,
  /^\/admin$/,
  /^\/admin\/event-types$/,
  /^\/admin\/slots$/,
]

function configureStaticAssets(app: NestExpressApplication) {
  const staticAssetsPath = join(process.cwd(), 'public')
  const indexPath = join(staticAssetsPath, 'index.html')

  if (!existsSync(indexPath)) return

  app.useStaticAssets(staticAssetsPath)

  const server = app.getHttpAdapter().getInstance()
  server.use(
    (
      request: SpaFallbackRequest,
      response: SpaFallbackResponse,
      next: SpaFallbackNext,
    ) => {
      const isHtmlNavigation =
        (request.method === 'GET' || request.method === 'HEAD') &&
        request.accepts('html')
      const requestPath = request.path ?? request.url.split('?')[0]
      const isFrontendRoute = frontendRoutePatterns.some((pattern) =>
        pattern.test(requestPath),
      )

      if (!isHtmlNavigation || !isFrontendRoute) {
        next()
        return
      }

      response.sendFile(indexPath)
    },
  )
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

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
  configureStaticAssets(app)
  await app.listen(port, '0.0.0.0')
}

bootstrap()
