//import { continueStroke, startStroke } from "./brush";
import vision from "@mediapipe/tasks-vision";

const { GestureRecognizer, FilesetResolver } = vision;

const runningMode = "VIDEO";
const videoHeight = "720px";
const videoWidth = "960px";

// Before we can use GestureRecognizer class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function load() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });

  return gestureRecognizer;
}

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function init() {
  const gestureRecognizer: vision.GestureRecognizer = await load();
  const { video, canvasCtx } = setupElements();
  if (!video || !canvasCtx) {
    // TODO: Actually create
    console.warn("Unable to create auxiliary elements");
    return;
  }
  const userMedia = checkUserMedia();
  if (!userMedia) {
    console.warn("getUserMedia() is not supported by your browser");
    return;
  }
  getUserMedia(video, () => run(video, canvasCtx, gestureRecognizer));
}

function run(
  video: HTMLVideoElement,
  canvasCtx: CanvasRenderingContext2D,
  gestureRecognizer: vision.GestureRecognizer
) {
  const canvasElement = canvasCtx.canvas;
  canvasElement.style.height = videoHeight;
  video.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  video.style.width = videoWidth;
  runContinously(video, canvasCtx, gestureRecognizer);
}

function runContinously(
  video: HTMLVideoElement,
  canvasCtx: CanvasRenderingContext2D,
  gestureRecognizer: vision.GestureRecognizer
) {
  function go() {
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

    console.log(results);
    //if (results.gestures) {
    //  if (results.gestures[0]) {
    //    const gesture = results.gestures;
    //    gesture.forEach((gesture) => {
    //      if (gesture[0].score > 0.7) {
    //        if (gesture[0].categoryName === "Thumb_Down") {
    //          canvasCtx.clearRect(0, 0, 960, 720);
    //        }
    //      }
    //    });
    //  }
    //}

    window.requestAnimationFrame(go);
  }
  go();
}

function getUserMedia(video: HTMLVideoElement, onSuccess: () => void) {
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    console.log(stream);
    video.srcObject = stream;
    video.addEventListener("loadeddata", () => {
      console.log("event");
      console.log("callong on success");
      onSuccess();
    });
  });
}

function setupElements() {
  const video = document.getElementById("webcam") as HTMLVideoElement;
  const canvasElement = document.getElementById(
    "output_canvas"
  ) as HTMLCanvasElement;
  const canvasCtx = canvasElement.getContext("2d");
  return { video, canvasCtx };
}

function checkUserMedia() {
  return hasGetUserMedia();
}
