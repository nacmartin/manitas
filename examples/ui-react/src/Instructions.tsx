import thumbsDown from "./images/thumbs-down.png";
import thumbsUp from "./images/thumbs-up.png";
import ily from "./images/love-you-gesture.png";
import victoryHand from "./images/victory-hand.png";
import raisedHand from "./images/raised-hand.png";

export function Instructions() {
  return (
    <div style={{ width: 1280, margin: "0 auto", paddingBottom: 100 }}>
      <h2>WHAT is this</h2>
      This is an example of usage of{" "}
      <a
        href="
https://github.com/nacmartin/manitas
      "
      >
        manitas
      </a>{" "}
      with React.{" "}
      <a href="https://github.com/nacmartin/manitas">See the source code</a>.
      You can move your hands and point to the cards to move them and perform
      several actions, like making the Victory{" "}
      <img src={victoryHand} height="24px" /> gesture to throw some confetti.
      <h2>Usage</h2>
      <h3>Selecting/Moving</h3>
      <p>
        We can use AI (
        <a href="https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer">
          Google's Mediapipe
        </a>
        ) to recognize the position of our hands, but ¿what is the equivalent of
        "click" in this context?
      </p>
      <p>
        You can select videos by advancing your index relative to your wrist.
        So, in the following image, the left one is an event, and the right one
        is not.
      </p>
      <center>
        <p>
          <img
            src="https://user-images.githubusercontent.com/154258/224560435-988c4649-9ec6-46f2-90a9-57ba58871595.png"
            alt="hands"
            width={600}
          />
        </p>
      </center>
      <p>
        Also, note that the whole hand must be visible so the super turbo
        Machine Learning Google MediaPipe that we are using here can estimate
        correctly if your finger is part of a hand or is a piece of sausage
        coming from the sides.
      </p>
      <p>
        At the beginning it may be difficult, but after some minutes of practice
        this interface becomes quite natural. You probably don't remember, but
        learning to use a mouse is not easy either and needs practice as well. I
        said the previous sentence with the authority earned by teaching how to
        use computers to the elderly (including nuns) in the first years of the
        millenium.
      </p>
      <h3>Gestures</h3>
      <p>You can use some gestures:</p>
      <ul>
        <li>
          <img src={ily} height="24px" />: To play/stop last selected video.
        </li>
        <li>
          <img src={raisedHand} height="24px" />: To zoom in/out (Incline palm
          forward/backward in an angle with the wrist).
        </li>
        <li>
          <img src={thumbsUp} height="24px" />: Throw last selected video far
          away above the window.
        </li>
        <li>away below the window.</li>
        <li>
          <img src={thumbsDown} height="24px" />: Throw last selected video far
          away below the window.
        </li>
        <li>
          <img src={victoryHand} height="24px" />: Confetti!
        </li>
      </ul>
      <h2>Notes</h2>
      <p>
        We have configured mediapipe to use the GPU. It is possible to make it
        use the CPU. So if it doesn't work, that may be the reason.
      </p>
      <p>
        About mobile: this can made it work in mobile, but I haven't spent the
        time in making this web responsive and whatnot yet!
      </p>
    </div>
  );
}
