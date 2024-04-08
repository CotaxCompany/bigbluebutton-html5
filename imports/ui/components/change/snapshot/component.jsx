import React, { useRef, useEffect } from 'react';
import SlideSnapshotComponent from "./styles";

function SlideSnapshotContainer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        });
    }
  }, []);

  const captureSlide = e => {
    const ancestorElement = e.currentTarget.parentNode.parentNode; // 이벤트 핸들러 내에서 video 태그를 찾습니다.
    const video = ancestorElement.querySelector('video'); // 해당 요소 내의 첫 번째 video 태그를 찾습니다.
    
    if (video) { // video가 성공적으로 찾아졌다면 여기서 추가 작업을 수행할 수 있습니다.
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "capture.png";
      a.click();
    } else { // video 태그를 찾지 못했다면, 오류 메시지 또는 다른 로직을 실행할 수 있습니다.
      console.log('버튼이 클릭됨, video 태그를 찾지 못함');
    }
  }

  return (
    <div style={{ position : "relative", top : '5%' }}>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <SlideSnapshotComponent onClick={captureSlide} style={{ marginLeft: '-71px', marginTop: '14px' }} />
    </div>
  );
};

export default SlideSnapshotContainer;