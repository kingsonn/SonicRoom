import {
  Flex,
  Grid,
  
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import bpic from './backg.jpg'
import cpic from '../../../../components/images/up1.jpg'
import pic from '../../Profile/profile.png'
// import { io } from 'socket.io-client'
import { MeshNormalMaterial, BoxBufferGeometry } from 'three'
// assets
// import scene from '../../../components/images/scene.gltf'
import { TextureLoader, RepeatWrapping, NearestFilter, LinearMipMapLinearFilter } from 'three';
import Card from "components/Card/Card.js";
import axios from 'axios'
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {Suspense, useState} from 'react'
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { Sky , Html, Text} from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import * as THREE from 'three'
import { Ground } from '../../../../components/Ground';
import Cubes from '../../../../components/Cubes';
import { Player } from '../../../../components/Player';
import { Hud } from '../../../../components/Hud';
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import Recordings from '../Recordings'
import Vod from '../Vod'
import Nfts from '../Nfts'
import React, {useEffect, useRef} from "react";
import LiveVideo from '../LiveVideo'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from '../CreatorProfileAbi.json'
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// const UserWrapper = ({ position}) => {
//   return (
//       <mesh
//           position={position}
          
//           geometry={new BoxBufferGeometry()}
//           material={new MeshNormalMaterial()}
//       >
//           {/* Optionally show the ID above the user's mesh */}
//           {/* <Text
//               position={[0, 1.0, 0]}
//               color="black"
//               anchorX="center"
//               anchorY="middle"
//           >
//               {id}
//           </Text> */}
//       </mesh>
//   )
// }
const Plane = () => {
  const ref = useRef()
  const img = useLoader(TextureLoader, pic)
  return (
    <group 
    onPointerOver={()=> {
      ref.current.visible=true
    }}
    onPointerOut={()=> {
      ref.current.visible=false
    }}
    position={[4,3,3]}>
    <mesh
    
      receiveShadow
  
    >
      
      <meshStandardMaterial map={img} attach="material"  />
      <planeBufferGeometry attach="geometry" args={[10, 10]}  />
    </mesh>
    <mesh
    visible={false}
    ref={ref}
    onClick={()=> console.log("hahaahh")}
      position={[5,1,4]}
      receiveShadow

      >
      <Text fontSize={1} color={"black"}> Myname is anthony gonsalves</Text>
      
      <meshStandardMaterial map={img} attach="material"  />
      <planeBufferGeometry attach="geometry" args={[3, 2]}  />
    </mesh>
    </group>
  );
};
function SkyBox() {
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    bpic,
    bpic,
    cpic,
    bpic,
    bpic,
    bpic
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}
const Build = ({ title}) => {
const [playbackId, setPlaybackId] = useState('')
const [recordingId, setRecordingId] = useState('')

const [isActive, checkIsActive] = useState('')
const [streamId, getStreamId] = useState('')
async function getReccordings(sid){
  const id = await axios(
    {
      url: `https://livepeer.com/api/stream/${sid}/sessions?record=1`,
      method: "GET",
      headers: {
        authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc"
      },
    })
    setRecordingId(id)
    console.log(id)
  
}

async function getPlaybackId(sid){
  const id = await axios(
    {
      url: `https://livepeer.com/api/stream/${sid}`,
      method: "GET",
      headers: {
        authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc"
      },
  })
  setPlaybackId(id.data.playbackId)
  checkIsActive(id.data.isActive)
  console.log(id.data.playbackId)
}
async function loadStreamId(){
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
  let transaction = await contract.getMyProfile()

  await getPlaybackId(transaction[4])  
  await getReccordings(transaction[4])
}
useEffect(()=>{
  loadStreamId()

},[])
// const [socketClient, setSocketClient] = useState(null)
// const [clients, setClients] = useState({})

// useEffect(() => {
//     // On mount initialize the socket connection
//     setSocketClient(io("http://localhost:8000"))

//     // Dispose gracefuly
//     return () => {
//         if (socketClient) socketClient.disconnect()
//     }
// }, [])

// useEffect(() => {
//     if (socketClient) {
//         socketClient.on('move', (clients) => {
//             setClients(clients)
//         })
//     }
// }, [socketClient])
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      
      <CardHeader p='6px 0px 22px 0px'>
        <h1 fontSize='xl' color={textColor} fontWeight='bold'>
          {title}
        </h1>
      </CardHeader>
      <CardBody>
      <Suspense fallback={<h1>Loading...</h1>}>
    <Canvas gl={{preserveDrawingBuffer: true}} shadowMap sRGB style={{height:"90vh"}}>
  {/* <Sky sunPosition={[100, 20, 100]} /> */}
  <SkyBox/>
  <ambientLight intensity={0.25} />
  <pointLight castShadow intensity={0.7} position={[100, 100, 100]} />
  <Hud position={[0, 0, -2]} />
  <LiveVideo playbackId={playbackId}/>
<Recordings/>
<Vod/>
<Nfts/>
{/* <Plane/> */}
{/* {Object.keys(clients)
                    .filter((clientKey) => clientKey !== socketClient.id)
                    .map((client) => {
                        const { position } = clients[client]
                        return (
                            <UserWrapper
                                key={client}
                                id={client}
                                position={position}
                                
                            />
                        )
                    })} */}
  <Physics gravity={[0, -30, 0]}>
    
    <Ground position={[0, 0.5, 0]} />
    <Player />
    <Cubes />
  </Physics>
  {/* <group position={[0.6, -0.27, 0.5]}>
  <Plane />
  </group> */}
 
</Canvas>
</Suspense>
      </CardBody>
    </Card>
  );
};

export default Build;
