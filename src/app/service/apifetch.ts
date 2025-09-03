import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Apifetch {
    count = signal(0)
    
    private myUrlSubject = new BehaviorSubject<boolean>(false);
    // private mySearchItem = new BehaviorSubject<string>("");

  myUrl$ = this.myUrlSubject.asObservable();
    AccessKey = "abc";
    SecretKey = "abc";
    private apiUrl = 'https://api.unsplash.com/photos/?';
    private apiSearchUrl = 'https://api.unsplash.com/search/photos/?';
  constructor(private http: HttpClient,private router:Router){}

  getdata(page_num:number,search:string): Observable<any> {
    const searchurl = `${this.apiSearchUrl}page=${page_num}&query=${search}&per_page=30`;
    const url = `${this.apiUrl}page=${page_num}&per_page=30`;
    const headers = new HttpHeaders({
      Authorization: `Client-ID ${this.AccessKey}`,
      Orientation:`landscape`,
      // size: `small`
    });
    if (this.count() ==0)
      {
      const data = this.http.get(url, { headers });
      return data;
    }
    else{
      const data = (this.http.get(searchurl, { headers }));
      return data;
    }
}
setMyUrl(value: boolean) {
    this.myUrlSubject.next(value);
  }
}
