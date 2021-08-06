import { Component, OnInit, Input } from '@angular/core';

// Services
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormGroup , FormControl, Validators, ValidationErrors } from '@angular/forms';
import { AuthService }from '../../services/auth.service';
import { ConstantPool, ThrowStmt } from '@angular/compiler';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-sent-data',
  templateUrl: './update-sent-data.page.html',
  styleUrls: ['./update-sent-data.page.scss'],
})
export class UpdateSentDataPage implements OnInit {
  @Input () ruc: string;
  @Input () razon_social: string;
  @Input () telefono: string;
  @Input () persona_contacto: string;
  @Input () nuevo_usuario: boolean = false;

  form: FormGroup;
  loading: boolean = false;
  errors: any [] = [];
  form_values_description: Map <string, string> =  new Map <string, string> ();
  form_erros_description: Map <string, string> =  new Map <string, string> ();

  constructor ( private modalController: ModalController,
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private utils: UtilsService) { }

  ngOnInit () {
    console.log (this.nuevo_usuario);

    this.form = new FormGroup ({
      razon_social: new FormControl (this.razon_social, [Validators.required]),
      ruc: new FormControl (this.ruc, [Validators.required, Validators.maxLength (11), Validators.minLength (11), Validators.pattern (/^-?(0|[1-9]\d*)?$/)]),
      telefono: new FormControl (this.telefono, [Validators.required]),
      persona_contacto: new FormControl (this.persona_contacto, [Validators.required]),
      email: new FormControl ('', [Validators.email])
    });

    if (this.nuevo_usuario) {
      this.form.controls ['email'].setValidators ([Validators.email, Validators.required]);
    }

    this.form_values_description.set ('razon_social', 'Razón social');
    this.form_values_description.set ('ruc', 'RUC');
    this.form_values_description.set ('telefono', 'Telefono');
    this.form_values_description.set ('persona_contacto', 'Persona de contacto');

    if (this.nuevo_usuario) {
      this.form_values_description.set ('email', 'El formato de correo electrónico en incorrecto');
      this.form_erros_description.set ('email', 'correo invalido');
    }
    
    this.form_erros_description.set ('minlength', 'RUC debe tener 11 digitos');
    this.form_erros_description.set ('maxlength', 'RUC debe tener 11 digitos');
    this.form_erros_description.set ('pattern', 'RUC debe tener solo numeros');
    this.form_erros_description.set ('required', 'requerido');
  }

  submit () {
    this.errors = [];

    if (this.form.invalid) {
      this.show_form_errors (this.form);
      return;
    }

    if (this.nuevo_usuario) {
      this.registrar (this.form.value);
    } else {
      this.modalController.dismiss (this.form.value, 'update');
    }
  }

  async registrar (data: any) {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    const request: any = {
      "name": data.razon_social,
      "email": data.email,
      "razon_social": data.razon_social,
      "ruc": data.ruc,
      "telefono": data.telefono,
      "persona_contacto": data.persona_contacto
    };

    this.auth.registro (request).subscribe ((res: any) => {
      loading.dismiss ();
      console.log (res);

      if (res.status == true) {
        this.modalController.dismiss (this.form.value, 'ok');
      } else {
        this.show_api_error (res, ['email']);
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
      this.show_api_error (error.error, ['email', 'name', 'razon_social', 'ruc', 'telefono', 'persona_contacto']);
    });
  }

  show_api_error (res: any, values: string []) {
    values.forEach ((value: string) => {
      if (res.errors [value]) {
        res.errors [value].forEach ((error: string) => {
          this.utils.presentToast (error, 'danger');
        });
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
}
