import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-selected',
  imports: [NgIf],
  templateUrl: './user-selected.html',
  styleUrl: './user-selected.css'
})
export class UserSelected {
   selected: number;

  constructor(private route: ActivatedRoute,private router:Router) {
    this.selected = Number(this.route.snapshot.paramMap.get('selected'));
  }

  ngOnInit() {
    setTimeout(() => {

      this.router.navigate(['/result',this.selected], { replaceUrl: true });
    }, 5000);
  }
}
