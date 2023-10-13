import * as PIXI from "pixi.js";

export class Logger {
  logs: string[] = [];
  logText: PIXI.Text;

  constructor(app: PIXI.Application) {
    this.logText = app.stage.addChild(
      new PIXI.Text("", {
        fontSize: 14,
      })
    );

    this.logText.x = 2;
    this.logText.zIndex = 20;
  }

  // Add event to top of logs
  push(log: string) {
    this.logs.push(log);
    this.update();
  }

  private update() {
    if (this.logs.length > 30) {
      while (this.logs.length > 30) {
        this.logs.shift();
      }
    }

    this.logText.text = this.logs.join("\n");
  }
}
