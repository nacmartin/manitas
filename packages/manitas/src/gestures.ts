import vision from "@mediapipe/tasks-vision";
import { emitGestures, emitAirfingers } from "./events";
import type { HandsState, HandState, ManitasConfig } from "./types";

const { GestureRecognizer, FilesetResolver } = vision;

const defaultConfig: ManitasConfig = {
  gestureThreshold: 0.6,
  handednessThreshold: 0.8,
  activeThreshold: -0.1,
  videoHeight: "960px",
  videoWidth: "1280px",
  videoId: "webcam",
  delegate: "GPU",
  modelAssetPath:
    "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
  mediapipeWasmPath:
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
};

// Before we can use GestureRecognizer class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function load(config: ManitasConfig) {
  const vision = await FilesetResolver.forVisionTasks(config.mediapipeWasmPath);

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: config.modelAssetPath,
      //delegate: config.delegate,
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  return gestureRecognizer;
}

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function init(userConfig: Partial<ManitasConfig> = {}) {
  const config: ManitasConfig = { ...defaultConfig, ...userConfig };
  const gestureRecognizer: vision.GestureRecognizer = await load(config);
  const { video } = setupElements(config.videoId);
  if (!video) {
    // TODO: Actually create
    console.warn("Unable to create auxiliary elements");
    return;
  }
  const userMedia = checkUserMedia();
  if (!userMedia) {
    console.warn("getUserMedia() is not supported by your browser");
    return;
  }
  getUserMedia(video, () => run(video, gestureRecognizer, config));
}

function run(
  video: HTMLVideoElement,
  gestureRecognizer: vision.GestureRecognizer,
  config: ManitasConfig
) {
  video.style.height = config.videoHeight;
  video.style.width = config.videoWidth;
  video.style.transform = "scaleX(-1)";
  runContinously(video, gestureRecognizer, config);
}

function runContinously(
  video: HTMLVideoElement,
  gestureRecognizer: vision.GestureRecognizer,
  config: ManitasConfig
) {
  let state: HandsState = {
    leftHand: {
      present: false,
    },
    rightHand: {
      present: false,
    },
  };
  //let LAST_FRAME_TIME = 0;
  function go(TIME: number) {
    //let fps = 1 / ((performance.now() - LAST_FRAME_TIME) / 1000);
    //console.log(fps);

    //LAST_FRAME_TIME = TIME;
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

    const { gestures, landmarks, worldLandmarks, handednesses } = results;
    let rightHand: HandState = { present: false };
    let leftHand: HandState = { present: false };
    handednesses.forEach((hand, idx) => {
      const category: vision.Category = hand[0];

      if (category.score > config.handednessThreshold) {
        // Ugly: we flip hands because we need to flip video
        if (category.categoryName === "Left") {
          rightHand = assembleHandEstimation(
            gestures[idx],
            landmarks[idx],
            config
          );
        }
        if (category.categoryName === "Right") {
          leftHand = assembleHandEstimation(
            gestures[idx],
            landmarks[idx],
            config
          );
        }
      }
    });

    const newState: HandsState = {
      rightHand,
      leftHand,
    };
    compareStatesAndEmitEvents(state, newState);
    state = newState;

    window.requestAnimationFrame(go);
  }
  go(0);
}

function compareStatesAndEmitEvents(
  prevState: HandsState,
  nextState: HandsState
) {
  emitGestures(prevState.leftHand, nextState.leftHand, "left");
  emitGestures(prevState.rightHand, nextState.rightHand, "right");
  emitAirfingers(prevState.leftHand, nextState.leftHand, "left");
  emitAirfingers(prevState.rightHand, nextState.rightHand, "right");
}

function assembleHandEstimation(
  gestureCategory: vision.Category[],
  landmarks: vision.NormalizedLandmark[],
  config: ManitasConfig
): HandState {
  const gesture = bestGesture(gestureCategory, config.gestureThreshold);
  const active = isActive(landmarks, config.activeThreshold);
  return {
    gesture,
    present: true,
    active,
    position: landmarks[8],
  };
}

function isActive(
  landmark: vision.NormalizedLandmark[],
  activeThreshold: number
) {
  const indexFinger = landmark[8];
  return indexFinger.z < activeThreshold;
}

function bestGesture(category: vision.Category[], gestureThreshold: number) {
  for (let i = 0; i < category.length; i++) {
    const gesture = category[i];
    if (gesture.score > gestureThreshold && gesture.categoryName !== "None") {
      return gesture.categoryName;
    }
  }

  return null;
}

function getUserMedia(video: HTMLVideoElement, onSuccess: () => void) {
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", onSuccess);
  });
}

function setupElements(videoId: string) {
  const video = document.getElementById(videoId) as HTMLVideoElement;
  return { video };
}

function checkUserMedia() {
  return hasGetUserMedia();
}
