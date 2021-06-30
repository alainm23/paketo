import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

// Services
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-categorias-interes',
  templateUrl: './categorias-interes.page.html',
  styleUrls: ['./categorias-interes.page.scss'],
})
export class CategoriasInteresPage implements OnInit {
  categorias: any [] = [];
  categoria_selected: Map <number, any> = new Map <number, any> ();
  constructor (private database: DatabaseService,
    private utils: UtilsService,
    private auth: AuthService,
    private navController: NavController,
    private loadingController: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.get_datos ('categorias').subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      this.categorias = res;
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  categoria_toggled (item: any) {
    if (this.categoria_selected.has (item.id)) {
      this.categoria_selected.delete (item.id);
    } else {
      this.categoria_selected.set (item.id, item);
    }

    console.log (this.categoria_selected);
  }

  async submit () {
    if (this.categoria_selected.size <= 0) {
      this.utils.presentToast ('Seleccione al menos una opcion', 'danger');
      return;
    }

    let categorias: number [] = [];
    this.categoria_selected.forEach ((value: any, key: number) => {
      categorias.push (key);
    });

    console.log (categorias);

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.auth.asignar_categorias ({categorias: categorias}).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      if (res.status === true) {
        this.navController.navigateRoot (['home']);
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }
}
