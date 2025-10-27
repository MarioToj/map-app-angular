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
  imports: [],
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

  mapEffect = effect(() => {
    if (!this.map()) return;

    // this.map()?.zoomTo(this.zoom());
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;
    console.log(element);

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
      center: [-74.5, 40],
      zoom: this.zoom(),
    });

    this.map.set(map);
  }
}
