import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsOptional()
  redirectTo?: string;
}
