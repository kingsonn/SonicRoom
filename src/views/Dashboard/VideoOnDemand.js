import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import Hls from "hls.js";
import * as three from "three";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import * as THREE from 'three'

const shallPlayAudio = false;
const scaleFactor = 0.1;

// function VideoText() {
//     const [video] = useState(() => Object.assign(document.createElement('video'), { src: 'https://cdn.livepeer.com/asset/932bu2o7n0ufwad2/video', crossOrigin: 'Anonymous', loop: true }))
//     // useEffect(() => void (clicked && video.play()), [video, clicked])
//     return (
//       <Text font="/Inter-Bold.woff" fontSize={3} letterSpacing={-0.06} {...props}>
//         drei
//         <meshBasicMaterial toneMapped={false}>
//           <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
//         </meshBasicMaterial>
//       </Text>
//     )
//   }

const VideoCube = () => {
  const [vod, setVod] = useState([])
    useEffect(()=>{
        getVod()
    },[])
    async function getVod(){
        
        
          const url = await axios({
            
              url: `https://livepeer.com/api/asset/${dat}`,
              method: "GET",
              headers: {
                authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc"
              },
            })
         
        console.log(url)
        setVod(url)
        
      }
      
      const [play, setPlay]= useState(false)
        const textures = vod.map((vid)=>{
          const videoElement = document.createElement("video");
          // console.log(post[i][2])
          videoElement.load()
          videoElement.src = vid
          videoElement.crossOrigin = "Anonymous";
          videoElement.loop = true;
          videoElement.muted = true;
          videoElement.volume = 0.2;
        
          // videoElement.poster= post[i][2]
          // if(play){
          //   videoElement.play();
          // }
          // if(!play){
          //   videoElement.pause()
          // }
          // videoElement.autoplay=true
          
        return videoElement
    })
 
    // const [video] = useState(() => Object.assign(document.createElement('video'), { src: 'https://cdn.livepeer.com/asset/e61fgb26em53frak/video', crossOrigin: 'Anonymous', loop: true }))
    // useEffect(() => void (video.play()), [video])
  return textures.map((v, i)=>{
    return (
      <mesh 
      key={i}
      onPointerOver={()=> {
        textures[i].play()
        textures[i].muted=false
      }}
      onPointerOut={()=> {
        textures[i].pause()
        textures[i].muted=true
      }}
      // rotation={[0,1.5,0]} 
      rotation={[0,1.5,0]}
      position={[-60,5,-10.45+i*30]} >
        <planeBufferGeometry
          args={[180 * scaleFactor, 100 * scaleFactor,]}
        />
         <meshBasicMaterial >
        <videoTexture attach="map" args={[v]}  />
        </meshBasicMaterial>
      </mesh>
    );
  })
  
};

const VideoOnDemand = () => {
  
  return (
    <>
     <pointLight intensity={1.0} position={[5, 3, 5]} />
      <VideoCube />
    </>
  );
};


  
export default VideoOnDemand;



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
