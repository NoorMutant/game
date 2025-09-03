import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Game } from '../../../service/game';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit,OnDestroy{
  UserFound: Boolean = false;
  userName: string = "";
  userPassword: string = "";
  errorMessage: string = '';
  successMessage: string = '';
  private currentName:Subscription;
  currentUserName:string|null =null;
  currentUserPass:string|null =null;
  currentUserId:string | null="";


    
  allUsersData: { 
    id: number; 
    name: string; 
    age: number; 
    password: string;
    currentScore: number;
    highestScore: number;
  }[] = [];

  constructor(private router: Router, private game: Game) {
    this.currentName = this.game.myName$.subscribe(name =>{
    this.currentUserName= name;}); 
  }

    ngOnInit() {
      debugger;
    let userFoundValue = sessionStorage.getItem("UserFound");
    if (userFoundValue === "0") {
      this.UserFound = false;
      this.router.navigate(['/signup']);
      return;
    }
    else{
      this.UserFound = true;
    }
    this.currentUserName = localStorage.getItem("currentUserName");
    if(true){
      this.currentUserId = localStorage.getItem("currentUserId");
    }

    const storedData = localStorage.getItem("allUsersData");
    if (storedData) {
      this.allUsersData = JSON.parse(storedData);
    }//else maybe to redirect to signup and say no user exist to login
  }

   

  attemptNameChange() {

    this.errorMessage = '';
    this.successMessage = '';

    try {
      if (this.userName.trim() === "") {
        throw new Error("Username is required.");
      }

      if (this.userPassword.trim() === "") {
        throw new Error("Password is required.");
      }

      const userWithNewName = this.allUsersData.find(user => 
        user.name.toLowerCase() === this.userName.toLowerCase()
      );
      if (userWithNewName) {
        throw new Error("Username already taken.");
      }

      const currentUserPass = this.getCurrentUserPassword();
      if (currentUserPass !== this.userPassword) {
        throw new Error("Wrong password.");
      }

      const currentUser = this.allUsersData.find(user => user.id === Number(this.currentUserId));
      if (!currentUser) {
        throw new Error("Current user not found.");
      }

      this.changeName(currentUser); 

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        this.errorMessage = error.message;
      }
      this.userPassword = "";
    }
  }

  getCurrentUserPassword() {
    const my_id = Number(this.currentUserId);
    const user = this.allUsersData.find(y => y.id === my_id);
    return user?.password;
}

  //  findUserByName(username: string) {
  //   return this.allUsersData.find(user => 
  //     user.name.toLowerCase() === username.toLowerCase()
  //   );
  // }



   changeName(user: any) {
    console.log('Changing name for user:', user.name);
    const userIndex = this.allUsersData.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      this.allUsersData[userIndex].name = this.userName;
    }
    this.pushUserData(this.allUsersData);
    localStorage.setItem("currentUserId", String(user.id));
    this.game.setUserName(this.userName);

    this.currentUserName = this.userName;
    sessionStorage.setItem("UserFound", "1");
    sessionStorage.setItem("CurrentID", String(user.id));

    this.successMessage = "Name changed successfully!";
    this.userName = "";
    this.userPassword = "";
    
  }


  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
    goToSignup() {
    this.router.navigate(['/signup']);
  }
  goback(){
    this.router.navigate([""]);
  }
  resetCurrentScore(){
    this.pullUserData();
    const user = this.allUsersData.findIndex(user => user.id === Number(this.currentUserId));
    this.allUsersData[user].currentScore = 0;
    this.pushUserData(this.allUsersData);
    console.log(`score updated`)
    this.game.setScore(0);
    this.router.navigate([""]);

  }
  resetHighScore(){
    this.pullUserData()
    const user = this.allUsersData.findIndex(user => user.id === Number(this.currentUserId));
    this.allUsersData[user].highestScore = 0;
    // this.allUsersData[user].currentScore = 0; ////un comment if wanna reset current on highscore reset too
    this.pushUserData(this.allUsersData)
    console.log(`Highscore updated`)
    this.game.setHighScore(0);
    this.router.navigate([""]);
    // this.game.loadCurrentUserScores(user.toString())
  }

  pushUserData(x:any){
    localStorage.setItem("allUsersData", JSON.stringify(x));
  }
  pullUserData(){
    const storedData = localStorage.getItem("allUsersData");
    if (storedData) {
      this.allUsersData = JSON.parse(storedData);
    }
  }
  ngOnDestroy(): void {
   this.currentName.unsubscribe();
}
}
