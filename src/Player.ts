const { Howl } = require("howler");
const storage = require("electron-json-storage");
import { currentSong } from "./store";

export default class Player {
  index: number = 0;
  songs: object[];
  sound: typeof Howl;

  constructor(songs?: object[], index?: number) {
    this.songs = songs;
    this.index = index ? index : this.index;
    this.play();
  }

  play(index?: number) {
    let self = this;

    index = index ? index : this.index;

    let data = this.songs[index];

    if (self.sound) {
      self.sound.pause();
    }

    if (data["howl"]) {
      this.sound = data["howl"];
      console.log(this.sound);
    } else {
      this.sound = data["howl"] = new Howl({
        src: data["file"],
        html5: true,
        onplay: function () {
          console.log("Started");
          console.log(this.duration() / 60);
          currentSong.set(data);
        },
        onend: function () {
          console.log("Ended");
          self.index += 1;
          self.play();
        },
      });
    }
    let recentlyPlayed = [];

    storage.get("recently-played", (error: string, val: object) => {
      if (error) throw error;
      if (val["recentlyPlayed"]) {
        recentlyPlayed = val["recentlyPlayed"];
        for (let i = 0; i < recentlyPlayed.length; i++) {
          const element = recentlyPlayed[i];
          if (
            element["title"] + element["artist"] ===
            data["title"] + data["artist"]
          ) {
            return;
          }
        }
      }
      let newData = data;
      newData["howl"] = null;
      recentlyPlayed.push(newData);
      if (recentlyPlayed.length > 10) {
        recentlyPlayed = recentlyPlayed.shift();
      }

      storage.set("recently-played", { recentlyPlayed }, (error: string) => {
        if (error) throw error;
      });
    });

    this.sound.play();
    if (index === 0) {
      let oldData = this.songs[this.index - 1];
    }

    this.index = index;
  }

  pause() {
    var sound: typeof Howl = this.songs[this.index]["howl"];

    sound.pause();
  }
}
