<div align="center">
<h1> ☝️☝️ <br/>
Manitas</h1>
Move your fingers in the air to interact with computers
</div>
<br/><br/><br/>

Hi 👋!

This is a library that uses AI ([Google's Mediapipe](https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer)) to recognize
the position of fingers recorded from a webcam and emits HTML events similar to mouse or touch events (mousedown, mousemove, touchstart, touchmove, ...),
so we can use our fingers to interact with a web.

<div align="center">
<video src="https://user-images.githubusercontent.com/154258/224558658-852015d9-ce86-4663-8c4a-f76588997151.mp4"></video>
</div>

# Getting started

```
npm install manitas
```

```js
import { init } from "manitas";


// In some async function
await init();
```
And then you can listen to these events:
```js
document.addEventListener('gesturestart', listener);
document.addEventListener('gesturemove', listener);
document.addEventListener('gestureend', listener);
document.addEventListener('airfingerstart', listener);
document.addEventListener('airfingermove', listener);
document.addEventListener('airfingerend', listener);
```



