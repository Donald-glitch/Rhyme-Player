<script lang="ts">
  import SongItem from "../components/SongItem.svelte";
  import Player from "../Player";
  import { player, songsArray } from "../store";
  let searchVal = "";

  const storage = require("electron-json-storage");
  const mm = require("music-metadata");
  const fs = require("fs");
  const path = require("path");
  let recentlyPlayed: object[];
  storage.has("recently-played", (error: string, hasKey: boolean) => {
    if (error) throw error;
    if (hasKey) {
      storage.get("recently-played", (error: string, data: object) => {
        if (error) throw error;
        recentlyPlayed = data["recently-played"];
      });
    }
  });
  let songsInfo: object[] = [];

  var walkSync = function (dir: string, filelist?: string[]) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file: string) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = walkSync(path.join(dir, file), filelist);
      } else {
        if (file.endsWith(".mp3") || file.endsWith(".m4a") || file.endsWith(".webm") || file.endsWith(".wav") || file.endsWith(".aac") || file.endsWith(".ogg") || file.endsWith(".opus")) {
          filelist.push(path.join(dir, file));
        }
      }
    });
    return filelist;
  };

  async function parseFiles(audioFiles: string[]) {
    for (const audioFile of audioFiles) {
      // await will ensure the metadata parsing is completed before we move on to the next file
      const metadata = await mm.parseFile(audioFile, { skipCovers: false });
      var data: object = { howl: null };
      var title = metadata.common.title;
      var artist = metadata.common.artist;
      data["title"] = title ? title : audioFile.split(path.sep).slice(-1)[0];
      data["artist"] = artist ? artist : "Unknown";
      data["file"] = audioFile;
      data["imgSrc"] = metadata.common.picture ? `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString("base64")}` : null;

      songsInfo.push(data);
      console.log(data);
      console.log(songsInfo);
    }
  }

  async function scanDir(filePath: string) {
    if ($songsArray) {
      songsInfo = $songsArray;
      return;
    }
    songsArray.set(songsInfo);
    if (!filePath || filePath == "undefined") return;
    var files = walkSync(filePath);
    await parseFiles(files);
    player.set(new Player(songsInfo));
  }

  storage.get("settings", (error: string, data: string) => {
    if (error) throw error;
    scanDir(data["folder"]);
  });
</script>

<main>
  <div class="search">
    <svg width="61.737961mm" height="61.301872mm" viewBox="0 0 61.737961 61.301872">
      <g id="layer1" transform="translate(-120.44117,-90.049182)">
        <g id="g839" transform="translate(98.599622,5.4834689)" inkscape:transform-center-x="8.8837363" inkscape:transform-center-y="23.022654">
          <circle style="fill:none;fill-opacity:0.999428;stroke:#000000;stroke-width:2.265;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path833" cx="39.903915" cy="102.62808" r="16.929869" />
          <path style="fill:none;stroke:#000000;stroke-width:2.12422;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 52.38632,114.6744 30.442162,30.44216 z" id="path835" />
        </g>
      </g>
    </svg>
    <input type="text" bind:value={searchVal} placeholder="Search" />
  </div>
  {#if recentlyPlayed}
    <h1>Recently Played</h1>
    <div class="recently-played">
      {#each recentlyPlayed as item}
        SS
      {/each}
    </div>
  {/if}
  {#if songsInfo}
    <div class="songs">
      {#each songsInfo as song}
        {#if searchVal !== ""}
          {#if song["title"].toLowerCase().includes(searchVal.toLowerCase()) || song["artist"].toLowerCase().includes(searchVal.toLowerCase())}
            <SongItem artist={song["artist"]} title={song["title"]} imgSrc={song["imgSrc"]} file={song["file"]} />
          {/if}
        {:else}
          <SongItem artist={song["artist"]} title={song["title"]} imgSrc={song["imgSrc"]} file={song["file"]} />
        {/if}
      {/each}
    </div>
  {/if}
</main>

<style lang="scss">
  main {
    .search {
      display: flex;
      align-items: center;
      border-radius: 30px;
      border: 1px solid #5c5c5c;
      padding: 6px 15px;
      gap: 10px;
      margin-bottom: 20px;
      input {
        width: 100%;
        height: auto;
        border: none;
        font-size: 1em;
        color: #5c5c5c;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: #5c5c5c;
      }
    }
    padding: 20px;
    width: 100%;
    height: 100%;

    h1 {
      font-weight: 400;
      font-size: 1.6em;
    }

    .recently-played {
      width: 100%;
      height: 200px;
      border-radius: 10px;
      margin-top: 15px;
      background-color: #ececec;
      overflow-x: scroll;
    }

    .songs {
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(auto-fill, 120px);
    }
  }
</style>
