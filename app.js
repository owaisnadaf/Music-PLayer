console.log("Welcome to the Music Player");
// let URLs = `http://127.0.0.1:5500/Songs/${folder}`;
let currSong = new Audio();
let songs;
let songUL;
let currfolder;
const playMusic = (track) => {
   currSong.src = `${currfolder}` + track;
   console.log(currSong)
   currSong.play();
   play.src = "pause.svg";
   document.querySelector(".songInfo").innerHTML = track;
}

function secondsToMinutesSeconds(seconds) {
   // Calculate minutes and remaining seconds
   let minutes = Math.floor(seconds / 60);
   let remainingSeconds = (seconds % 60).toFixed(0);

   // Format the result as a string
   let result = `${minutes}: ${remainingSeconds}`;

   return result;
}


//Getting the songs
async function getSongs(folder) {
   currfolder = folder;
   let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
   let response = await a.text();
   
  
   let div = document.createElement("div");
   div.innerHTML = response;
   console.log(response)
   let as = div.getElementsByTagName("a");
   

   songs = [];
      for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split("/Songs/")[1]);
      }
   }
   
   return songs;
}


async function main() {
    songs = await getSongs(`Songs/ncs/`);
 
   //Show all the songs in the playlist
   songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
   for (let song of songs) {
      songUL.innerHTML = songUL.innerHTML + `<li>
   <img class="invert " src="music-note-03-stroke-rounded.svg" alt="">
   <div class="info">
       <div class="songName" >  ${song.replaceAll("%20", " ")}</div>
       <div class="singer">Arijit Singh</div>
   </div>
   <div class="playnow">
     <span>Play Now</span>
     <img class="invert" src="play.svg" alt="">
   </div>
</li>`;
   }  

   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", elements => {
         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      })
   })

   play.addEventListener("click", () => {
      if (currSong.paused) {
         currSong.play();
         play.src = "pause.svg";
      }
      else {
         currSong.pause();
         play.src = "play.svg";
      }
   })

   currSong.addEventListener("timeupdate", () => {
      document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)} /${secondsToMinutesSeconds(currSong.duration)} `;
      document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
   })

   // Add an event listener to seekbar
   document.querySelector(".seekbar").addEventListener("click", e => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currSong.currentTime = ((currSong.duration) * percent) / 100
   })
   // Add an event listener to hamburger
   document.querySelector(".hamburger").addEventListener("click", () => {
      document.querySelector(".close").style.display = "inline"
      document.querySelector(".left").style.left = "0%";
      document.querySelector(".left").style.width = "75vw";
   })
   // Add an event listener to close
   document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-100%";
      document.querySelector(".left").style.width = "24vw";
      // document.querySelector(".left").style.width = "";
   })

   prev.addEventListener("click", () => {
      let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
      if ((index - 1)>0) {
         playMusic(songs[index - 1].replaceAll("%20"," "))
      }
   })
   next.addEventListener("click", () => {
      let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
      if ((index + 1)<songs.length) {
         playMusic(songs[index + 1].replaceAll("%20"," "));
      }
   })
   
   document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
      currSong.volume = parseInt(e.target.value)/100;
   })
}
main();