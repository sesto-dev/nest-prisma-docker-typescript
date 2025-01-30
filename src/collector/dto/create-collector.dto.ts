import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectorDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the collector',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Collector email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  userId: string;
}
