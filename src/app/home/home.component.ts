import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {Router} from '@angular/router';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teamOptions: Array<Team> = [];
  trackingTeams: Array<Team> = [];
  selectedTeam: Array<Team> = [];
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

  getHomeScoreAverage(team) {
    return Math.round(team.scoreResults.reduce((a, {home_team_score}) => a + home_team_score, 0) / team.scoreResults.length)
  }

  getVisitorScoreAverage(team) {
    return Math.round(team.scoreResults.reduce((a, {visitor_team_score}) => a + visitor_team_score, 0) / team.scoreResults.length)
  }

  removeCard(id){
    this.trackingTeams = this.trackingTeams.filter(value => value.id != id);
    localStorage.setItem('trackingTeams', JSON.stringify(this.trackingTeams))
  }

  showGameResult(team){
    this.router.navigate(['/results', team]);
  }
}
