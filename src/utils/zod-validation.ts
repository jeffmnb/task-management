import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: ZodType) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(({ path, message }) => ({
          path: path.join('.'),
          message: message,
        }));

        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed!',
          errors: formattedErrors,
        });
      }
      throw new BadRequestException();
    }
  }
}
