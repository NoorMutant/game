import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Apifetch {
    private myUrlSubject = new BehaviorSubject<boolean>(false);

  myUrl$ = this.myUrlSubject.asObservable();
  AccessKey = "abc";
  SecretKey = "abc";
    private apiUrl = 'https://api.unsplash.com/photos/?';
  constructor(private http: HttpClient,private router:Router){}

  getdata(page_num:number): Observable<any> {
    const url = `${this.apiUrl}page=${page_num}&per_page=30`;
    const headers = new HttpHeaders({
      Authorization: `Client-ID ${this.AccessKey}`,
      Orientation:`landscape`,
      // size: `small`
    });

    return this.http.get(url, { headers });

}
setMyUrl(value: boolean) {
    this.myUrlSubject.next(value);
  }
}
