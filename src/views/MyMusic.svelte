<script lang="ts">
  import SongItem from "../components/SongItem.svelte";
  import ResumePlay from "../assets/ResumePlay.svelte";
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
      storage.get("recently-played", (error: string, data: object[]) => {
        if (error) throw error;
        recentlyPlayed = data["recentlyPlayed"];
      });
    }
  });
  $: songsInfo = $songsArray;

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
    if (songsInfo) {
      if (songsInfo.length > 0) {
        return;
      }
    }

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
      songsArray.set(songsInfo);
    }
  }

  async function scanDir(filePath: string) {
    if (!filePath || filePath == "undefined") return;
    var files = walkSync(filePath);
    await parseFiles(files);
    if ($player) {
      $player.songs = songsInfo;
      return;
    }
    player.set(new Player(songsInfo));
  }

  storage.get("settings", (error: string, data: string) => {
    if (error) throw error;
    scanDir(data["folder"]);
  });
</script>

<main>
  <div class="search">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.005 512.005" style="enable-background:new 0 0 512.005 512.005;" xml:space="preserve">
      <g>
        <g>
          <path
            d="M505.749,475.587l-145.6-145.6c28.203-34.837,45.184-79.104,45.184-127.317c0-111.744-90.923-202.667-202.667-202.667    S0,90.925,0,202.669s90.923,202.667,202.667,202.667c48.213,0,92.48-16.981,127.317-45.184l145.6,145.6    c4.16,4.16,9.621,6.251,15.083,6.251s10.923-2.091,15.083-6.251C514.091,497.411,514.091,483.928,505.749,475.587z     M202.667,362.669c-88.235,0-160-71.765-160-160s71.765-160,160-160s160,71.765,160,160S290.901,362.669,202.667,362.669z"
          />
        </g>
      </g>
    </svg>
    <input type="text" bind:value={searchVal} placeholder="Search Music" spellcheck="false" />
  </div>
  {#if recentlyPlayed}
    <h1>Recently Played</h1>
    <div class="recently-played">
      {#each recentlyPlayed as item}
        <SongItem artist={item["artist"]} title={item["title"]} imgSrc={item["imgSrc"]} file={item["file"]} />
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
      border-radius: 10px;
      background-color: #ececec;
      padding: 6px 10px;
      gap: 10px;
      margin-bottom: 20px;
      transition: 0.3s;
      &:focus-within {
        box-shadow: 0px 4px 7px rgba(92, 92, 92, 0.25);
        input::placeholder {
          color: transparent;
        }
      }
      input {
        width: 100%;
        height: auto;
        border: none;
        font-size: 1em;
        background-color: #ececec;
        color: #5c5c5c;
        &::placeholder {
          color: #5c5c5c;
        }
      }
      svg {
        width: 24px;
        height: 24px;
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
      border-radius: 10px;
      margin-top: 15px;
      padding: 20px;
      background-color: #ececec;
      display: flex;
      align-items: center;
      gap: 20px;
      overflow-x: scroll;
      margin-bottom: 20px;
    }

    .songs {
      display: grid;
      gap: 15px;
      grid-template-columns: repeat(auto-fill, 120px);
    }
  }
</style>
