import { Injectable } from '@angular/core';

// Services
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL: string = 'https://paketo.demoperu.site/api';
  USER_ACCESS: any = {
    access_token: '',
    expires_at: ''
  };
  USER_DATA: any = {};

  constructor (private http: HttpClient, private storage: Storage) {

  }

  login (request: any) {
    const URL: string = this.BASE_URL + '/auth/login';
    return this.http.post (URL, request);
  }

  change_password (request: any) {
    const URL: string = this.BASE_URL + '/auth/change/password';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  save_confirm_data (request: any) {
    const URL: string = this.BASE_URL + '/user/guardar/datos/confirmados';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  async save_local_user (request: any) {
    this.USER_ACCESS = {
      access_token: request.access_token,
      expires_at: request.expires_at
    };

    this.USER_DATA = request.user;

    await this.storage.set ('PAKETO_USER_ACCESS', JSON.stringify (this.USER_ACCESS));
    return await this.storage.set ('PAKETO_USER_DATA', JSON.stringify (this.USER_DATA));
  }

  get_user_data () {
    return this.storage.get ('USER_DATA');
  }

  get_fields (fields: string []) {
    const URL: string = this.BASE_URL + '/user/get/specifics/fields';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, {fields: fields}, { headers });
  }

  get_surcursales () {
    const URL: string = this.BASE_URL + '/user/sucursales';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  guardar_sucursal (request: any) {
    const URL: string = this.BASE_URL + '/user/guardar/sucursal';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  asignar_categorias (request: any) {
    const URL: string = this.BASE_URL + '/user/categorias/preferencia';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  logout () {
    const URL: string = this.BASE_URL + '/auth/logout';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  registro (request: any) {
    const URL: string = this.BASE_URL + '/auth/registro';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  update_user_data () {
    const request: any = {
      fields: ['categorias', 'datos_confirmados', 'password_updated_user', 'sucursales', 'confianza']
    };

    const URL: string = this.BASE_URL + '/user/get/specifics/fields';

    const headers = {
      'Authorization': 'Bearer ' + this.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }
}
