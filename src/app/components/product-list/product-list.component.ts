import { CssSelector } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  private searchMode: boolean = false;
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = "";

  constructor(
    private prodcutService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(() => this.listProducts());
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode)
      this.handleSearchProduct();
    else
      this.handleListProducts();

  }

  handleSearchProduct() {

    const keyword = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;

    this.prodcutService.searchProductPaginate(this.pageNumber - 1, this.pageSize, keyword)
      .subscribe(this.processRequest());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }

    // angular will reuse a component if it is currently being viewed
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 0;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.prodcutService
      .getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(this.processRequest());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

  private processRequest() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }
}
