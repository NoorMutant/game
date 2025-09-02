import { Component, OnInit,OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Game } from '../../../service/game';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class Result implements OnInit{
  @Output() playAgain = new EventEmitter();

  selected: number = 0;
  user_winner: number = 0; // 0 draw, 1 user win, 2 user lose
  computer: number = 0;


  private destroy$ = new Subject<void>(); 
  
  constructor(private route: ActivatedRoute, private router: Router, private game: Game) {

  }

ngOnInit() {
 
const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
}
  // if(sessionStorage.getItem("step") =="2"){
  //   this.playAgain.emit();
  // }
  else{
      this.selected = this.game.userSelectedValue;
      this.computer = Math.floor(Math.random() * 3) + 1;
      // this.computer = 1;
      if (this.selected === this.computer) {
        this.user_winner = 0; // draw
      } else if (
        (this.selected === 1 && this.computer === 3) || // paper beats rock
        (this.selected === 2 && this.computer === 1) || // scissors beats paper
        (this.selected === 3 && this.computer === 2)    // rock beats scissors
      ) {
        this.user_winner = 1; // user wins
      } else {
        this.user_winner = 2; // user loses
      }
      setTimeout(() => {
        if (this.user_winner === 1) {
          this.game.increment();
        } else if (this.user_winner === 2) {
          this.game.decrement();
        }


      });
      console.log('computer:', this.computer);
      console.log('user:', this.selected);
      console.log('user_winner:', this.user_winner);
      this.game.setStep("2");
      // history.replaceState({}, '', '/result');
   
  }
}

  again(){
    this.playAgain.emit();
    // this.router.navigate(['start']);
  }

  // ngOnDestroy(){
  //   this.destroy$.next();  
  //   this.destroy$.complete();
  // }
}

