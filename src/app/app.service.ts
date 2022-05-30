import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _events: BehaviorSubject<any> = new BehaviorSubject('');

  public readonly events: Observable<any> = this._events.asObservable();
  constructor(private http: HttpClient) { }

  newEvent(data) {
    this._events.next(data);
  }

  httpRequest(url) {
    return new Promise<void>((resolve, reject) => {
      this.http.get(url).subscribe({
        next: (res: any) => resolve(res),
        error: (err: any) => reject(err),
        complete: () => {
          console.log('complete');
        },
      });
    });
  }

}
