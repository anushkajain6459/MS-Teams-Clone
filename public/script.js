// -------JavaScript for frontend-------
const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

let myVideoStream;
// -- a web api that prompts the user for permission to use a media input..get media accepts the object
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true, // to get video
    audio: true,  // to get audio
  })
  .then((stream) => {   //means we have acess now
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    document.addEventListener("keydown", (e) => {
      if (e.which === 13 && chatInputBox.value != "") {
        socket.emit("message", chatInputBox.value);
        chatInputBox.value = "";
      }
    });

    socket.on("createMessage", (msg) => {
      console.log(msg);
      let li = document.createElement("li");
      li.innerHTML = msg;
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
    });
  });

peer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// CHAT

const connectToNewUser = (userId, streams) => {
  var call = peer.call(userId, streams);
  console.log(call);
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  // through this video would be played
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });
  //Adding the video..
  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const ShowChat=(e) =>{
  e.classList.toggle("active");
  document.body.classList.toggle("ShowChat");
};


document.getElementById('leave-meeting').addEventListener('click', () => {
  const redirect = confirm('Redirecting you to the home page...');

  if (redirect) {
  
    window.location = 'redirect/redirect.html';
  } 
});


// Onclick for theme change---
const toggle=document.getElementById('toggle');
const main= document.querySelector('.main');
console.log(toggle,main,myVideo)
toggle.addEventListener('click', () => {
  console.log(toggle.classList)
 if(main.classList.contains('main-toggle') && myVideo.classList.contains('main-toggle') ){
  main.classList.remove('main-toggle')
  myVideo.classList.remove('main-toggle')
 }

  else{
    main.classList.add('main-toggle')
    myVideo.classList.add('main-toggle')
  }

});

// onclick for video filter --grayscale
const grayscale=document.getElementById('grayscale');
console.log(myVideo)
grayscale.addEventListener('click', () => {
  console.log(grayscale.classList)
 if(myVideo.classList.contains('filter-grayscale') ){
  myVideo.classList.remove('filter-grayscale')
 }

  else{
    myVideo.classList.add('filter-grayscale')
  }

});

// onclick for video filter --contrast
const contrast=document.getElementById('contrast');
console.log(myVideo)
contrast.addEventListener('click', () => {
  console.log(contrast.classList)
 if(myVideo.classList.contains('filter-contrast') ){
  myVideo.classList.remove('filter-contrast')
 }

  else{
    myVideo.classList.add('filter-contrast')
  }

});

// onclick for video filter --sepia
const sepia=document.getElementById('sepia');
console.log(myVideo)
sepia.addEventListener('click', () => {
  console.log(sepia.classList)
 if(myVideo.classList.contains('filter-sepia') ){
  myVideo.classList.remove('filter-sepia')
 }

  else{
    myVideo.classList.add('filter-sepia')
  }

});