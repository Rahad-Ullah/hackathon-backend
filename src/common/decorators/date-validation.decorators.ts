import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validates that a date is today or in the future.
 */
export function IsTodayOrFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTodayOrFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be today or a future date`;
        },
      },
    });
  };
}

/**
 * Validates that a date is strictly in the future.
 */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          return date > new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}

/**
 * Validates that a date property is strictly after another date property on the same object.
 */
export function IsAfterDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return false;

          const date = new Date(value);
          const relatedDate = new Date(relatedValue);
          if (isNaN(date.getTime()) || isNaN(relatedDate.getTime()))
            return false;

          return date > relatedDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be after ${args.constraints[0]}`;
        },
      },
    });
  };
}
