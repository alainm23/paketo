import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../../services/auth.service';
import { FormGroup , FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { OnesignalService } from 'src/app/services/onesignal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;

  loadings: any = {
    login: false
  };

  errors: any [] = [];
  form_values_description: Map <string, string> =  new Map <string, string> ();
  form_erros_description: Map <string, string> =  new Map <string, string> ();

  type_password: string = 'password';

  constructor (private auth: AuthService, private utils: UtilsService,
      private navController: NavController,
      private alertController: AlertController,
      private loadingController: LoadingController,
      private onesignal: OnesignalService) { }

  ngOnInit () {
    this.form = new FormGroup ({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required])
    });

    this.form_values_description.set ('email', 'Correo electronico');
    this.form_values_description.set ('password', 'Contraseña');

    this.form_erros_description.set ('required', 'requerido');
    this.form_erros_description.set ('email', 'correo electronico invalido');
  }

  submit () {
    this.errors = [];

    if (this.form.invalid) {
      this.show_form_errors (this.form);
      return;
    }

    let request: any = {
      email: this.get_valid_string (this.form.value.email),
      password: this.form.value.password,
    };

    console.log (request);

    this.loadings.login = true;

    this.auth.login (request).subscribe (async (res: any) => {
      console.log (res);
      this.auth.save_local_user (res).then ((_) => {
        console.log (_);
        
        this.auth.update_user_data ().then ((response: any) => {
          console.log (response);
          this.loadings.login = false;
          
          if (res.user.password_updated_user <= 0) {
            this.navController.navigateForward ('create-password');
          } else if (res.user.datos_confirmados <= 0) {
            this.navController.navigateForward ('confirm-data-intro');
          } else if (res.user.sucursales <= 0) {
            this.navController.navigateForward ('surcursales');
          } else if (res.categorias <= 0) {
            this.navController.navigateForward ('categorias-interes');
          } else {
            this.onesignal.init_onesignal ();
            this.navController.navigateRoot (['home']);
          }
        });
      });
    }, error => {
      console.log (error);
      this.loadings.login = false;
      this.utils.presentToast ('Los datos de acceso no corresponden a ningún usuario', 'danger');
    });
  }

  password_toggled () {
    if (this.type_password === 'password') {
      this.type_password = 'text';
    } else {
      this.type_password = 'password';
    }
  }

  get_valid_string (value: string) {
    return value.trim ().toLowerCase ();
  }

  show_form_errors (form: FormGroup) {
    Object.keys(form.controls).forEach ((key: any) => {
      const controlErrors: ValidationErrors = form.get (key).errors;
      if (controlErrors != null) {
        Object.keys (controlErrors).forEach (keyError => {
          this.errors.push (
            this.form_values_description.get (key) + ' (' + this.form_erros_description.get (keyError) + ')'
          );
        });
      }
    });
  }

  go_page (page: string) {
    this.navController.navigateForward (page);
  }

  async emial_alert () {
    const alert = await this.alertController.create ({
      header: 'Recuperar contraseña',
      mode: 'ios',
      message: 'Ingrese el correo electrónico con el que te registraste en la plataforma',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Confirmar',
          handler: (data: any) => {
            this.form.controls ['email'].setValue (data.email);
            if (this.form.controls ['email'].valid) {
              this.form.reset ();
              this.validar_olvido_correo (data.email);
            } else {
              this.form.reset ();
              this.alert_message ('¡Upps!' ,'Ingrese un correo valido');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async validar_olvido_correo (email: string) {
    const loading = await this.loadingController.create({
      message: 'Verificando...',
    });

    await loading.present ();

    this.auth.recuperar_password (email).subscribe ((res: any) => {
      console.log (res);
      loading.dismiss ();
      this.alert_message ('Mensaje enviado', 'Acabamos de enviarle un email a <b>' + email +'</b> con los pasos necesarios para que restablezcas tu contraseña. (Revisa también tu bandeja de no deseado)');
    }, error => {
      loading.dismiss ();
      console.log (error);
      this.alert_message ('Usuario no encontrado', 'Lo sentimos el correo ingresado no esta registrado en el sistema.');
    })
  }

  async alert_message (header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      mode: 'ios',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }
}
