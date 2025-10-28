import { DecimalPipe, JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.html',
  styles: [
    `
      .map-container {
        width: 100vw;
        height: calc(100vh - 64px);
      }

      #controls {
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        width: 240px;
      }
    `,
  ],
})
export class FullscreenMapPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  zoom = signal(14);

  map = signal<maplibregl.Map | null>(null);

  coordinates = signal({
    lng: -74.5,
    lat: 40,
  });

  mapEffect = effect(() => {
    if (!this.map()) return;

    // this.map()?.zoomTo(this.zoom());
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;
    console.log(element);

    const { lat, lng } = this.coordinates();

    const map = new maplibregl.Map({
      container: element,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [lng, lat],
      zoom: this.zoom(),
    });

    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {
    map.on('zoomend', (zoom) => {
      const newZoom = zoom.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', (event) => {
      const center = event.target.getCenter();
      this.coordinates.set(center);
    });

    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.ScaleControl());

    this.map.set(map);
  }
}
