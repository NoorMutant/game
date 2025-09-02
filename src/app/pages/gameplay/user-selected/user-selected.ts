import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Game } from '../../../service/game';

@Component({
  selector: 'app-user-selected',
  imports: [NgIf],
  templateUrl: './user-selected.html',
  styleUrl: './user-selected.css'
})
export class UserSelected {
   selected: number;

  constructor(private route: ActivatedRoute,private router:Router,private game: Game) {
    this.selected = this.game.userSelectedValue;
  }
}
