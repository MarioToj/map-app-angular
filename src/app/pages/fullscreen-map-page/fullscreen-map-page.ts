import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.html',
  styles: `{
   div {
     width: 100vh;
    height: calc(100vh - 64px);
   }
  }`,
})
export class FullscreenMapPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;
    console.log(element);

    const map = new maplibregl.Map({
      container: element, // container id
      style: 'https://demotiles.maplibre.org/globe.json', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }
}
