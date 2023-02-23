import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
  scoreResults? : {
    home_team_score: number,
    visitor_team_score: number
  }
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  team: Team;
  teamAbb = '';
  routeSub:Subscription;
  constructor(private route: ActivatedRoute, private router:Router) {
    this.routeSub = this.route.params.subscribe(params => {this.teamAbb = params.team})
    this.team = JSON.parse(localStorage.getItem('trackingTeams')).filter(team => team.abbreviation === this.teamAbb)[0]
    if(!this.team){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
