import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import { v4 as UUIDV4 } from 'uuid';

interface Marker {
  id: string;
  marker: maplibregl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.html',
})
export class MarkersPage implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  zoom = signal(13);

  markers = signal<Marker[]>([]);

  map = signal<maplibregl.Map | null>(null);

  coordinates = signal({
    lng: -91.1403,
    lat: 15.0335,
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;

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
    map.on('click', (event) => {
      this.mapClick(event);
    });
    this.map.set(map);
  }

  mapClick(event: maplibregl.MapMouseEvent) {
    if (!this.map()) return;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const mapLibreMarker = new maplibregl.Marker({
      color,
      draggable: true,
    })
      .setLngLat(event.lngLat)
      .addTo(this.map()!);

    const newMarker: Marker = {
      id: UUIDV4(),
      marker: mapLibreMarker,
    };
    this.markers.update((prevValue) => [newMarker, ...prevValue]);
    console.log(this.markers());
  }

  flyToMark(lngLat: LngLatLike) {
    if (!this.map) return;

    this.map()?.flyTo({
      center: lngLat,
      speed: 1.2,
      curve: 1.8,
      easing: (t) => t,
      essential: true,
    });
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    marker.marker.remove();
    this.markers.update((prevValue) =>
      prevValue.filter((mark) => mark.id !== marker.id)
    );
  }
}
