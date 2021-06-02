<script lang="ts">
  import { songViewInfo, player } from "../store";
  function showPlayBtn() {
    let playBtn = document.getElementById("play-btn");
    playBtn.style.display = "flex";
  }
  function hidePlayBtn() {
    let playBtn = document.getElementById("play-btn");
    playBtn.style.display = "none";
  }
  function playSong() {
    for (let i = 0; i < $player.songs.length; i++) {
      const value = $player.songs[i];
      if (
        value["title"] === $songViewInfo["title"] &&
        value["artist"] === $songViewInfo["artist"]
      ) {
        $player.index = $player.songs.indexOf(value);
        $player.play();
        return;
      }
    }
  }
</script>

<main>
  <div
    class="song-info"
    on:mouseenter={showPlayBtn}
    on:mouseleave={hidePlayBtn}
  >
    <img src={$songViewInfo["imgSrc"]} alt="" />
    <div class="info">
      <div class="titles">
        <h2>{$songViewInfo["title"]}</h2>
        <p>{$songViewInfo["artist"]}</p>
      </div>
      <div id="play-btn" on:click={playSong}>
        <svg width="74" height="74" viewBox="0 0 74 74">
          <g>
            <path
              d="M25.9993 19.6798L55.9993 37.0003L25.9993 54.3208L25.9993 19.6798Z"
              fill="white"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</main>

<style lang="scss">
  #play-btn {
    display: none;
    cursor: pointer;
    background-color: #ff006b;
    max-width: 50px;
    max-height: 50px;
    min-width: 50px;
    min-height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    svg {
      width: 40px;
      height: 40px;
    }
  }
  main {
    padding: 20px;
    height: 100%;
    width: 100%;
  }
  img {
    min-width: 200px;
    min-height: 200px;
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
  }

  .song-info {
    display: flex;
    gap: 30px;
    align-items: center;
  }
  .info {
    display: flex;
    width: 50%;
    justify-content: space-between;
    align-items: center;
    .titles {
      max-width: 80%;
    }
  }
  h2 {
    font-size: 1.4em;
    font-weight: 500;
  }
  p {
    font-size: 1.2em;
  }
  h2,
  p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }
</style>
