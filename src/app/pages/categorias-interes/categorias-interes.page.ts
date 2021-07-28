import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { OnesignalService } from 'src/app/services/onesignal.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-categorias-interes',
  templateUrl: './categorias-interes.page.html',
  styleUrls: ['./categorias-interes.page.scss'],
})
export class CategoriasInteresPage implements OnInit {
  categorias: any[] = [];
  categoria_selected: Map<number, any> = new Map<number, any>();
  type: string;
  default_icon: string = '/assets/img/grupo-2663.png';
  constructor(
    private database: DatabaseService,
    private utils: UtilsService,
    private auth: AuthService,
    private navController: NavController,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private onesignal: OnesignalService
  ) {}

  get_icono (item: any) {
    if (item.icono === null) {
      return this.default_icon;
    }

    return item.icono;
  }

  async ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');

    const loading = await this.loadingController.create({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios',
    });

    await loading.present();

    this.database.get_datos('categorias').subscribe(
      (res: any) => {
        loading.dismiss();
        this.categorias = res;
        console.log(res);

        if (this.type === 'black') {
          console.log(this.auth.USER_DATA);
          this.auth.USER_DATA.categorias.forEach((categoria: any) => {
            this.categoria_selected.set(categoria.id, categoria);
          });
        }
      },
      (error) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }

  categoria_toggled(item: any) {
    if (this.categoria_selected.has(item.id)) {
      this.categoria_selected.delete(item.id);
    } else {
      this.categoria_selected.set(item.id, item);
    }

    console.log(this.categoria_selected);
  }

  async submit() {
    if (this.categoria_selected.size <= 0) {
      this.utils.presentToast('Seleccione al menos una opcion', 'danger');
      return;
    }

    let categorias: number[] = [];
    this.categoria_selected.forEach((value: any, key: number) => {
      categorias.push(key);
    });

    console.log(categorias);

    const loading = await this.loadingController.create({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios',
    });

    await loading.present();

    this.auth.asignar_categorias({ categorias: categorias }).subscribe(
      (res: any) => {
        loading.dismiss();
        console.log(res);
        if (res.status === true) {
          this.onesignal.init_onesignal().then(() => {
            if (this.type === 'black') {
              this.utils
                .presentToast('Las categorias fueron actualizadas', 'success')
                .then(() => {
                  this.navController.back();
                });
            } else {
              this.navController.navigateRoot(['home']);
            }
          });
        }
      },
      (error) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }
}
