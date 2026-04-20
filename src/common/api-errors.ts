import { HttpException, HttpStatus } from '@nestjs/common'

export type ApiErrorPayload = {
  code: string
  message: string
  details?: unknown
}

export const apiError = (
  code: string,
  message: string,
  details?: unknown,
): ApiErrorPayload => ({
  code,
  message,
  ...(details === undefined ? {} : { details }),
})

export const notFoundError = (message: string, details?: unknown) =>
  new HttpException(apiError('not_found', message, details), HttpStatus.NOT_FOUND)

export const validationError = (message: string, details?: unknown) =>
  new HttpException(
    apiError('validation_error', message, details),
    HttpStatus.UNPROCESSABLE_ENTITY,
  )

export const bookingConflictError = (message: string, details?: unknown) =>
  new HttpException(
    apiError('booking_conflict', message, details),
    HttpStatus.CONFLICT,
  )
