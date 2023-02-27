import { Component, OnInit } from '@angular/core';
import { ApiService, Team } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teamOptions: Array<Team>;
  trackingTeams: Array<Team>;
  selectedTeam: Array<Team>;
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    //get teams
    this.loading = true;
    this.apiService.teams().subscribe(res => { this.teamOptions = res.data; this.loading = false; })
    this.trackingTeams = !!JSON.parse(localStorage.getItem('trackingTeams')) ? JSON.parse(localStorage.getItem('trackingTeams')) : []
  }
  // lastResults
  onTeamSelected(event) {
    this.selectedTeam = this.teamOptions.filter(val => val.id == event.target.value);
    this.loading = true;
    this.apiService.lastResults(this.selectedTeam[0].id).subscribe(res => { this.selectedTeam[0].scoreResults = res.data; this.loading = false; });
  }

  trackSelectedTeam() {
    this.trackingTeams = [...this.trackingTeams, ...this.selectedTeam];
    localStorage.setItem('trackingTeams', JSON.stringify(this.trackingTeams))
  }

  getCurrentTeamScoreAverage(team: Team) {
    let total = 0, matchCount = 0;
    for (let score of team.scoreResults) {
      if (score.home_team_score !== 0 && score.visitor_team_score !== 0) {
        if (score.home_team.abbreviation === team.abbreviation) {
          total += score.home_team_score;
          matchCount++;
        }
        else if (score.visitor_team.abbreviation === team.abbreviation) {
          total += score.visitor_team_score;
          matchCount++;
        }
      }
    }
    return Math.round(total / matchCount);
  }

  getOpponentTeamScoreAverage(team: Team) {
    let total = 0, matchCount = 0;
    for (let score of team.scoreResults) {
      if (score.home_team_score !== 0 && score.visitor_team_score !== 0) {
        if (score.home_team.abbreviation !== team.abbreviation) {
          total += score.home_team_score;
          matchCount++;
        }
        else if (score.visitor_team.abbreviation !== team.abbreviation) {
          total += score.visitor_team_score;
          matchCount++;
        }
      }
    }
    return Math.round(total / matchCount);
  }

  removeCard(id) {
    this.trackingTeams = this.trackingTeams.filter(value => value.id != id);
    localStorage.setItem('trackingTeams', JSON.stringify(this.trackingTeams))
  }

  showGameResult(team) {
    this.router.navigate(['/results', team]);
  }
}
