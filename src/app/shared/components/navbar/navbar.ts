import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  router = inject(Router);
  // mostrar las rutas en el navbar de opciones
  routesFromAppRoutes = routes
    .map((route) => ({
      path: route.path,
      title: route.title,
    }))
    .filter((route) => route.path !== '**');
  // mostrar el titulo de las rutas
  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.url),
    map(
      (url) =>
        this.routesFromAppRoutes.find((route) => `/${route.path}` === url)
          ?.title ?? 'Mapas'
    )
  );

  // pageTitle$ = this.router.events.pipe(
  //   filter((event) => event instanceof NavigationEnd),
  //   map((event) => event.url),
  //   // tap((url) =>
  //   //   console.log({
  //   //     urlFromOb$: url,
  //   //     urlFromAppRoutes: this.routesFromAppRoutes,
  //   //   })
  //   // ),
  //   map(
  //     (url) =>
  //       this.routesFromAppRoutes.find((route) => `/${route.path}` === url)
  //         ?.title ?? 'Mapas'
  //   )
  //   // tap((event) => console.log(event.url))
  // );
}
