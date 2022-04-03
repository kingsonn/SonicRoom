import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import Hls from "hls.js";
import * as three from "three";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

const shallPlayAudio = false;
const scaleFactor = 0.1;

const VideoCube = ({playbackId}) => {
  const url =
    `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`;
  // video stuff
  const [video] = useState(() => {
    const videoElement = document.createElement("video");
    const hls = new Hls();

    videoElement.src = url;
    videoElement.crossOrigin = "Anonymous";
    videoElement.loop = true;
    videoElement.muted = !shallPlayAudio;
    videoElement.volume = 0.2;

    hls.loadSource(url);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.play();
    });

    return videoElement;
  });

  useEffect(() => {
    return function () {
      video?.pause();
      video?.remove();
    };
  });

  // cube stuff
  const cube = useRef();


  // this is a demo, so I'm not going to get all fancy by not having it
  // render on selected planes. So that means you're going to see stretchy
  // video on the top and bottom of the cube. I apologize for the inconvenience.
  // (not really though)
  return (
    <mesh position={[0,5,-14.45]} ref={cube}>
      <planeBufferGeometry
        args={[360 * scaleFactor, 200 * scaleFactor,]}
      />
      <meshStandardMaterial color="#ffffff">
        <videoTexture attach="map" args={[video]} />
      </meshStandardMaterial>
    </mesh>
  );
};

const LiveVideo = ({playbackId}) => {
  
  return (
    <>
     <pointLight intensity={1.0} position={[5, 3, 5]} />
      <VideoCube playbackId={playbackId}/>
    </>
  );
};


  
export default LiveVideo;



// import { Suspense, useEffect, useRef, useState } from "react";
// import { Canvas, useFrame } from "react-three-fiber";
// import { Stats, OrbitControls } from "@react-three/drei";
// import Hls from "hls.js";
// import * as three from "three";
// import "./styles.css";

// // THANK YOU FOR TAKING A LOOK AT MUX!
// // BY WAY OF THANKS, SET THIS TO `TRUE` FOR SMOOTH ELEVATOR MUSIC.
// // n.b.: might play double audio in codesandbox. web browsers are weird! -Ed
// const shallPlayAudio = false;
// const scaleFactor = 0.1;
// const url =
//   "https://cdn.livepeer.com/hls/f173mn805rk3283v/index.m3u8";

// const VideoCube = () => {
//   // video stuff
//   const [video] = useState(() => {
//     const videoElement = document.createElement("video");
//     const hls = new Hls();

//     videoElement.src = url;
//     videoElement.crossOrigin = "Anonymous";
//     videoElement.loop = true;
//     videoElement.muted = !shallPlayAudio;
//     videoElement.volume = 0.2;

//     hls.loadSource(url);
//     hls.attachMedia(videoElement);
//     hls.on(Hls.Events.MANIFEST_PARSED, () => {
//       videoElement.play();
//     });

//     return videoElement;
//   });

//   useEffect(() => {
//     return function () {
//       video?.pause();
//       video?.remove();
//     };
//   });

//   // cube stuff
//   const cube = useRef<three.Mesh>();

//   useFrame(() => {
//     if (cube.current) {
//       cube.current.rotation.x += 0.01;
//       cube.current.rotation.y += 0.01;
//     }
//   });

//   // this is a demo, so I'm not going to get all fancy by not having it
//   // render on selected planes. So that means you're going to see stretchy
//   // video on the top and bottom of the cube. I apologize for the inconvenience.
//   // (not really though)
//   return (
//     <mesh ref={cube}>
//       <boxBufferGeometry
//         args={[16 * scaleFactor, 9 * scaleFactor, 16 * scaleFactor]}
//       />
//       <meshStandardMaterial color="#ffffff">
//         <videoTexture attach="map" args={[video]} />
//       </meshStandardMaterial>
//     </mesh>
//   );
// };

// const Scene = () => {
//   // the lighting is just the r3f default light and the material is
//   // extremely default, so you'll get some video pop at angles. It's
//   // cool though, your app won't do this. right? ;)
//   return (
//     <>
//       <gridHelper />
//       <axesHelper />
//       <pointLight intensity={1.0} position={[5, 3, 5]} />
//       <VideoCube />
//     </>
//   );
// };

// const App = () => {
//   return (
//     <div
//       style={{
//         height: "100vh",
//         width: "100vw"
//       }}
//     >
//       <Canvas
//         concurrent
//         camera={{
//           near: 0.1,
//           far: 1000,
//           zoom: 1
//         }}
//         onCreated={({ gl }) => {
//           gl.setClearColor("#27202f");
//         }}
//       >
//         <Stats />
//         <OrbitControls />
//         <Suspense fallback={null}>
//           <Scene />
//         </Suspense>
//       </Canvas>
//       <div
//         style={{
//           position: "absolute",
//           right: "0px",
//           bottom: "00px",
//           background: "#ffffff",
//           color: "#000000"
//         }}
//       >
//         <img
//           alt="Powered by Mux Video"
//           src="https://mux.com/files/mux-video-logo-square.png"
//           style={{ width: "120px" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default App;
