import { Injectable } from '@angular/core';

// Services
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  BASE_URL: string = 'https://paketo.demoperu.site/api';
  
  constructor (private http: HttpClient, private storage: Storage,
    private auth: AuthService) {

  }
  
  get_datos (dato: string) {
    const URL: string = this.BASE_URL + '/datos/' + dato;

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  get_ultimas_ofertas () {
    const URL: string = this.BASE_URL + '/productos/ultimas/ofertas';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  get_categorias_preferentes () {
    const URL: string = this.BASE_URL + '/productos/categorias/preferentes';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  get_productos_categoria (request: any) {
    const URL: string = this.BASE_URL + '/productos/por/categoria';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  set_favorito (request: any) {
    const URL: string = this.BASE_URL + '/productos/agregar/quitar/favorito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  get_favorites () {
    const URL: string = this.BASE_URL + '/productos/favoritos';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  get_favorites_categorias (id_categoria: string, page: any) {
    const URL: string = this.BASE_URL + '/productos/favoritos/from/categoria';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, {page: page, id_categoria: id_categoria}, { headers });
  }

  add_carrito (id_variante: string) {
    const URL: string = this.BASE_URL + '/productos/agregar/carrito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, {id_variante: id_variante}, { headers });
  }

  get_carrito () {
    const URL: string = this.BASE_URL + '/productos/carrito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  quitar_carrito (id_variante: string) {
    const URL: string = this.BASE_URL + '/productos/quitar/carrito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, {id_variante: id_variante}, { headers });
  }

  sumar_restar_carrito (request: any) {
    const URL: string = this.BASE_URL + '/productos/sumar/restar/carrito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  crear_pedido (request: any) {
    const URL: string = this.BASE_URL + '/pedidos/crear';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, request, { headers });
  }

  vaciar_carrito () {
    const URL: string = this.BASE_URL + '/productos/vaciar/carrito';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers });
  }

  get_pedidos (request: any) {
    const URL: string = this.BASE_URL + '/pedidos/lista';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.get (URL, { headers: headers, params: request });
  }

  get_pedido (id: string) {
    const URL: string = this.BASE_URL + '/pedidos/pedido/especifico';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, { id_pedido: id }, { headers });
  }

  volver_pedi (id: string) {
    const URL: string = this.BASE_URL + '/pedidos/volver/a/pedir';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, { id_pedido: id }, { headers });
  }

  buscar_producto (busqueda: string) {
    const URL: string = this.BASE_URL + '/productos/buscador';

    const headers = {
      'Authorization': 'Bearer ' + this.auth.USER_ACCESS.access_token
    }

    return this.http.post (URL, { busqueda: busqueda }, { headers });
  }
}
