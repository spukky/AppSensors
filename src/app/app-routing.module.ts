import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home/home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage
  }
  // {
  //   path: 'home',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
  // {
  //   path: 'list',
  //   loadChildren: './list/list.module#ListPageModule'
  // },
  // { path: 'maps', loadChildren: './maps/maps.module#MapsPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
