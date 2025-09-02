import { Component, Injectable } from '@angular/core';
import { Apifetch } from '../service/apifetch';
import { BehaviorSubject, Subject, Subscription, switchMap } from 'rxjs';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root' 
})
@Component({
  selector: 'app-gallery',
  imports: [CommonModule,FormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery {
  private rawData: any;
  private fetchTrigger$ = new Subject<number>();
  imageData:any;
  searchTerm: string = "";
  filteredData: any[] = [];
  page_num:number =1;
  
  constructor(private apifetch:Apifetch,private router:Router,private platformLocation: PlatformLocation){
  this.apifetch.setMyUrl(true)
  }
  ngOnInit(): void {
    this.platformLocation.onPopState(() => 
    {  this.router.navigate(['']);
      this.apifetch.setMyUrl(false);}
  
  );
    this.fetchTrigger$
      .pipe(
        switchMap(() => this.apifetch.getdata(this.page_num))
      )
      .subscribe({
        next: (data) => {
          this.rawData = data;
          this.getImageData()
        },
        error: (err) => {
          console.error('Error fetching images:', err);
        }
      });


    this.fetchTrigger$.next(this.page_num);
  }

  incrementPage(){
    this.page_num +=1;
    this.fetchTrigger$.next(this.page_num);
  }
  decrementPage(){
    if(this.page_num >1){

      this.page_num -=1;
      this.fetchTrigger$.next(this.page_num);
    }
  }

  getImageData() {
    
  this.imageData = this.rawData.map((item: any) => ({
    url: item.urls.regular,
    name: item.alt_description || 'Elon Musk'
  }));
   this.filteredData = this.imageData;
}


onSearch() {
  if (!this.searchTerm) {
    this.filteredData = this.imageData; 
  } else {
    this.filteredData = this.imageData.filter((item: { url: string; name: string }) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
gohome(){
 this.apifetch.setMyUrl(false)
  this.router.navigate([''])
}

}