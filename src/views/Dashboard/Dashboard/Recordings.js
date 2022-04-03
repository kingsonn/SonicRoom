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
const [play, setPlay]= useState(false)
const [ loadVid, setLoadVid] = useState(false)
const textures = data.map((vid)=>{
    
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
          textures[i].muted=false
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




const data=[
    {
        "lastSeen": 1648382070102,
        "isActive": false,
        "record": true,
        "suspended": false,
        "sourceSegments": 18,
        "transcodedSegments": 54,
        "sourceSegmentsDuration": 82.13400000000001,
        "transcodedSegmentsDuration": 246.40199999999996,
        "sourceBytes": 21751036,
        "transcodedBytes": 16391344,
        "id": "f1733111-29e7-49b3-9264-40843794fdbc",
        "kind": "stream",
        "name": "videorec+f173mn805rk3283v",
        "region": "sin",
        "userId": "3d24b498-ea73-489d-8d21-eda338f5b242",
        "parentId": "f173ba22-771a-4da7-945d-e6a06ded044c",
        "profiles": [
            {
                "fps": 30,
                "gop": "2.0",
                "name": "720p",
                "width": 1280,
                "height": 720,
                "bitrate": 2000000
            },
            {
                "fps": 30,
                "gop": "2.0",
                "name": "480p",
                "width": 854,
                "height": 480,
                "bitrate": 1000000
            },
            {
                "fps": 30,
                "gop": "2.0",
                "name": "360p",
                "width": 640,
                "height": 360,
                "bitrate": 500000
            }
        ],
        "createdAt": 1648381890109,
        "ingestRate": 0,
        "renditions": {},
        "outgoingRate": 0,
        "recordingStatus": "ready",
        "recordingUrl": "https://cdn.livepeer.com/recordings/f1733111-29e7-49b3-9264-40843794fdbc/index.m3u8",
        "mp4Url": "https://cdn.livepeer.com/recordings/f1733111-29e7-49b3-9264-40843794fdbc/source.mp4"
    },
    {
        "lastSeen": 1648382070102,
        "isActive": false,
        "record": true,
        "suspended": false,
        "sourceSegments": 18,
        "transcodedSegments": 54,
        "sourceSegmentsDuration": 82.13400000000001,
        "transcodedSegmentsDuration": 246.40199999999996,
        "sourceBytes": 21751036,
        "transcodedBytes": 16391344,
        "id": "f1733111-29e7-49b3-9264-40843794fdbc",
        "kind": "stream",
        "name": "videorec+f173mn805rk3283v",
        "region": "sin",
        "userId": "3d24b498-ea73-489d-8d21-eda338f5b242",
        "parentId": "f173ba22-771a-4da7-945d-e6a06ded044c",
        "profiles": [
            {
                "fps": 30,
                "gop": "2.0",
                "name": "720p",
                "width": 1280,
                "height": 720,
                "bitrate": 2000000
            },
            {
                "fps": 30,
                "gop": "2.0",
                "name": "480p",
                "width": 854,
                "height": 480,
                "bitrate": 1000000
            },
            {
                "fps": 30,
                "gop": "2.0",
                "name": "360p",
                "width": 640,
                "height": 360,
                "bitrate": 500000
            }
        ],
        "createdAt": 1648381890109,
        "ingestRate": 0,
        "renditions": {},
        "outgoingRate": 0,
        "recordingStatus": "ready",
        "recordingUrl": "https://cdn.livepeer.com/recordings/f1733111-29e7-49b3-9264-40843794fdbc/index.m3u8",
        "mp4Url": "https://cdn.livepeer.com/recordings/f1733111-29e7-49b3-9264-40843794fdbc/source.mp4"
    },
    
]