import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class JoinAuctionDto {
  @IsNotEmpty()
  @IsString()
  auctionId: string;
}

export class BidDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  auctionId: string;

  @IsNotEmpty()
  @IsNumber()
  bidAmount: number;
}
