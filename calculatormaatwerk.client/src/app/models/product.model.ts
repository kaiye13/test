import { Action } from "./actionenum.model";
import { IMaterial } from "./material.model";

export interface IProduct{
    barcode: string;
    action: Action;
    materials: IMaterial[];
    imageUrl: string;
    title: string;
    category: string;
    deliveryTime: string;
    quantity: number;
    price: number;
    purchasePrice: string;
    unitPrice: number;

}

export interface IProductResponse{
    barcode: string;
    action: string;
    materials: IMaterial[];
    imageUrl: string;
    title: string;
    category: string;
    deliveryTime: string;
    quantity: number;
    price: number;
    purchasePrice: string;
    unitPrice: number;
}