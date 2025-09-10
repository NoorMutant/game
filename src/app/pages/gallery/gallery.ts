import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Apifetch } from '../../service/apifetch';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { CommonModule, PlatformLocation } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-gallery',
  imports: [CommonModule, FormsModule,ReactiveFormsModule,YouTubePlayerModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery implements OnInit, OnDestroy {
  private rawData: any;
  private fetchTrigger$ = new Subject<number>();
  private searchSubject = new Subject<string>();
  apiError: boolean = false;
  imageData: any;
  searchTerm: string = "";
  filteredData: any[] = [];
  totalPages:number=1000;
  page_num: number = 1;
  search: string = "cats"
youtubeUrl:string= ""
videoUrl:boolean = false; //true if correct
videoError = false;
uploadedFile:File| null =null;
isSubmitted = false;
isFileSelected:boolean = false;
  youtubeApi:string = "AIzaSyAO2n7i7KHnWMBhoigkhLJk2ZgQHE3kWMQ"
  isToggled: boolean = false;
filePreview: string | null = null;

  constructor(public apifetch: Apifetch, private router: Router, private platformLocation: PlatformLocation) {
    this.apifetch.setMyUrl(true)
    this.apifetch.count.set(0)
   this.inputMediaForm.get('Toggler')?.valueChanges.subscribe((isToggled) => {
  const youtubeControl = this.inputMediaForm.get('youtubeUrl');

  if (!!isToggled) {
    youtubeControl?.clearValidators();
    this.videoUrl =false;
  } else {
    youtubeControl?.setValidators([
      Validators.required,
      Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
    ]);
  }

  youtubeControl?.updateValueAndValidity();
});
  }
  ngOnInit(): void {
    
    this.platformLocation.onPopState(() => {
      this.router.navigate(['']);
      this.apifetch.setMyUrl(false);
    }
  );
  this.searchSubject.pipe(
    debounceTime(2000),
    distinctUntilChanged()
  ).subscribe((value => this.searchCollection(value)))

    this.fetchTrigger$
      .pipe(
        switchMap(() =>
           this.apifetch.getdata(this.page_num, this.search)
      )
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


  incrementPage(x:number=1) {
    
    this.page_num += x;
    this.fetchTrigger$.next(this.page_num);
    
  }
  jumptostart(){
    this.page_num =1;
    this.fetchTrigger$.next(this.page_num);
  }
  jumptofinish(){
    this.page_num = this.totalPages;
    this.fetchTrigger$.next(this.page_num);
  }
  decrementPage(x:number=1) {
   
      this.page_num -= x;
      this.fetchTrigger$.next(this.page_num);
    
  }

  getImageData() {
    if (this.apifetch.count() == 1) {
      this.totalPages =this.rawData.total_pages;
      console.log(this.totalPages)
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

  searchWatcher(value:string){
    this.searchSubject.next(value);
  }
  searchCollection(searchTerm: string) {
    this.search = searchTerm;
    if (this.search.length<3){
      this.apifetch.count.set(0)
    }
    else{
      this.apifetch.count.set(1)
    }
    this.page_num = 1;
      this.filteredData=[];
      this.fetchTrigger$.next(this.page_num);
  }

  gohome() {
    this.apifetch.setMyUrl(false)
    this.router.navigate([''])
  }

  inputMediaForm = new FormGroup({
    youtubeUrl: new FormControl(
      "",
      [
        Validators.required,
        // Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
      ]
    ),
    Toggler: new FormControl(false),
    mediaFile: new FormControl(null)
  });

getYoutubeVideoId(url: string): string {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?/]+)/
  );
  return match ? match[1] : ''; // ✅ Return the video ID or empty string
}

closeMediaPlayer() {
  this.inputMediaForm.reset();
  this.youtubeUrl = "";
  this.videoUrl = false;
  this.uploadedFile = null;
  this.filePreview = null;

  if (this.inputMediaForm.get('mediaFile')) {
    this.inputMediaForm.get('mediaFile')?.reset();
  }
}

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  
  if (input.files && input.files.length > 0) {
    this.isSubmitted = false;
    this.uploadedFile = input.files[0]; 

    const fileType = this.uploadedFile.type;
    this.isFileSelected = true;
    if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(this.uploadedFile);
      this.isSubmitted = false;
    } else {
      this.filePreview = null;
      this.isFileSelected = false;
      this.isSubmitted = false;
    }
  }
}


onSubmit() {
  this.isSubmitted = true;
  // const isToggled = this.inputMediaForm.get('Toggler')?.value;

if (this.inputMediaForm.get('Toggler')?.value) {
  if (this.uploadedFile) {
    console.log('File submitted:', this.uploadedFile);
    console.log('File name:', this.uploadedFile.name);
    console.log('File type:', this.uploadedFile.type);
  } else {
    console.log('No file selected');
    this.isSubmitted = false;
  }
  this.youtubeUrl = '';
  this.videoUrl = false;
} else {
  const url = this.inputMediaForm.get('youtubeUrl')?.value ?? '';
  this.youtubeUrl = this.getYoutubeVideoId(url);
  this.videoUrl = !!this.youtubeUrl;
  console.log('YouTube URL:', this.youtubeUrl);
  this.uploadedFile = null;
  this.filePreview = null;
}
}

  ngOnDestroy(): void {
    this.fetchTrigger$.unsubscribe();
  }
}