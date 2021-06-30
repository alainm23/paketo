import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

// Services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-data-intro',
  templateUrl: './confirm-data-intro.page.html',
  styleUrls: ['./confirm-data-intro.page.scss'],
})
export class ConfirmDataIntroPage implements OnInit {
  user: any;
  constructor (private auth: AuthService, private navController: NavController) { }
  
  async ngOnInit () {
    this.user = JSON.parse (await this.auth.get_user_data ());
  }

  view_confirmar_datos () {
    this.navController.navigateForward (['confirm-data']);
  }
} 
