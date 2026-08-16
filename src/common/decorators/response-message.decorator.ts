import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';

/**
 * Decorator to set a custom response message for the global ResponseInterceptor.
 * @param message Custom message string, defaults to 'Success'
 */
export const ResponseMessage = (message: string = 'Success') =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);

/**
 * Alias for ResponseMessage to support lower-case naming convention.
 */
export const responsemessage = ResponseMessage;
