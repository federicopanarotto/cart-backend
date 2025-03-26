import { IsInt, IsMongoId, Min } from "class-validator";

export class AddCartItemDTO {
    @IsMongoId()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class UpdateCartQuantityDTO {
    @IsInt()
    @Min(1)
    quantity: number;
}