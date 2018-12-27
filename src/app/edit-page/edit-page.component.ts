import { Component, OnInit , Input } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
// import { HomePage } from '../home/home.page';
import { sensor } from '../sensor';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app'

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
   this.value.timestamp = this.value.timestamp;
   console.log("timestamp",this.value.timestamp);
   
  }

save(){

this.value.location = {
  latitude:this.lat,
  longitude:this.lng
}
console.log("timestamp",this.value.timestamp);

  console.log("lng lat",this.lat,this.lng);
  this.modalController.dismiss(this.value);
  console.log("data",this.value);
}


cancel(){
  this.modalController.dismiss();
}

pinLat(value){
    this.lat = value;
    console.log("lat",value,this.lat);
    
  }
  pinLng(value){
    this.lng = value;
    console.log("lng",value,this.lng);
    
  }

}
