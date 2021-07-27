import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  search_result: any = {
    categorias: [],
    productos: []
  };
  search_text: string = '';
  loadins: any = {
    search: false
  };
  constructor(private database: DatabaseService,
    private navController: NavController,
    private modalController: ModalController) { }

  ngOnInit() {
  }

  search_change (event: any) {
    this.search_result.categorias = [];
    this.search_result.productos = [];

    console.log (event.detail.value);

    if (this.search_text.trim () !== '') {
      this.loadins.search = true;
      this.database.buscar_producto (event.detail.value).subscribe ((res: any) => {
        this.search_result = res;
        console.log (res);
        this.loadins.search = false;
      }, error => {
        this.loadins.search = false;
        console.log (error);
      });
    }
  }

  ver_pedido (item: any) {
    this.modalController.dismiss ().then (() => {
      this.navController.navigateForward (['producto-detalle', item.id]);
    });
  }

  ver_categoria (item: any) {
    this.modalController.dismiss ().then (() => {
      this.navController.navigateForward (['categoria-productos', JSON.stringify (item)]);
    });
  }

  back () {
    this.modalController.dismiss ();
  }
}
