import { Component, OnInit , Input } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
import { sensor } from '../sensor';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPage implements OnInit {
  @Input() value:sensor;
  lat:number;
  lng:number;
  sensorColloction : AngularFirestoreCollection<sensor> ;
  constructor(public modalController: ModalController,private navParams: NavParams,private db: AngularFirestore) {
    
    
    
  }
  
  ngOnInit() {
    this.lng = this.value.location.longitude
    this.lat = this.value.location.latitude;
    this.value.timestamp = new Date(this.value.timestamp.seconds*1000);
  }
  
  save(){
    this.value.timestamp = this.value.timestamp;
    this.value.location = {
      latitude:this.lat,
      longitude:this.lng
    }
    this.modalController.dismiss(this.value);
  }
  
  
  cancel(){
    this.modalController.dismiss();
  }
  
  pinLat(value){
    this.lat = value;
  }
  pinLng(value){
    this.lng = value;
  }
  
}
