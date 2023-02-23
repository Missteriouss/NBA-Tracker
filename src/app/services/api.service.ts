import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Data {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
  scoreResults? : {
    home_team_score: number;
    visitor_team_score: number
  }
}

export interface Meta {
  total_pages: number;
  current_page: number;
  next_page?: any;
  per_page: number;
  total_count: number;
}

export interface APIResult {
  data: Data[];
  meta: Meta;
}

export interface LastResults {
  data: {
    home_team_score: number;
    visitor_team_score: number
  };
  meta: Meta;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  header: HttpHeaders = new HttpHeaders({
    'X-RapidAPI-Key': '2QMXSehDLSmshDmRQcKUIAiQjIZAp1UvKUrjsnewgqSP6F5oBX',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
  });

  constructor(private http: HttpClient) { }

  //get all teams
  teams(): Observable<APIResult> {
    return this.http.get<APIResult>(`https://free-nba.p.rapidapi.com/teams`, { headers: this.header })
  }

  //get last results of dates selected
  lastResults(team_id): Observable<LastResults> {
    const dates = this.getLast12Dates()
    return this.http.get<LastResults>(`https://free-nba.p.rapidapi.com/games?page=0&team_ids[]=${team_id}${dates}`, { headers: this.header })
  }

  getTodaysDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    return yyyy + '-' + mm + '-' + dd;
    // Ex: 2012-12-02
  }

  getLast12Dates() {
    const today = new Date();
    let last12Dates = '';
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      last12Dates += `&dates[]=${year}-${month}-${day}`;
    }
    return last12Dates;
  }

}
