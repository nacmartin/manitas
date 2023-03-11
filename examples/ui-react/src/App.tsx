import { init } from "manitas";
import { GestureEvent, AirfingerEvent } from "manitas";
import { useEffect, useRef } from "react";
import { useSprings, useSpringRef, animated, to } from "@react-spring/web";
import styles from "./styles.module.css";
console.log(styles);

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number, z: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s + z})`;
const cards = [
  "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
];

function subscribe(eventName: string, listener: (e: any) => void) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: (e: any) => void) {
  document.removeEventListener(eventName, listener);
}

const tospring = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  zoom: 1,
  delay: i * 100,
  rot: -10 + Math.random() * 20,
});

function App() {
  const selected = useRef<number>(null);
  const [aniprops, api] = useSprings(cards.length, (i) => ({
    to: { ...tospring(i) },
    from: {
      x: 0,
      rot: 0,
      y: 10,
      scale: 1,
      zoom: 1,
      config: {
        mass: 1,
        friction: 10,
        tension: 100,
        delay: 1,
        velocity: 100,
      },
    },
  }));

  const gestureStarted = (e: GestureEvent) => {
    //console.log(e);
  };
  const gestureEnded = (e: GestureEvent) => {
    //console.log(e);
  };
  const airfingerStarted = (e: AirfingerEvent) => {
    api.start({
      to: {
        scale: 5,
      },
    });
  };
  const airfingerMove = (e: AirfingerEvent) => {
    api.start({
      to: {
        x: e.detail.airpoint.x * 960,
        y: e.detail.airpoint.y * 720 - 80,
        scale: 1.5,
      },
    });
  };
  const airfingerEnded = (e: any) => {
    api.start({
      to: {
        scale: 1,
      },
    });
  };
  useEffect(() => {
    init();
    subscribe("gesturestart", gestureStarted);
    subscribe("gestureend", gestureEnded);
    subscribe("airfingerstart", airfingerStarted);
    subscribe("airfingerend", airfingerEnded);
    subscribe("airfingermove", airfingerMove);

    return () => {
      unsubscribe("gesturestart", gestureStarted);
      unsubscribe("gestureend", gestureEnded);
      unsubscribe("airfingerstart", airfingerStarted);
      unsubscribe("airfingerend", airfingerEnded);
      unsubscribe("airfingermove", airfingerMove);
    };
  }, []);

  return (
    <div>
      <video
        id="webcam"
        autoPlay
        playsInline
        style={{ position: "absolute" }}
      />
      <div
        style={{
          position: "absolute",
          width: "960px",
          height: "720px",
        }}
      >
        <div className={styles.deck}>
          {aniprops.map((style, i) => {
            return (
              <animated.div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  opacity: 0.8,
                  x: style.x,
                  y: style.y,
                  transform: to([style.rot, style.scale, style.zoom], trans),
                  backgroundImage: `url(${cards[i]})`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
