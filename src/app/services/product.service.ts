import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = environment.apiURL + '/products';
  private baseCategoryUrl = environment.apiURL + '/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    const productByCategoryIdUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(productByCategoryIdUrl);
  }

  getProductListPaginate(pageNumber: number, pageSize: number, categoryId: number): Observable<ProductListDTO> {

    const url = `${this.baseUrl}/search/findByCategoryId` +
      `?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<ProductListDTO>(url);
  }

  searchProducts(keyword: string): Observable<Product[]> {

    const searchProductUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchProductUrl);
  }

  searchProductPaginate(pageNumber: number, pageSize: number, keyword: string): Observable<ProductListDTO> {

    const url = `${this.baseUrl}/search/findByNameContaining` +
      `?name=${keyword}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<ProductListDTO>(url);
  }

  getProductDetails(productId: number): Observable<Product> {

    const productByIdUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productByIdUrl);
  }

  getProductCategoryList(): Observable<ProductCategory[]> {

    return this.httpClient
      .get<ProductCategoryListDTO>(this.baseCategoryUrl)
      .pipe(map(response => response._embedded.productCategory))
  }


  private getProducts(url: string): Observable<Product[]> {

    return this.httpClient
      .get<ProductListDTO>(url)
      .pipe(map(response => response._embedded.products));
  }
}

interface ProductListDTO {
  _embedded: {
    products: Product[];
  }, page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface ProductCategoryListDTO {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
