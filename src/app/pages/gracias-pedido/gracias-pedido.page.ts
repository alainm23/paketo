import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-gracias-pedido',
  templateUrl: './gracias-pedido.page.html',
  styleUrls: ['./gracias-pedido.page.scss'],
})
export class GraciasPedidoPage implements OnInit {
  data: any;
  constructor (private route: ActivatedRoute,
    private navController: NavController) { }

  ngOnInit () {
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('data'));
    console.log (this.data);
  }

  root () {
    this.navController.navigateRoot ('home');
  }
}
