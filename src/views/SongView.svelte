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
        console.log(value);
        console.log($player.index);
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
        <svg
          width="69.801514mm"
          height="80.599846mm"
          viewBox="0 0 69.801514 80.599846"
          version="1.1"
          id="svg8"
        >
          <g id="layer1" transform="translate(-14.96718,-15.350977)">
            <path
              style="fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:2.265"
              id="path835"
              d="m 82.503696,55.650902 -66.404016,38.338377 0,-76.676754 z"
              inkscape:transform-center-x="-12.725526"
              transform="matrix(1.1498276,0,0,0.99234747,-2.3349122,0.26613341)"
              inkscape:transform-center-y="-1.699616e-06"
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
    max-width: 40px;
    max-height: 40px;
    min-width: 40px;
    min-height: 40px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    svg {
      width: 16px;
      height: 20px;
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
