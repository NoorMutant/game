import { Component, OnInit,OnDestroy } from '@angular/core';
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
export class Result implements OnInit,OnDestroy{
  selected: number = 0;
  user_winner: number = 0; // 0 draw, 1 user win, 2 user lose
  computer: number = 0;


  private destroy$ = new Subject<void>(); 
  
  constructor(private route: ActivatedRoute, private router: Router, private game: Game) {}

ngOnInit() {
 
const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {

}
  if(sessionStorage.getItem("step") =="2"){
    this.router.navigate(['']);
  }
  else{
    this.route.paramMap
        .pipe(takeUntil(this.destroy$)) 
        .subscribe(params => {
          this.selected = Number(params.get('selected'));
      this.computer = Math.floor(Math.random() * 3) + 1;
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
      console.log('user_winner:', this.user_winner);
      this.game.setStep("2");
      // history.replaceState({}, '', '/result');
    });
  }
}

  again() {
    this.router.navigate(['']);
  }

  ngOnDestroy(){
    this.destroy$.next();  
    this.destroy$.complete();
  }
}


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Game } from '../../game';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-result',
//   imports: [CommonModule],
//   templateUrl: './result.html',
//   styleUrl: './result.css'
// })
// export class Result implements OnInit {
//   selected: number = 0;
//   user_winner: number = 0; // 0 draw, 1 user win, 2 user lose
//   computer: number = 0;

//   constructor(private route: ActivatedRoute, private router: Router, private game: Game) { 
//     this.game.computer$.subscribe(v => {
//       // console.log("computed initial value: ", v)
//       this.computer = v
//     });
//     if (this.computer > 0) {
//       this.router.navigate(['']);
//     }
//   }

//   ngOnInit() {
//       this.route.paramMap.subscribe(params => {
//         this.selected = Number(params.get('selected'));
//         this.computer = Math.floor(Math.random() * 3) + 1;
//         this.game.setComputer(this.computer);

//         if (this.selected === this.computer) {
//           this.user_winner = 0; // draw
//         } else if (
//           (this.selected === 1 && this.computer === 3) || // paper beats rock
//           (this.selected === 2 && this.computer === 1) || // scissors beats paper
//           (this.selected === 3 && this.computer === 2)    // rock beats scissors
//         ) {
//           this.user_winner = 1; // user wins
//         } else {
//           this.user_winner = 2; // user loses
//         }
//         setTimeout(() => {
//           if (this.user_winner === 1) {
//             this.game.increment();
//           } else if (this.user_winner === 2) {
//             this.game.decrement();
//           }
//         });
//         console.log('computer:', this.computer);
//         console.log('user_winner:', this.user_winner);
//       });
//     }
  

//   again() {
//     this.router.navigate(['']);
//   }
// }