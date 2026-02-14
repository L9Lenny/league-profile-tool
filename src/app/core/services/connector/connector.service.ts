import { Injectable } from '@angular/core';
import { ElectronService } from "..";
import { Options } from "./options";
import { Data } from "./data";

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {
  connector: Options | undefined;
  private _clientConnection: any;

  constructor(private electronService: ElectronService) {
    this.initConnector();
  }

  private initConnector() {
    if (this._clientConnection) {
      this._clientConnection.stop();
    }

    this._clientConnection = new this.electronService.LCUConnector();

    // Smart Search for common Riot folders if default discovery fails
    const commonPaths = [
      'C:/Riot Games/League of Legends',
      'D:/Riot Games/League of Legends',
      'E:/Riot Games/League of Legends',
      'F:/Riot Games/League of Legends'
    ];

    for (const p of commonPaths) {
      if (this.electronService.fs.existsSync(p + '/LeagueClient.exe')) {
        console.log('Smart search found LoL at:', p);
        // @ts-ignore
        this._clientConnection._dirPath = p;
        break;
      }
    }

    this._clientConnection.on('connect', (data: Data) => {
      console.log('LCU Connected:', data);
      this.connector = {
        rejectUnauthorized: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(`${data["username"]}:${data["password"]}`)
        },
        url: `${data["protocol"]}://${data["address"]}:${data["port"]}`
      };
    });

    this._clientConnection.on('disconnect', () => {
      console.log('LCU Disconnected');
      this.connector = undefined;
    });

    console.log('Starting LCU Connector (Auto-Search)...');
    this._clientConnection.start();
  }
}
