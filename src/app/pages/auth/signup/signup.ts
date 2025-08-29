import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Game } from '../../../service/game';
@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  UserFound: Boolean = false;
  userName: string = "";
  userAge: any = null;
  userPassword: string = "";
  errorMessage: string = '';

  
  allUsersData: {
    id: number;
    name: string;
    age: number;
    password: string;
    currentScore: number;
    highestScore: number;
  }[] = [];

  nextID: number = 1;
  anything = false

  constructor(private router: Router, private game: Game) { }

  ngOnInit() {
    let userFoundValue = sessionStorage.getItem("UserFound");
    if (userFoundValue === "1") {
      this.UserFound = true;
      this.router.navigate(['']);
    } else {
      const storedData = localStorage.getItem("allUsersData");
      if (storedData) {
        this.allUsersData = JSON.parse(storedData)

        if (this.allUsersData.length > 0) {
          const maxId = Math.max(...this.allUsersData.map(user => user.id));
          this.nextID = maxId + 1;
        }
      }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  pushArray() {
    
    this.allUsersData.push({
      id: this.nextID,
      name: this.userName,
      age: this.userAge,
      password: this.userPassword,
      currentScore: 0,    
      highestScore: 0     
    });

    this.game.localAllUserData(JSON.stringify(this.allUsersData));
    this.anything = true;

    
    localStorage.setItem("currentUserId", String(this.nextID));
    this.game.setUserName(this.userName)

    
    this.game.setScore(0);
    this.game.setHighScore(0);

    
    this.userName = "";
    this.userAge = 1;
    this.userPassword = "";

    
    sessionStorage.setItem("CurrentID", String(this.nextID));
    sessionStorage.setItem("UserFound", "1");

    this.router.navigate(['']);
  }

  userprint() {
    try {
      if (this.userName === "") {
        throw new Error("Name is required.")
      }
      const isNameTaken = this.allUsersData.some(user => user.name.toLowerCase() === this.userName.toLowerCase());
      if (isNameTaken) {
        throw new Error("This username is already taken. Please choose another.");
      }
      if (isNaN(this.userAge)) {
        throw new Error("age must be number");
      }
      else if (this.userAge === 0) {
        throw new Error("Welcome to World Idiot!")
      }
      else if (this.userAge < 0) {
        throw new Error("Age is negative? Seriously")
      }
      if ((this.userPassword).length < 9) {
        throw new Error("Password must be more than 8 characters");
      }

      this.errorMessage = "All good"
      console.log(this.userName)
      console.log(this.userAge)
      this.pushArray();
    }
    catch (error) {
      console.error(error);
      if (error instanceof Error) {
        this.errorMessage = error.message;
      }
      this.userAge = null;
      this.userName = "";
      this.userPassword = "";
    }
  }
}