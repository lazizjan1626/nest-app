import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateStuffDto {
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @IsPhoneNumber()
  readonly phone_number: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
