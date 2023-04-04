import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from './api.service';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const service = inject(ApiService);
  return service.isLoggedIn().pipe(
    map((isLoggedIn) =>
      isLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
    )
  );
};
