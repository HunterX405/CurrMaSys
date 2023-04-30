import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { of } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const service = inject(ApiService);
  return service.isLoggedIn().pipe(
    switchMap((isLoggedIn) => {
      if (!isLoggedIn) {
        return of(createUrlTreeFromSnapshot(next, ['/', 'login']));
      } else {
        return service.getUserDetails().pipe(
           map((user) => {
              console.log(user);
             const userTypeValue = user['userType'];
             console.log('type',userTypeValue);
            const expectedUserType = next.data['userType'];
            if (expectedUserType.includes(userTypeValue)) {
              console.log('Authorization Granted');
              return true;
            } else {
              console.log('Authorization Denied');
              return createUrlTreeFromSnapshot(next, ['/', 'unauthorized']);
            }
          })
        );
      }
    })
  );
};
