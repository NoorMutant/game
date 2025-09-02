import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Game {
  private scoreSubject = new BehaviorSubject<number>(0);
  private highScoreSubject = new BehaviorSubject<number>(0);
  private myNameSubject = new BehaviorSubject<string>("");
 
  
  score$ = this.scoreSubject.asObservable();
  highest$ = this.highScoreSubject.asObservable();
  myName$ = this.myNameSubject.asObservable();


  constructor() {}


  setUserName(name: string) {
  this.myNameSubject.next(name);
  localStorage.setItem("currentUserName",name)
}
  get score() {
    return this.scoreSubject.value;
  }

  get highScore() {
    return this.highScoreSubject.value;
  }

  setScore(newScore: number) {
    this.scoreSubject.next(newScore);
    this.updateUserScore();
  }

setHighScore(newHighScore: number) {
  this.highScoreSubject.next(newHighScore);
  this.updateUserScore();
}

  increment() {
    const newScore = this.score + 1;
    this.setScore(newScore);
    
    
    if (newScore > this.highScore) {
      this.setHighScore(newScore);
    }
  }

  decrement() {
    this.setScore(this.score - 1);
  }

  
  private updateUserScore() {
    const currentUserId = localStorage.getItem("currentUserId");
    if (!currentUserId) return;

    const allUsersData = localStorage.getItem("allUsersData");
    if (!allUsersData) return;

    const users = JSON.parse(allUsersData);
    const userIndex = users.findIndex((user: any) => user.id === Number(currentUserId));
    
    if (userIndex !== -1) {
      users[userIndex].currentScore = this.score;
      users[userIndex].highestScore = this.highScore;
      localStorage.setItem("allUsersData", JSON.stringify(users));
      console.log(`Updated scores for user ${users[userIndex].name}: Current=${this.score}, Highest=${this.highScore}`);
    }
  }

  setUserFound(x: string) {
    sessionStorage.setItem("UserFound", x);
  }

  setStep(x: string) {
    sessionStorage.setItem("step", x);
  }

  localAllUserData(x: string) {
    localStorage.setItem("allUsersData", x);
  }
  
}