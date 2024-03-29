let videoElement = document.querySelector("video");
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click");
let filterArr = document.querySelectorAll(".filter");
let filterOverlay = document.querySelector(".filter_overlay");
let timings = document.querySelector(".timing");
let filterColor="";
let counter=0;
let clearObj;

// constraits define the access we need from out device on that browser
// for eg for stream we need access of camera and audio in our browser
let constrait = {
    audio: true,
    video: true
}

// in future the recording will be saved here
let recording = [];
// this object will represnt the recording 
let mediarecordingObjectForCurrStream;

let isRecording = false;

//Navigator is an inbuilt API which is represnts a browser.
// getUserMedia is used to get the stream from user it and it returns a promise.
// Stream denotes the audio and video we are getting from the user 
// Promise for the stream
let userMediaPromise = navigator.mediaDevices.getUserMedia(constrait);
userMediaPromise.then(function (stream) {
    // setting our stream to audio and video elements
    // By adding srcObj we are setting the src of these tags
    videoElement.srcObject = stream;
    // audioElement.srcObject = stream;

    //to record the stream and download it

    // we are aking an object which denotes the recording
    // mediaRecorder is used for recording
    mediarecordingObjectForCurrStream = new MediaRecorder(stream);
    // recording is sent in chunks not as a whole so whenever we have some chunk dataavailable event is triggered
    mediarecordingObjectForCurrStream.ondataavailable = function (e) {
        // so when dataavilable is triggered we push that chunk to our recording array
        recording.push(e.data);
    }

    // to download video
    // stop event is provided by mediarecordingObjectForCurrStream when this happens the recording is stoped.We are calling it in the below code
    // and then we are downloading that video
    mediarecordingObjectForCurrStream.addEventListener("stop", function () {
        //recording->url
        // type->MIME type
        const blob = new Blob(recording, { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.download = "file.mp4";
        a.href = url;
        a.click();
        recording = [];
    })
})
    .catch(function (err) {
        console.log(err);
        alert("Allow access")
    })

recordBtn.addEventListener("click", function () {
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }

    if (isRecording == false) {
        // start() is provided by mediarecordingObjectForCurrStream when we call it recording start.
        mediarecordingObjectForCurrStream.start();
        // recordBtn.innerText = "recording";
        recordBtn.classList.add("record-animation");
        startTimer();
    }
    else {
        // stop() is provided by mediarecordingObjectForCurrStream when we call it recording stops.
        mediarecordingObjectForCurrStream.stop();
        // recordBtn.innerText = "record";
        recordBtn.classList.remove("record-animation");
        stopTimer();
    }
    isRecording = !isRecording
})

captureImgBtn.addEventListener("click",function(){
    console.log("clicked")
    let canvas=document.createElement("canvas");
    canvas.height=videoElement.videoHeight;
    canvas.width=videoElement.videoWidth;
    let tool=canvas.getContext("2d");
    tool.drawImage(videoElement,0,0);
    if(filterColor){
        tool.fillStyle=filterColor;
        tool.fillRect(0, 0,canvas.width,canvas.height);
    }
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.download="file.png";
    a.href=url;
    a.click();
    a.remove();
})

for(let i=0;i<filterArr.length;i++){
    filterArr[i].addEventListener("click",function(){
        filterColor = filterArr[i].style.backgroundColor;
        filterOverlay.style.backgroundColor = filterColor;
    })
}

function startTimer(){
    timings.style.display="block";

    function fn(){
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timings.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }

    clearObj=setInterval(fn,1000);
}

function stopTimer(){
    timings.style.display="none";
    clearInterval(clearObj);
}