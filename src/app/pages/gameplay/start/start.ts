import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../../../service/game';

@Component({
  selector: 'app-start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css'
})
export class Start implements OnInit {
  selected: number = 0;
  UserFound: Boolean = false;


  constructor(private router: Router, private game: Game) {
    game.setStep("1");
  }

ngOnInit() {

  const currentUserId = localStorage.getItem("currentUserId");
  const currentUrl = this.router.url;

  if (currentUserId) {
    
    this.loadUserScores(currentUserId);
    this.game.setUserFound("1");
    this.UserFound = true;
  } else {
    if (currentUrl !== '/signup') {
      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 0);
    }
  }
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
    this.router.navigate(['/user-selected', this.selected]);
  }
   navigateToGallery(){
    this.router.navigate(['/gallery']);
  }
}