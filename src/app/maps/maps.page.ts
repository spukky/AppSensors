import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { sensor } from '../sensor';
import { map } from 'rxjs/operators';
// import { listenToElementOutputs } from '@angular/core/src/view/element';
// import { Thumbnail } from '@ionic/angular';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})

export class MapsPage implements OnInit {
  @ViewChild('mapChild') mapElement;
  @ViewChild('mapPlace') placeElement;
  @Input() pin: sensor;
  @Input() fil: string;
  @Output() pinLat: EventEmitter<number> = new EventEmitter();
  @Output() pinLng: EventEmitter<number> = new EventEmitter();
  
  map:any;
  markers = [];
  
  
  constructor() {}
  
  ngOnInit() {
    this.createMap();
    this.createLatLngOnMap();
    this.searchPlace();
  }
  
  ngOnChanges(){
    
    if(this.fil != undefined){
      this.deletePin();
      for(let i in this.pin){
        if(this.pin[i].type === this.fil || (this.fil == undefined && this.pin != null ))
        {
          this.addMarker(this.pin[i].location.latitude,this.pin[i].location.longitude)
        }
      }
      this.mapInfo(this.map,this.pin);
    }
    else{
      this.setPinOnMaps();
    }
    
  }
  
  createMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: new google.maps.LatLng(-33.91722, 151.23064),
      zoom: 15,
    });
    this.setPinOnMaps();
   
  }
  
  setPinOnMaps(){
    this.deletePin();
    if(this.pin){
      if(Array.isArray(this.pin)){
        for(let i in this.pin){
          this.addMarker(this.pin[i].location.latitude,this.pin[i].location.longitude);
        }
      }
      else{
        this.addMarker(this.pin.location.latitude,this.pin.location.longitude);
      }
    }
    this.mapInfo(this.map,this.pin);
  }
  
  
  createLatLngOnMap(){
    this.map.addListener('click',(e) =>  {
      this.deletePin();
      this.addMarker(e.latLng.lat(),e.latLng.lng());
      this.pinLat.emit(e.latLng.lat());
      this.pinLng.emit(e.latLng.lng());
    }); 
  }
  
  searchPlace() {
    // console.log("searchPlace");
    
    let input =<HTMLInputElement> this.placeElement.nativeElement;
    // console.log("input",input);
    
    let searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // console.log("search",searchBox);
    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();
      if (places.length == 0){
        console.log("return");
        return;
      }
      let bounds = new google.maps.LatLngBounds();
      if(!places[0].geometry){
        return;
      }
      // console.log("place[0]",places[0]);
      if(places[0].geometry.viewport){
        bounds.union(places[0].geometry.viewport)
      }else{
        bounds.extend(places[0].geometry.location)
      }
      this.map.fitBounds(bounds);
    });
  }
  
  addMarker(lt,lo) {
    let marker = new google.maps.Marker(
      {
        position:{
          lat: lt,
          lng: lo
        },
        map: this.map
      });
      this.markers.push(marker);
      
    }
    


    mapInfo(map,pin){
      let j;
      if(this.pin){
        if(Array.isArray(this.pin)){
          for( let i in this.markers){
            this.markers[i].setMap(map);
            if(this.pin){
              for( j in pin){
                if((this.markers[i].position.lat() == pin[j].location.latitude) || (this.markers[i].position.lng() == pin[j].location.longitude)){
                  break;
                }
              }
              const infowindow = new google.maps.InfoWindow(       
                {
                  content: pin[j].name + "  " + pin[j].value +" " + pin[j].units,
                  maxWidth: 200
                });
                this.markers[i].addListener('click', () => {
                  infowindow.open(this.map,this.markers[i]);
                })
              }
            }
          }
          else{
            this.markers[0].setMap(map);
            const infowindow = new google.maps.InfoWindow(       
              {
                content: pin.name + "  " + pin.value +" " + pin.units,
                maxWidth: 200
              });
              this.markers[0].addListener('click', () => {
                infowindow.open(this.map,this.markers[0]);
              })
            }
          }
        }
        
        deletePin(){
          
          this.markers.forEach((marker)=>{
            marker.setMap(null);
          })
          this.markers = [];
        }
        
        
        
        
        
      }