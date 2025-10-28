import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.html',
})
export class MiniMap implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  lngLat = input.required<{ lng: number; lat: number }>();

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;
    const { lng, lat } = this.lngLat();

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
      zoom: 14,
      interactive: false,
    });

    new maplibregl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map);
    // this.mapListeners(map);
  }
}
