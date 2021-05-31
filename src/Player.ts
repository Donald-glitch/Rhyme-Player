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
    if (this.sound) {
      this.sound.stop();
    }
    let self = this;

    index = index ? index : this.index;

    let data = this.songs[index];

    if (data["howl"]) {
      this.sound = data["howl"];
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
    this.sound.play();

    this.index = index;
  }

  pause() {
    var sound: typeof Howl = this.songs[this.index]["howl"];

    sound.pause();
  }
}
