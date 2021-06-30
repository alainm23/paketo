import { Component, OnInit, ViewChild } from '@angular/core';

// Services
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild (IonSlides, { static: false }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
  };

  constructor (private navController: NavController) { }

  ngOnInit() {
  }
  

  view_login () {
    this.navController.navigateRoot (['login']);
  }

  async slide_next () {
    if (await this.slides.getActiveIndex () >= 2) {
      this.view_login ();
      return;
    }

    this.slides.slideNext ();
  }
}
