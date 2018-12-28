import { Component, OnInit } from '@angular/core';
import { sensor } from '../sensor';
import { ModalController ,AlertController} from '@ionic/angular';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {
  timeNow = firebase.firestore.FieldValue.serverTimestamp();
  s:sensor = {
    type: null,
    name:null,
    value: null,
    timestamp: null,
    location:null
  };
  currentColor :string = "#3E49BB" ;
  lat:number;
  lng:number;
  message:string;
  constructor(public modalController: ModalController,public alertController: AlertController) { }
  
  ngOnInit() {
    
  }
  
  save(){
    if((this.s.type == null )){
      this.message = "type of sensor";
      this.alertInput();
    }
    else if(this.s.name == null){
      this.message = "name of sensor";
      this.alertInput();
    }
    else if(this.s.value == null){
      this.message = "value of sensor";
      this.alertInput();
    }
    else if(this.lat == null || this.lng == null){
      this.message = "location of sensor";
      this.alertInput();
    }
    else if(this.s.timestamp == null){
      this.s.timestamp = new Date();
      this.s.timestamp = firebase.firestore.Timestamp.fromDate(this.s.timestamp);
      this.modalController.dismiss(this.s);
    }
    else{
      this.s.location = new firebase.firestore.GeoPoint(this.lat,this.lng);   
      this.s.timestamp = firebase.firestore.Timestamp.fromDate(new Date(this.s.timestamp) ); 
      this.modalController.dismiss(this.s);
    }
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
  
  async alertInput() {
    const alert = await this.alertController.create({
      header: 'Information do not complete !!!',
      message: "Please complete the " + " " + this.message ,
      buttons: ['OK']
    });
    await alert.present();
  }
  
}
