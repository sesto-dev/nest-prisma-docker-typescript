import { IsString, IsOptional } from 'class-validator';

export class UpdateCollectorDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  website?: string;
}
