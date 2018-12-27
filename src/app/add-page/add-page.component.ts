import { Component, OnInit } from '@angular/core';
import { sensor } from '../sensor';
import { ModalController } from '@ionic/angular';
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
  lat:number;
  lng:number;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    // console.log("timestamp",this.s.timestamp);
    // this.s.timestamp = new Date().toLocaleDateString(this.s.timestamp);
    // console.log("timestamp",this.s.timestamp);
    this.s.timestamp = new Date();

    console.log("timestamp",this.s.timestamp);
    this.s.timestamp = firebase.firestore.Timestamp.fromDate(this.s.timestamp);
    console.log("timestamp",this.s.timestamp);
    
    
    
  }

  save(){
    console.log("timestamp",this.s.timestamp);
    
    this.s.timestamp = firebase.firestore.Timestamp.fromDate(new Date(this.s.timestamp) );
    
    console.log("time",this.s.timestamp);
    console.log("this lat",this.lat);
    
    console.log("data",this.s);
    this.s.location = new firebase.firestore.GeoPoint(this.lat,this.lng);    
    this.modalController.dismiss(this.s);
    // this.modalController.dismiss();
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
