import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-sobre-paketo',
  templateUrl: './sobre-paketo.page.html',
  styleUrls: ['./sobre-paketo.page.scss'],
})
export class SobrePaketoPage implements OnInit {
  cart_item_count: BehaviorSubject<number>;
  
  constructor (private navController: NavController,
    private cartService: CartService) { }

  ngOnInit () {
    this.cart_item_count = this.cartService.get_cart_item_count ();
  }

  back () {
    this.navController.back ();
  }

  go_page (page: string) {
    this.navController.navigateForward ([page]);
  }
}
