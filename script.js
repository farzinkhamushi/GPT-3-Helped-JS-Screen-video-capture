document.addEventListener('DOMContentLoaded', () => {
    let output = "";
    outputbutton.addEventListener('keyup', async () => {
        output = outputbutton.value;
        //alert("output : "+output);
    });
    const videoElement = document.getElementById('videoElement');
    const recordButton = document.getElementById('recordButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const downloadButton = document.getElementById('downloadButton');
    let mediaRecorder;
    let mediaStream;
    let recordedChunks = [];

    async function startRecording() {
      try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoElement.srcObject = mediaStream;
        recordedChunks = [];
        //mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp9' });


        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' });
          videoElement.srcObject = null;
          videoElement.src = URL.createObjectURL(blob);
          downloadButton.disabled = false;
          recordButton.disabled = false;
          pauseButton.disabled = true;
          stopButton.disabled = true;
        };

        mediaRecorder.start();
        recordButton.disabled = true;
        pauseButton.disabled = false;
        stopButton.disabled = false;
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }

    recordButton.addEventListener('click', () => {        
        pauseButton.style.display = "inline-block";
        stopButton.style.display = "inline-block";
        startRecording();
    });

    pauseButton.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        pauseButton.textContent = 'Resume';
      } else if (mediaRecorder && mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        pauseButton.textContent = 'Pause';
        pauseButton.style.backgroundColor = "#f8e8d5";
      }
    });

    stopButton.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        pauseButton.textContent = 'Pause';
        pauseButton.disabled = true;
        stopButton.disabled = true;
        pauseButton.style.backgroundColor = "#f8e8d5";
        stopButton.style.backgroundColor = "#f8e8d5";
        pauseButton.style.display = "none";
        stopButton.style.display = "none"
      }
    });

    downloadButton.addEventListener('click', () => {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      if(output.length>0){
        a.download = output+'.mp4';
      }else{
        a.download = 'screen_recording.mp4';
      }
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      /*
      recordedChunks = [];
      downloadButton.disabled = true;
      videoElement.src = '';
        */
       
    });
});