import { Product } from "./product.entity";
import { QueryProducts } from "./product.dto";
import { ProductModel } from "./product.model";

export async function getById(id: string): Promise<Product | null> {
  return await ProductModel.findById(id);
}

export async function find(query: Partial<QueryProducts>): Promise<Product[]> {
  const q: any = {};

  if (query.name) {
    q.name = {$regex: query.name, $options: 'i'}
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    q.netPrice = {};
  }

  if (query.minPrice !== undefined) {
    q.netPrice['$gte'] = query.minPrice;
  }
  
  if (query.maxPrice !== undefined) {
    q.netPrice['$lte'] = query.maxPrice;
  }

  const products = await ProductModel.find(q);
  return products;
}