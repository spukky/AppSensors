import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EditPage } from './edit-page.component';
import { MapsPageModule } from '../maps/maps.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditPage
      }
    ])
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
