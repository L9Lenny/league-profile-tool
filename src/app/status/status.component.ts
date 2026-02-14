import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../core/dialog/dialog.component";
import { LCUConnectionService } from "../core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  public text = '';

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  public setStatus() {
    const chatBody = {
      statusMessage: this.text,
      availability: "chat", // Forcing 'chat' status can help trigger the update
      lol: {
        summary: this.text,
        statusMessage: this.text
      }
    };

    const profileBody = {
      key: "summary",
      value: this.text
    };

    console.log('Sending thorough status/bio update to LoL:', chatBody);

    // Promise.all to ensure both endpoints are hit
    Promise.all([
      this.lcuConnectionService.requestCustomAPI(chatBody, 'PUT', '/lol-chat/v1/me'),
      this.lcuConnectionService.requestCustomAPI(profileBody, 'POST', '/lol-summoner/v1/current-summoner/summoner-profile')
    ]).then(responses => {
      console.log('LoL Responses:', responses);
      this.dialog.open(DialogComponent, {
        data: { body: 'Success' }
      });
    }).catch(err => {
      console.error('LoL Error:', err);
      this.dialog.open(DialogComponent, {
        data: { body: err }
      });
    });
  }
}
