import React, { useRef } from "react";
import "./styles.css";
import NotificationSound from "./notif.wav";
const { notification , setNotification } = ChatState();
import { useToast } from "@chakra-ui/react";
export default function App() {
  const toast = useToast();
  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }
  useEffect(() => {
    playAudio();
  }, [notification]);
  return (
    <div className="App">
    </div>
  );
}
