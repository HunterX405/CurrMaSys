import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export const authGuard = (next: ActivatedRouteSnapshot) => {
    const service = inject(ApiService);

    return service.getUserDetails().pipe(
        map((user) => {
            const userTypeValue = user['userType'];
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
