import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../../services/auth.service';

// Forms
import { FormGroup , FormControl, Validators, ValidationErrors } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
})
export class CreatePasswordPage implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  user: any;

  errors: any [] = [];
  form_values_description: Map <string, string> =  new Map <string, string> ();
  form_erros_description: Map <string, string> =  new Map <string, string> ();

  passwords: any = {
    before: 'password',
    password: 'password',
    confirm: 'password'
  };

  constructor (private auth: AuthService, private navController: NavController,
    private utils: UtilsService) { }

  async ngOnInit() {
    const password = new FormControl ('', [Validators.required, Validators.minLength (6)]);
    const confirm_password = new FormControl ('', [Validators.required, CustomValidators.equalTo (password), , Validators.minLength (6)]);
    
    this.form = new FormGroup ({
      before_password: new FormControl ('', [Validators.required]),
      password: password,
      confirm_password: confirm_password
    });
    
    this.form_values_description.set ('before_password', 'Contraseña anterior');
    this.form_values_description.set ('password', 'Contraseña nueva');
    this.form_values_description.set ('confirm_password', 'Confirmar contraseña');

    this.form_erros_description.set ('required', 'requerido');
    this.form_erros_description.set ('minlength', 'minimo 8 caracteres');
    this.form_erros_description.set ('equalTo', 'confirmar contraseña no coincide');

    this.user = JSON.parse (await this.auth.get_user_data ());
  }

  submit () {
    this.errors = [];

    if (this.form.invalid) {
      this.show_form_errors (this.form);
      return;
    }

    let request: any = {
      old_password: this.form.value.before_password,
      new_password: this.form.value.password,
      confirm_password: this.form.value.confirm_password,
    };

    console.log (request);
    this.loading = true;

    this.auth.change_password (request).subscribe ((res: any) => {
      console.log (res);
      if (res.status === true) {
        this.navController.navigateForward (['create-password-message']).then (() => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }, error => {
      console.log (error);
      this.loading = false;

      if (error.error.message !== undefined) {
        this.utils.presentToast (error.error.message, 'danger');
      }
    });
  }

  show_form_errors (form: FormGroup) {
    Object.keys(form.controls).forEach ((key: any) => {
      const controlErrors: ValidationErrors = form.get (key).errors;
      if (controlErrors != null) {
        Object.keys (controlErrors).forEach (keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          this.errors.push (
            this.form_values_description.get (key) + ' (' + this.form_erros_description.get (keyError) + ')'
          );
        });
      }
    });
  }

  change_visible (passwords: any, value: string) {
    if (passwords [value] === 'password') {
      passwords [value] = 'text';
    } else {
      passwords [value] = 'password';
    }
  }
}
