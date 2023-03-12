import { init } from "manitas";
import { GestureEvent, AirfingerEvent, Point3D } from "manitas";
import { useEffect, useRef } from "react";
import { useSprings, animated, to } from "@react-spring/web";
import styles from "./styles.module.css";

function inScreen(point: Point3D) {
  return {
    x: point.x * 1280,
    y: point.y * 960,
    z: point.z,
  };
}

function contains(rect: DOMRect, point: Point3D) {
  return (
    rect.left < point.x &&
    rect.right > point.x &&
    rect.top < point.y &&
    rect.bottom > point.y
  );
}

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number, z: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s * z})`;
const cards = ["/UD_1.mp4", "/Voyage.mp4", "./Chev.mp4"];

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

interface Point2D {
  x: number;
  y: number;
}
interface HandStatus {
  card: number | null;
  lastCard: number | null;
  gesture: string | null;
  zoomPosition: Point2D | null;
}

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
  const cardsRef = useRef<(HTMLDivElement | HTMLVideoElement | null)[]>([]);
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
        video.play();
      }
    }
    if (gesture === "Thumb_Up") {
      const cardIdx = selected.current.lastCard;
      api.start((i) => {
        if (i === cardIdx) {
          return {
            to: { y: -500 },
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
  };
  const gestureEnded = (e: GestureEvent) => {
    const { gesture } = e.detail;
    const selected = e.detail.hand === "right" ? selectedLeft : selectedRight;
    selected.current.gesture = gesture;
    if (gesture === "ILoveYou") {
      const cardIdx = selected.current.lastCard;
      if (cardIdx !== null) {
        const video = cardsRef.current[cardIdx]
          ?.children[0] as HTMLVideoElement;
        video.pause();
      }
    }
  };
  function distance(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p2.y - p2.y, 2));
  }
  function center(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return { x: p1.x + (p1.x - p2.x) / 2, y: p1.y + (p1.y - p2.y) / 2 };
  }

  const gestureMove = (e: GestureEvent) => {
    const selected = e.detail.hand === "right" ? selectedLeft : selectedRight;
    if (
      selectedRight.current.gesture === "Open_Palm" &&
      selectedLeft.current.gesture === "Open_Palm"
    ) {
      selected.current.zoomPosition = e.detail.airpoint;
      if (e.detail.hand !== "right") {
        return;
      }
      api.start((i) => {
        const selected = selectedRight;
        if (
          i === selected.current.lastCard &&
          selectedRight.current.zoomPosition &&
          selectedLeft.current.zoomPosition
        ) {
          const zoom = distance(
            selectedRight.current.zoomPosition,
            selectedLeft.current.zoomPosition
          );
          return {
            to: {
              zoom: 5 * zoom,
            },
          };
        }
      });
    }
  };
  const airfingerStarted = (e: AirfingerEvent) => {
    api.start((i) => {
      const el = cardsRef.current[i];
      if (el === null) {
        return {};
      }
      const rect = el.getBoundingClientRect();
      //console.log(rect, inScreen(e.detail.airpoint));
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
            x: inScreen(e.detail.airpoint).x - 960 / 2,
            y: inScreen(e.detail.airpoint).y - 720 / 2,
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
    <div>
      <video
        id="webcam"
        autoPlay
        playsInline
        //        style={{ position: "absolute", filter: "sepia(100%)" }}
        className={styles.cam}
      />
      <div className={styles.container}>
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
  );
}

export default App;
