import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  private api = inject(ApiService);

  isUsernameTaken(username: string): Observable<boolean> {
    const endpoint = 'username-available?username=' + username;
    return this.api.get(endpoint).pipe(map((res: any) => !res.free));
  }
}
