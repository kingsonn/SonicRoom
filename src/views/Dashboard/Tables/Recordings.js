import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import Hls from "hls.js";
import * as three from "three";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

// THANK YOU FOR TAKING A LOOK AT MUX!
// BY WAY OF THANKS, SET THIS TO `TRUE` FOR SMOOTH ELEVATOR MUSIC.
// n.b.: might play double audio in codesandbox. web browsers are weird! -Ed
const shallPlayAudio = false;
const scaleFactor = 0.1;

const VideoCube = (recordingId) => {
  
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
const [ loadVid, setLoadVid] = useState(false)
const [play, setPlay]= useState(false)
// const [ loadVid, setLoadVid] = useState(false)
const textures = recordingId.map((vid)=>{
    
    const videoElement = document.createElement("video");
        const hls = new Hls();
        videoElement.src = vid.recordingUrl;
        videoElement.crossOrigin = "Anonymous";
        videoElement.loop = true;
        videoElement.muted = !shallPlayAudio;
        videoElement.volume = 0.2;
        // videoElement.autoplay= true;
        hls.loadSource(vid.recordingUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if(play){
            videoElement.play();
          }
          if(!play){
            videoElement.pause()
          }
            // videoElement.onclick= videoElement.play()
           
        });
    
        return videoElement;
      
})

 
  return textures.map((dat,i)=>{

    return (
        <mesh key={i} 
        onPointerOver={()=> {
          textures[i].play()
          textures[i].muted = false
        }}
        onPointerOut={()=> {
          textures[i].pause()
          textures[i].muted=true
        }}
          position={[60,5,-10.45+i*10]} >
          <planeBufferGeometry
            args={[180 * scaleFactor, 100 * scaleFactor,]}
          />
          <meshStandardMaterial color="#ffffff">
            <videoTexture attach="map" args={[dat]} />
          </meshStandardMaterial>
        </mesh>
      );
  })
};

const Recordings = (recordingId) => {
  
  return (
    <>
     <pointLight intensity={1.0} position={[5, 3, 5]} />
      <VideoCube />
    </>
  );
};


  
export default Recordings;




