import { ChangeDetectorRef, Component, signal,OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Game } from './service/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  userName:string = "";
  userAge:number|null = null;
  score: number =0;
  rules: boolean = false;
  private sub:Subscription;
  private highSub:Subscription;
  protected currentName:Subscription;
  UserFound:Boolean=false;
  highest:number = 0;

  constructor(private game: Game,public router:Router) {
    this.sub = this.game.score$.subscribe(score =>{
    this.score = score;
  });  
    this.currentName = this.game.myName$.subscribe(name =>{
    this.userName = name;
  });  
    this.highSub = this.game.highest$.subscribe(highScore =>{
    this.highest = highScore;
  });  
}
 ngOnInit() {

  let userFoundValue =Number( localStorage.getItem("currentUserId"));
  if (userFoundValue != 0) {
    this.UserFound = true;
    // this.userName = sessionStorage.getItem("name") || "";
    this.userAge = Number(sessionStorage.getItem("age"));
    const currentUserId = localStorage.getItem("currentUserId");
    if (currentUserId) {
      this.loadCurrentUserScores(currentUserId);
    }
  } else {
    this.game.setUserFound("0");
  }
}


private loadCurrentUserScores(userId: string) {
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
  this.router.navigate(['/signup']); 
}
  toprofile(){
    this.router.navigate(['/profile']);
  }
  
}
