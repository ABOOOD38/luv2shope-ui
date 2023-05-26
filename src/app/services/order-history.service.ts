import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.apiURL + '/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(userEmail: string): Observable<OrderHistoryDTO> {

    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;

    return this.httpClient.get<OrderHistoryDTO>(orderHistoryUrl);
  }
}

interface OrderHistoryDTO {
  _embedded: {
    orders: OrderHistory[]
  }
}
