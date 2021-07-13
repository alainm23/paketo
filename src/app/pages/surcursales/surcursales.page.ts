import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Services
import { FormGroup , FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { ActionSheetController, IonContent, IonSlides, LoadingController, NavController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-surcursales',
  templateUrl: './surcursales.page.html',
  styleUrls: ['./surcursales.page.scss'],
})
export class SurcursalesPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slides: IonSlides;
  @ViewChild (IonContent, { static: false }) content: IonContent;
  @ViewChild ('searchbar', { read: ElementRef, static: false }) searchbar: ElementRef;
  
  @ViewChild('map', { static: false }) mapRef: ElementRef;
  geocoder: any = new google.maps.Geocoder ();
  map: any = null;
  
  form: FormGroup;
  image_file: any = null;

  departamentos: any [] = [];
  provincias: any [] = [];
  distritos: any [] = [];

  departamento: any;

  departamento_nombre: string = '';
  provincias_nombre: string = '';

  show_privincia: boolean = false;
  show_distrito: boolean = false;

  index: number = 0;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
  };

  surcursal: any;
  page: any;
  ver_mapa: boolean = false;

  constructor (private actionSheetController: ActionSheetController,
    private utils: UtilsService,
    private database: DatabaseService,
    private auth: AuthService,
    private loadingController: LoadingController,
    private navController: NavController,
    private route: ActivatedRoute) { }

  async ngOnInit () {
    this.surcursal = this.route.snapshot.paramMap.get ('surcursal');
    this.page = this.route.snapshot.paramMap.get ('page');

    console.log (this.surcursal);
    console.log (this.page);

    this.form = new FormGroup ({
      id: new FormControl ('', []),
      denominacion: new FormControl ('', [Validators.required]),
      distrito: new FormControl ('', [Validators.required]),
      direccion: new FormControl ('', [Validators.required]),
      latitud: new FormControl ('', [Validators.required]),
      longitud: new FormControl ('', [Validators.required]),
      nombres_contacto: new FormControl ('', [Validators.required]),
      telefono_contacto: new FormControl ('', [Validators.required]),
      email_contacto: new FormControl ('', [Validators.required, Validators.email]),
      foto: new FormControl ('', [Validators.required]),
      departamento: new FormControl ()
    });

    if (this.surcursal !== 'new') {
      let data: any = JSON.parse (this.surcursal);
      console.log (JSON.parse (this.surcursal));

      this.form.controls ['id'].setValue (data.id);
      this.form.controls ['denominacion'].setValue (data.denominacion);
      this.form.controls ['direccion'].setValue (data.direccion);
      this.form.controls ['nombres_contacto'].setValue (data.nombres_contacto);
      this.form.controls ['telefono_contacto'].setValue (data.telefono_contacto);
      this.form.controls ['email_contacto'].setValue (data.email_contacto);

      this.image_file = {
        webPath: data.foto,
        blob: null,
        name: new Date ().getTime ().toString ()
      };
    }

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.get_datos ('departamentos').subscribe ((res: any) => {
      loading.dismiss ();
      console.log (res);
      this.departamentos = res;
      this.init_map ();
      this.initAutocomplete ();
    }, error => {
      console.log (error);
      loading.dismiss ();
    });
  }

  ionViewDidEnter () {
    setTimeout (() => {
      this.slides.lockSwipes (true);
    }, 250);
  }

  async selectImageSource (fileInput: any) {
    if (Capacitor.isNativePlatform ()) {
      const actionSheet = await this.actionSheetController.create ({
        buttons: [{
          text: 'Tome una foto',
          icon: 'camera',
          handler: () => {
            this.takePicture (CameraSource.Camera);
          }
        }, {
          text: 'Seleccione una foto',
          icon: 'images',
          handler: () => {
            this.takePicture (CameraSource.Photos);
          }
        }]
      });
  
      await actionSheet.present ();
    } else {
      fileInput.click ();
    }
  }

  async takePicture (sourceType: CameraSource) {
    const options: ImageOptions = {
      quality: 90,
      height: 640,
      width: 480,
      preserveAspectRatio: true,
      source: sourceType,
      correctOrientation: true,
      resultType: CameraResultType.Base64
    };

    let image = await Camera.getPhoto (options);

    this.image_file = {
      webPath: 'data:image/jpeg;base64,' + image.base64String,
      blob: this.b64toBlob (image.base64String, `image/${image.format}`),
      name: new Date ().getTime ().toString ()
    };
  }

  b64toBlob (b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async submit_slide_next () {
    switch (await this.slides.getActiveIndex ()) {
      case 0:
        if (this.valid_form_controls (['denominacion']) && this.image_file !== null) {
          this.slideNext ();
        } else {
          if (this.valid_form_controls (['denominacion']) === false) {
            this.utils.presentToast ('Ingrese el nombre de la ferreteria', 'danger');
          } else if (this.image_file === null) {
            this.utils.presentToast ('Seleccione o tome una foto', 'danger');
          }
        }
        break;
      case 1:
        if (this.valid_form_controls (['latitud', 'longitud', 'distrito', 'direccion'])) {
          this.slideNext ();
          setTimeout (() => {
            this.content.scrollToTop (120);
          }, 400)
        } else {
          this.utils.presentToast ('Ingrese una ubicacion valida', 'danger');
        }
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  async submit (terminar: boolean) {
    if (this.form.controls ['nombres_contacto'].hasError ('required')) {
      this.utils.presentToast ('El nombre de contacto es requerido', 'danger');
      return;
    }

    if (this.form.controls ['telefono_contacto'].hasError ('required')) {
      this.utils.presentToast ('El telefono de contacto es requerido', 'danger');
      return;
    }

    if (this.form.controls ['email_contacto'].hasError ('required')) {
      this.utils.presentToast ('El correo electronico de contacto es requerido', 'danger');
      return;
    }

    if (this.form.controls ['email_contacto'].hasError ('email')) {
      this.utils.presentToast ('El correo electronico de contacto es invalido', 'danger');
      return;
    }

    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    console.log (this.form.value);

    const formData: FormData = new FormData ();
    formData.append ('id', this.form.value.id);
    formData.append ('denominacion', this.form.value.denominacion);
    formData.append ('id_distrito', this.form.value.distrito.id);
    formData.append ('direccion', this.form.value.direccion);
    formData.append ('latitud', this.form.value.latitud);
    formData.append ('longitud', this.form.value.longitud);
    formData.append ('nombres_contacto', this.form.value.nombres_contacto);
    formData.append ('telefono_contacto', this.form.value.telefono_contacto);
    formData.append ('email_contacto', this.form.value.email_contacto);

    console.log (this.image_file);

    if (this.image_file.blob !== null) {
      formData.append ('foto', this.image_file.blob, this.image_file.name);
    }

    formData.forEach ((value, key) => {
      console.log ('Key:', key)
      console.log ('Value:', value);
    });

    if (this.surcursal === 'new') {
      this.auth.guardar_sucursal (formData).subscribe ((res: any) => {
        this.valid_response (terminar, loading, res);
      }, error => {
        loading.dismiss ();
        console.log (error);
      });
    } else {
      this.auth.update_sucursal (formData).toPromise ().then ((res: any) => {
        this.valid_response (terminar, loading, res);
      }).catch ((error: any) =>{
        loading.dismiss ();
        console.log (error);
      });
    }
  }

  valid_response (terminar: boolean, loading: any, res: any) {
    loading.dismiss ();
    console.log (res);
    if (res.status === true) {
      if (terminar) {
        if (this.page === 'sucursales-editar') {
          this.navController.back ();
        } else {
          this.navController.navigateForward (['categorias-interes', 'home']);
        }
      } else {
        this.slides.lockSwipes (false);
        this.slides.slideTo (0);

        this.form.reset ();
        this.image_file = null;
        this.show_distrito = false;
        this.show_privincia = false;

        setTimeout (() => {
          this.slides.lockSwipes (true);
        }, 400);
      } 
    }
  }

  async getActiveIndex () {
    return await this.slides.getActiveIndex ();
  }

  ionSlideDidChange () {
    this.slides.getActiveIndex ().then ((index: number) => {
      this.index = index;
    });
  }

  slideNext () {
    this.slides.lockSwipes (false);
    this.slides.slideNext ();

    setTimeout (() => {
      this.slides.lockSwipes (true);
    }, 400);
  }

  valid_form_controls (values: string []) {
    let returned: boolean = true;

    values.forEach ((value: string) => {
      if (this.form.controls [value].invalid) {
        returned = false;
      }
    });

    return returned;
  }

  async select_change (event: any, path: string, returned: string) {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    this.database.get_datos (path + event.detail.value.id).subscribe ((res: any []) => {
      loading.dismiss ();

      this.form.controls ['distrito'].setValue ('');

      if (returned === 'provincias') {
        this.departamento_nombre = event.detail.value.nombre;
        this.show_privincia = true;
        this.provincias = res;
      } else if (returned === 'distritos') {
        this.provincias_nombre = event.detail.value.nombre;
        this.show_distrito = true;
        this.distritos = res;
      }
    }, error => {
      loading.dismiss ();
      console.log (error);
    });
  }

  init_map () {
    let point = new google.maps.LatLng (-13.531687, -71.9668459);

    const options = {
      center: point,
      zoom: 15,
      disableDefaultUI: true,
      streetViewControl: false,
      disableDoubleClickZoom: false,
      clickableIcons: false,
      scaleControl: true,
      mapTypeId: 'roadmap'
    }

    this.map = new google.maps.Map (this.mapRef.nativeElement, options);

    google.maps.event.addListener(this.map, 'idle', () => {
      this.form.controls ['latitud'].setValue (this.map.getCenter ().lat ());
      this.form.controls ['longitud'].setValue (this.map.getCenter ().lng ());
    });
  }

  async get_googlemaps_position (event: any) {
    const loading = await this.loadingController.create ({
      translucent: true,
      spinner: 'lines-small',
      mode: 'ios'
    });

    await loading.present ();

    let address: string = event.detail.value.nombre + ' ' + this.departamento_nombre + ' ' + this.provincias_nombre;

    this.geocoder.geocode ({'address': address}, (results: any, status: any) => {
      loading.dismiss ();
      if (status == google.maps.GeocoderStatus.OK) {
        this.map.panTo (results [0].geometry.location);
        this.form.controls ['latitud'].setValue (results [0].geometry.location.lat ());
        this.form.controls ['longitud'].setValue (results [0].geometry.location.lng ());
      }
    });
  }

  async changeListener (event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files [0];

      this.image_file = {
        webPath: '',
        blob: file,
        name: file.name
      };

      this.getBase64 (file);
    }
  }

  getBase64 (file: any) {
    var reader = new FileReader ();
    reader.readAsDataURL (file);
    
    reader.onload = () => {
      this.image_file.webPath = reader.result;
    };
    
    reader.onerror = (error) => {
      console.log (error);
    };
  }

  initAutocomplete () {
    const options = {
      // types: ['(regions)'],
      // componentRestrictions: {country: "us"}
    };
    
    let searchInput = this.searchbar.nativeElement.querySelector ('input');
    let autocomplete = new google.maps.places.Autocomplete (searchInput, options);

    google.maps.event.addListener (autocomplete, 'place_changed', async () => {
      let place = autocomplete.getPlace ();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      

      this.map.setZoom (17);
      this.map.panTo (place.geometry.location);
    });
  }

  ver_mapa_f () {
    this.ver_mapa = true;
  }
}
