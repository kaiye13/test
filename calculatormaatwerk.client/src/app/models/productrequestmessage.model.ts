import { Action } from "./actionenum.model";
import { IProduct, IProductResponse } from "./product.model";

export interface IProductRequestMessage{
    action: Action;
    products: IProduct[];
    signature: string;
}

export interface IProductRequestMessageResponse{
    action: string;
    products: IProductResponse[];
    signature: string;
}