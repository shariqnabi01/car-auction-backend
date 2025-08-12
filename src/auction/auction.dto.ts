import { IsNotEmpty, IsInt, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(0)
  startingBid: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
