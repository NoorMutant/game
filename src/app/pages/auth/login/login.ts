import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Game } from '../../../service/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  UserFound: Boolean = false;
  userName: string = "";
  userPassword: string = "";
  errorMessage: string = '';
  successMessage: string = '';
  
  allUsersData: { 
    id: number; 
    name: string; 
    age: number; 
    password: string;
    currentScore: number;
    highestScore: number;
  }[] = [];

  constructor(private router: Router, private game: Game) {}

  ngOnInit() {
    let userFoundValue = sessionStorage.getItem("UserFound");
    if (userFoundValue === "1") {
      this.UserFound = true;
      this.router.navigate(['']);
      return;
    }

    const storedData = localStorage.getItem("allUsersData");
    if (storedData) {
      this.allUsersData = JSON.parse(storedData);
    }//else maybe to redirect to signup and say no user exist to login
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  findUserByName(username: string) {
    return this.allUsersData.find(user => 
      user.name.toLowerCase() === username.toLowerCase()
    );
  }

  attemptLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      if (this.userName.trim() === "") {
        throw new Error("Username is required.");
      }

      if (this.userPassword.trim() === "") {
        throw new Error("Password is required.");
      }

      const foundUser = this.findUserByName(this.userName);
      
      if (!foundUser) {
        throw new Error("No user found with this username.");
      }

      if (foundUser.password !== this.userPassword) {
        throw new Error("Wrong password.");
      }

      this.loginUser(foundUser);

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        this.errorMessage = error.message;
      }
      this.userPassword = "";
    }
  }

  loginUser(user: any) {
    console.log('Login successful for user:', user.name);
    
    // Set current logged in user
    localStorage.setItem("currentUserId", String(user.id));
    localStorage.setItem("currentUserName", user.name);
    
    // Load user's scores into the game service
    this.game.setScore(user.currentScore || 0);
    this.game.setHighScore(user.highestScore || 0);
    
    // Set session data
    sessionStorage.setItem("UserFound", "1");
    sessionStorage.setItem("CurrentID", String(user.id));

    this.successMessage = `Welcome back, ${user.name}!`;
    
    this.userName = "";
    this.userPassword = "";
    
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1000);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}