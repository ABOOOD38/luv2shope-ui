import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  stroage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    const userEmail = JSON.parse(this.stroage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistory(userEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
        console.log(userEmail);

        console.log("histor" + data);

      })
  }
}
