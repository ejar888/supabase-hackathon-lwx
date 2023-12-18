"use client";

import React, { useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./detector";

const inputResolution = {
  width: 350,
  height: 350,
};

const videoConstraints = {
  facingMode: "user",
};

export function Camera({ children, onFaceDetected }) {
  const [video, setVideo] = useState(false);

  const handleVideoLoad = (videoNode) => {
    if (video) return;
    const videoTarget = videoNode.target;
    if (videoTarget.readyState !== 4) return;
    runDetector(videoTarget, { onFaceDetected });
    setVideo(videoTarget);
  };

  return (
    <Webcam
      width={inputResolution.width}
      height={inputResolution.height}
      style={{
        maxWidth: "100%",
      }}
      videoConstraints={videoConstraints}
      onLoadedData={handleVideoLoad}
      audio={false}
      screenshotFormat="image/jpeg"
    >
      {children &&
        ((props) => {
          const getFace = () => runDetector(video);
          return children({ ...props, getFace });
        })}
    </Webcam>
  );
}
