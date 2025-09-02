import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../../../service/game';
import { NgIf } from '@angular/common';
import { UserSelected } from '../user-selected/user-selected';
import { Result } from '../result/result';

@Component({
  selector: 'app-start',
  imports: [Result, UserSelected],
  templateUrl: './start.html',
  styleUrl: './start.css'
})
export class Start implements OnInit {
  selected: number = 0;
  UserFound: Boolean = false;

  isUserVisible:Boolean= false;
  isStartScreen:Boolean= true;

  constructor(private router: Router, private game: Game) {
    game.setStep("1");
  }

ngOnInit() {

  const currentUserId = localStorage.getItem("currentUserId");
  const currentUrl = this.router.url;
  this.game.setUserFound("1");
  this.UserFound = true;

  if (currentUserId) {
    this.loadUserScores(currentUserId);
    this.game.setUserFound("1");
    this.UserFound = true;
  } 
  // else {
  //   if (currentUrl !== '/login') {
  //     setTimeout(() => {
  //       this.router.navigate(['/login']);
  //     }, 0);
  //   }
  // }
}
private loadUserScores(userId: string) {
  const allUsersData = localStorage.getItem("allUsersData");
  if (allUsersData) {
    const users = JSON.parse(allUsersData);
    const currentUser = users.find((user: any) => user.id === Number(userId));
    
    if (currentUser) {
      
      this.game.setScore(currentUser.currentScore || 0);
      this.game.setHighScore(currentUser.highestScore || 0);
      console.log('Loaded scores in Start component - Current:', currentUser.currentScore, 'Highest:', currentUser.highestScore);
    }
  }
}
  onClick(x: number) {
    this.selected = x;
    this.game.setUserSelectedValue(x);
    this.isStartScreen= false;
    this.isUserVisible=true;
    setTimeout(()=>{
    this.isStartScreen= false;
    this.isUserVisible=false;
    },5000
    )
  }
   navigateToGallery(){
    this.router.navigate(['/gallery']);
  }

}