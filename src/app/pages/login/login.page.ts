import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../../services/auth.service';
import { FormGroup , FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { NavController } from '@ionic/angular';

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
      private navController: NavController) { }

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

    this.auth.login (request).subscribe ((res: any) => {
      console.log (res);
      this.auth.save_local_user (res).then (() => {
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
          this.navController.navigateRoot (['home']);
        }
      });
    }, error => {
      this.utils.presentToast ('Los datos de acceso no son correcto.', 'danger');
      this.loadings.login = false;
      console.log (error);
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
}
