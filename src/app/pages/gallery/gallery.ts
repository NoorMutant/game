import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Apifetch } from '../../service/apifetch';
import { BehaviorSubject, Subject, Subscription, switchMap } from 'rxjs';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-gallery',
  imports: [CommonModule, FormsModule,],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit, OnDestroy {
  private rawData: any;
  private fetchTrigger$ = new Subject<number>();
  apiError: boolean = false;
  imageData: any;
  searchTerm: string = "";
  filteredData: any[] = [];
  page_num: number = 1;
  search: string = "cats"
  constructor(private apifetch: Apifetch, private router: Router, private platformLocation: PlatformLocation) {
    this.apifetch.setMyUrl(true)
    this.apifetch.count.set(0)
  }
  ngOnInit(): void {
    debugger;
    this.platformLocation.onPopState(() => {
      this.router.navigate(['']);
      this.apifetch.setMyUrl(false);
    }
  );

    this.fetchTrigger$
      .pipe(
        switchMap(() => this.apifetch.getdata(this.page_num, this.search))
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          this.rawData = data;
          this.getImageData()
        },
        error: (err) => {
          this.apiError = true;
          console.error('Error fetching images:', err);
        }
      });
    this.fetchTrigger$.next(this.page_num);
  }

  incrementPage() {
    this.page_num += 1;
    this.fetchTrigger$.next(this.page_num);
  }
  decrementPage() {
    if (this.page_num > 1) {
      this.page_num -= 1;
      this.fetchTrigger$.next(this.page_num);
    }
  }

  getImageData() {
    if (this.apifetch.count() == 1) {
      this.rawData = this.rawData.results;
      const searchArray = this.search.split(" ");
      this.imageData = this.rawData
        .filter((item: any) =>
          item.alt_description?.toLowerCase().includes(this.search.toLowerCase()) || 
          searchArray.every(word => item.alt_description.includes(word))
        )
        .map((item: any) => ({
          url: item.urls.regular,
          name: item.alt_description || 'Elon Musk'
        }));
    }
    else{
      this.imageData = this.rawData.map((item: any) => ({
        url: item.urls.regular,
        name: item.alt_description || 'Elon Musk'
      }));

    }
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
  searchCollection(searchTerm: string) {
    this.search = searchTerm;
    this.apifetch.count.set(1)
    this.page_num = 1;
    this.filteredData=[];
    this.fetchTrigger$.next(this.page_num);
  }
  gohome() {
    this.apifetch.setMyUrl(false)
    this.router.navigate([''])
  }
  ngOnDestroy(): void {
    this.fetchTrigger$.unsubscribe();
  }
}