import { Component, OnInit } from '@angular/core';
import { Team } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
