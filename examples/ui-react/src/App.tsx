import { init } from "manitas";
import { GestureEvent, AirfingerEvent } from "manitas";
import { useEffect, useRef } from "react";
import { useSprings, animated, to } from "@react-spring/web";
import styles from "./styles.module.css";
import { contains, inScreen, rectRelativeToParent } from "./geometry";
import confetti from "canvas-confetti";
import { Instructions } from "./Instructions";

const AREA_WIDTH = 1200;
const AREA_HEIGHT = 960;

function interpolateZoom(z: number) {
  const x1 = 0.05;
  const x2 = -0.2;
  const y1 = 0.4;
  const y2 = 3;
  const raw = y1 + ((z - x1) * (y2 - y1)) / (x2 - x1);
  return zoomClamp(raw, y1, y2);
}

function zoomClamp(raw: number, min: number, max: number) {
  if (raw < min) {
    return min;
  }
  if (raw > max) {
    return max;
  }
  return raw;
}

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number, z: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s * z})`;
//const cards = ["./Chev.mp4", "/Voyage.mp4", "/UD_1.mp4"];
const cards = ["./Chev.mp4"]; //, "/Voyage.mp4", "/UD_1.mp4"];

// Who knows the type here TBH
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
  const selectedRight = useRef<HandStatus>({
    card: null,
    lastCard: null,
    gesture: null,
    zoomPosition: null,
  });
  const selectedLeft = useRef<HandStatus>({
    card: null,
    lastCard: null,
    gesture: null,
    zoomPosition: null,
  });
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>();
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
        delay: 0,
        velocity: 100,
      },
    },
  }));

  const gestureStarted = (e: GestureEvent) => {
    const { gesture } = e.detail;
    const selected = e.detail.hand === "right" ? selectedRight : selectedLeft;
    selected.current.gesture = gesture;
    if (gesture === "ILoveYou") {
      selected.current.gesture = gesture;
      const cardIdx = selected.current.lastCard;
      if (cardIdx !== null) {
        const video = cardsRef.current[cardIdx]
          ?.children[0] as HTMLVideoElement;
        if (!video.paused && !video.ended && video.readyState > 2) {
          video.pause();
        } else {
          video.play();
        }
      }
    }
    if (gesture === "Thumb_Up") {
      const cardIdx = selected.current.lastCard;
      api.start((i) => {
        if (i === cardIdx) {
          return {
            to: { y: -700 },
          };
        }
      });
    }
    if (gesture === "Thumb_Down") {
      const cardIdx = selected.current.lastCard;
      api.start((i) => {
        if (i === cardIdx) {
          return {
            to: { y: +900 },
          };
        }
      });
    }
    if (gesture === "Victory") {
      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        scalar: 2,
        origin: {
          x: ((1 - e.detail.airpoint.x) * AREA_WIDTH) / window.innerWidth,
          y: e.detail.airpoint.y + 0.2,
        },
      });
    }
  };
  const gestureEnded = (e: GestureEvent) => {
    const { gesture } = e.detail;
    const selected = e.detail.hand === "right" ? selectedRight : selectedLeft;
    selected.current.gesture = gesture;
  };

  const gestureMove = (e: GestureEvent) => {
    const selected = e.detail.hand === "right" ? selectedRight : selectedLeft;
    if (selected.current.gesture === "Open_Palm") {
      api.start((i) => {
        if (i === selected.current.lastCard) {
          const zoom = Math.abs(interpolateZoom(e.detail.airpoint.z));
          return {
            to: {
              zoom,
            },
          };
        }
      });
    }
  };

  const airfingerStarted = (e: AirfingerEvent) => {
    api.start((i) => {
      const el = cardsRef.current[i];
      const parentel = containerRef.current;
      if (el === null || !parentel) {
        return {};
      }
      const rect = rectRelativeToParent(
        el.getBoundingClientRect(),
        parentel.getBoundingClientRect()
      );
      if (contains(rect, inScreen(e.detail.airpoint))) {
        if (e.detail.hand === "left") {
          selectedLeft.current.card = i;
        } else {
          selectedRight.current.card = i;
        }
      }
    });
  };

  const airfingerMove = (e: AirfingerEvent) => {
    api.start((i) => {
      const hand = e.detail.hand;
      const selected = hand === "right" ? selectedRight : selectedLeft;
      if (i === selected.current.card) {
        return {
          to: {
            x: inScreen(e.detail.airpoint).x - AREA_WIDTH / 2,
            y: inScreen(e.detail.airpoint).y - AREA_HEIGHT / 2,
            scale: 1.2,
          },
        };
      }
    });
  };
  const airfingerEnded = (e: AirfingerEvent) => {
    const hand = e.detail.hand;
    const selected = hand === "right" ? selectedRight : selectedLeft;
    if (selected.current.card !== null) {
      selected.current.lastCard = selected.current.card;
    }
    selected.current.card = null;
    api.start((i) => {
      return {
        to: {
          scale: 1,
        },
      };
    });
  };

  useEffect(() => {
    init();
    subscribe("gesturestart", gestureStarted);
    subscribe("gestureend", gestureEnded);
    subscribe("gesturemove", gestureMove);
    subscribe("airfingerstart", airfingerStarted);
    subscribe("airfingerend", airfingerEnded);
    subscribe("airfingermove", airfingerMove);

    return () => {
      unsubscribe("gesturestart", gestureStarted);
      unsubscribe("gestureend", gestureEnded);
      unsubscribe("gesturemove", gestureMove);
      unsubscribe("airfingerstart", airfingerStarted);
      unsubscribe("airfingerend", airfingerEnded);
      unsubscribe("airfingermove", airfingerMove);
    };
  }, []);

  return (
    <>
      <center>
        <h1>Manitas React Example</h1>
      </center>
      <div className={styles.center}>
        <video
          id="webcam"
          autoPlay
          playsInline
          //        style={{ position: "absolute", filter: "sepia(100%)" }}
          className={styles.cam}
        />
        <div
          className={styles.container}
          style={{ width: `${AREA_WIDTH}px`, height: `${AREA_HEIGHT}px` }}
          ref={(el) => (containerRef.current = el)}
        >
          <div className={styles.deck}>
            {aniprops.map((style, idx) => (
              <animated.div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                style={{
                  x: style.x,
                  y: style.y,
                  transform: to([style.rot, style.scale, style.zoom], trans),
                }}
              >
                <video src={cards[idx]} playsInline loop />
              </animated.div>
            ))}
          </div>
        </div>
      </div>
      <center>
        <Instructions />
      </center>
    </>
  );
}

export default App;
