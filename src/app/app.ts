import { ChangeDetectorRef, Component, signal,OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from './service/game';
import { Apifetch } from './service/apifetch';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, FormsModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit,OnDestroy {
  userName:string = "";
  userAge:number|null = null;
  score: number =0;
  rules: boolean = false;
  private sub:Subscription;
  private url:Subscription;
  private highSub:Subscription;
  protected currentName:Subscription;
  UserFound:Boolean=false;
  highest:number = 0;
  onGallery:boolean=false;



  constructor(private game: Game,public router:Router,private gallery:Apifetch) {
    this.sub = this.game.score$.subscribe(score =>{
    this.score = score;
  });  
    this.url = this.gallery.myUrl$.subscribe(url =>{
    this.onGallery = url;
  });  
    this.currentName = this.game.myName$.subscribe(name =>{
    this.userName = name;
  });  
    this.highSub = this.game.highest$.subscribe(highScore =>{
    this.highest = highScore;
  });  
}
 ngOnInit() {
  
  const currentUserId = localStorage.getItem("currentUserId");
  const currentUrl = this.router.url;
  if (!currentUserId) {
     if (currentUrl !== '/login') 
        this.router.navigate(['/login']);
  }
  
  console.log(this.router.url);

  let userFoundValue =Number( localStorage.getItem("currentUserId"));
  if (userFoundValue != 0) {
    this.UserFound = true;
    // this.userName = sessionStorage.getItem("name") || "";
    this.userAge = Number(sessionStorage.getItem("age"));
    const currentUserId = localStorage.getItem("currentUserId");
    if (currentUserId){
      this.loadCurrentUserScores(currentUserId);
    }
  } else {
    this.game.setUserFound("0");
  }
}

  openRules(){
    this.rules = true;
  }


  closeRules(){
    this.rules = false;
  }
  
  logout() {
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("currentUserName");
  sessionStorage.removeItem("UserFound");
  sessionStorage.removeItem("CurrentID");
  this.game.setUserName("");
  this.game.setScore(0);
  this.game.setHighScore(0);
  this.router.navigate(['/login']); 
}
  toprofile(){
    this.router.navigate(['/profile']);
  }
    loadCurrentUserScores(userId: string) {
  const allUsersData = localStorage.getItem("allUsersData");
  if (allUsersData) {
    const users = JSON.parse(allUsersData);
    const currentUser = users.find((user: any) => user.id === Number(userId));
    
    if (currentUser) {
      this.game.setUserName(currentUser.name);
      this.game.setScore(currentUser.currentScore || 0);
      this.game.setHighScore(currentUser.highestScore || 0);
    }
  }
}
ngOnDestroy(): void {
   this.sub.unsubscribe();
   this.url.unsubscribe();
   this.highSub.unsubscribe();
   this.currentName.unsubscribe();
}
}
