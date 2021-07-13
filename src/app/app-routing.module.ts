import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'create-password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/create-password/create-password.module').then( m => m.CreatePasswordPageModule)
  },
  {
    path: 'create-password-message',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/create-password-message/create-password-message.module').then( m => m.CreatePasswordMessagePageModule)
  },
  {
    path: 'confirm-data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/confirm-data/confirm-data.module').then( m => m.ConfirmDataPageModule)
  },
  {
    path: 'confirm-data-intro',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/confirm-data-intro/confirm-data-intro.module').then( m => m.ConfirmDataIntroPageModule)
  },
  {
    path: 'surcursales/:surcursal/:page',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/surcursales/surcursales.module').then( m => m.SurcursalesPageModule)
  },
  {
    path: 'categorias-interes/:type',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/categorias-interes/categorias-interes.module').then( m => m.CategoriasInteresPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'update-sent-data',
    loadChildren: () => import('./modals/update-sent-data/update-sent-data.module').then( m => m.UpdateSentDataPageModule)
  },
  {
    path: 'categoria-productos/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/categoria-productos/categoria-productos.module').then( m => m.CategoriaProductosPageModule)
  },
  {
    path: 'producto-detalle/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/producto-detalle/producto-detalle.module').then( m => m.ProductoDetallePageModule)
  },
  {
    path: 'favorites',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'carrito',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'gracias-pedido/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/gracias-pedido/gracias-pedido.module').then( m => m.GraciasPedidoPageModule)
  },
  {
    path: 'historial',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'onboarding-no-usuario',
    loadChildren: () => import('./pages/onboarding-no-usuario/onboarding-no-usuario.module').then( m => m.OnboardingNoUsuarioPageModule)
  },
  {
    path: 'pedido-detalle/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pedido-detalle/pedido-detalle.module').then( m => m.PedidoDetallePageModule)
  },
  {
    path: 'sobre-paketo',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sobre-paketo/sobre-paketo.module').then( m => m.SobrePaketoPageModule)
  },
  {
    path: 'ajustes-perfil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/ajustes-perfil/ajustes-perfil.module').then( m => m.AjustesPerfilPageModule)
  },
  {
    path: 'sucursales-editar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sucursales-editar/sucursales-editar.module').then( m => m.SucursalesEditarPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
