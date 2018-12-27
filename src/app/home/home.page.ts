import { Component } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { EditPage } from '../edit-page/edit-page.component';
import { AddPageComponent } from '../add-page/add-page.component';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { sensor } from '../sensor';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  {
  map:any;
  filter :string ="";
  sensorDB:sensor[];
  lat:number;
  lng:number;
  sensorColloction : AngularFirestoreCollection<sensor> ;
  dataSensor : Observable<sensor[]>
  // ngOnInit() {
  // }

  ngChanges(){

  }
  constructor(public modalController: ModalController ,public alertController: AlertController ,public actionSheetController: ActionSheetController,private db: AngularFirestore ) {
    this.sensorColloction = db.collection<sensor>("sensor");
    this.dataSensor = this.sensorColloction.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }));
      this.dataSensor.subscribe(res => {
        this.sensorDB = res;
      });
    }


    
    unitSensor(s:sensor){
      if(s.type === "level"){
        s.units = "m";
      }
      if(s.type === "temp"){
        s.units = "\xB0C";
      }
      if(s.type === "humidity"){
        s.units = "%RH";
      }
    }
    
    deleteSensor(index){
      this.sensorColloction.doc(index).delete();
    }
    
    async presentActionSheet(index) {
      
      const actionSheet = await this.actionSheetController.create({
        header: 'Do you edit or delete sensor?',
        buttons: [{
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            actionSheet.dismiss({id:this.sensorDB[index],action: "del"});
            // console.log("data",this.sensorDB[index]);
          }
        }, {
          text: 'Edit',
          icon: 'cog',
          handler: () => {
            // console.log('Share clicked');
            // console.log("index",index);
            actionSheet.dismiss({id:index,action: "edit"});
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
            actionSheet.dismiss({id:index,action: "cancel"});
          }
        }]
      });
      actionSheet.present();
      actionSheet.onDidDismiss().then((data)=>{
        // console.log("data.data",data.data);
        if(data.data != null){
          if( data.data.action == "del"){
            this.presentAlertConfirm(data.data.id.id);
            // console.log("action del",data.data.id.id);
            
          }
          else if(data.data.action == "edit"){
            this.editSensorModal(data.data.id)
            // console.log( "edit");
          }
          else if(data.data.action == "cancel"){
          }
        }
        
      });
    }
    
    async presentAlertConfirm(index) {
      
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Do you want to delete',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah',blah);
            }
          }, {
            text: 'Okay',
            handler: () => {
              alert.dismiss({id:index,action:"ok"});
            }
          }
        ]
      });
      alert.present();
      
      alert.onDidDismiss().then((data)=>{ 
        // console.log("data",data);
        if(data.data.action == "ok"){
          // console.log("id",data.data.id);
          this.deleteSensor(data.data.id);
          
          
        }
      });
    }
    
    async editSensorModal(index) {
      console.log("index",index);
      console.log("index new",this.sensorDB[index].id);
      
      const modal = await this.modalController.create({
        component: EditPage,
        componentProps: { value: this.sensorDB[index] }
      });
      console.log("this sensor",this.sensorDB[index]);
      
      modal.onDidDismiss().then((data) =>{
        if(data.data != null){
          console.log("data",data);
          this.sensorDB[index].location = new firebase.firestore.GeoPoint(this.sensorDB[index].location.latitude,this.sensorDB[index].location.longitude);
          let date  = new Date(this.sensorDB[index].timestamp.seconds);
          console.log("date",date);
          
          let timestamp = firebase.firestore.Timestamp.fromDate(date);
          console.log("timestamp",timestamp);
          
          this.sensorColloction.doc(this.sensorDB[index].id).update(
            {
              location:this.sensorDB[index].location,
              type: this.sensorDB[index].type,
              name: this.sensorDB[index].name,
              value: this.sensorDB[index].value,
              timestamp: timestamp,
              pic: this.sensorDB[index].pic
            })
          }});
          return await modal.present();
        }
        
        async addSensorModal() {
          const modal = await this.modalController.create({
            component: AddPageComponent,
            componentProps: { value:""}
          });
          modal.onDidDismiss().then((data) =>{
            if(data.data != null){
              console.log("data",data.data);
              this.unitSensor(data.data);
              this.sensorColloction.add(data.data);
            }
          });
          return await modal.present();
        }

        // goHome(){
        //   this.filter = ""
        // }

        pinLat(value){
          this.lat = value;
          console.log("lat",value,this.lat);
          
        }
        pinLng(value){
          this.lng = value;
          console.log("lng",value,this.lng);
          
        }
      }
      