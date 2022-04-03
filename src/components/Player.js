import React, { useState, useEffect, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { FPVControls } from './FPVControls';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useStore } from '../hooks/useStore';
import { Vector3 } from 'three';
import * as THREE from 'three'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from '../views/Dashboard/Profile/CreatorProfileAbi.json'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const SPEED = 6;
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'

async function UpdateWorld(link) {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
  let transaction = await contract.updateWorld(link)
  await transaction.wait()

  
}

const Plane = () => {

  const [cubes, addCube, removeCube, saveWorld , loadWorld] = useStore((state) => [
    state.cubes,
    state.addCube,
    state.removeCube,
    state.saveWorld,
    state.loadWorld
  ]);
  
  
  async function IpfsUpload(){
    try {
      const data = JSON.stringify({
        cubes
      })
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function worldUpdate(){
    const url = await IpfsUpload();
    await UpdateWorld(url)
    console.log("success")
  }
 
  return (
    <group position={[0.4, -0.27, 0.5]}  dispose={null}>
    <mesh
    //  ref={save}
      
      // position={[0.3, -0.35, 0.5]}
      // {...props}
      onClick={(e) => {
        e.stopPropagation()
        worldUpdate()
      }}
    >
      <Text fontSize={0.05}>Save</Text>
      <planeBufferGeometry attach="geometry" args={[0.3, 0.075]} />
      <meshPhongMaterial  attach="material" color={"purple"} />
    </mesh>
    </group>
  )
}
export const Player = () => {
  const { camera } = useThree();
  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    jump,
  } = useKeyboardControls();
  const save = useRef()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 1, 10]
  }));
  const rotation = new Vector3()
  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useFrame(() => {
    // camera.position.copy(ref.current.position);
    ref.current.getWorldPosition(camera.position)
    
    const direction = new Vector3();

    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0),
      );
    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0,
      );
      
      direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);
    
    if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2]);
    }
    save.current.rotation.copy(camera.rotation)
    save.current.position.copy(camera.position).add(camera.getWorldDirection(rotation).multiplyScalar(1))
  });
  // const movement= ()=>{
  //   console.log("works")
  //   socket.emit('move', {
  //     position: camera.position
  //   })
  // }
  
//   const [updateCallback, setUpdateCallback] = useState(null)
//   useEffect(() => {
//     const onControlsChange = (val) => {
//       const { position, rotation } = val.target.object
//       const { id } = socket

//       const posArray = []
//       const rotArray = []

//       position.toArray(posArray)
//       rotation.toArray(rotArray)

//       socket.emit('move', {
//           id,
//           rotation: rotArray,
//           position: posArray,
//       })
//   }
//     if (ref.current) {
//       // ref.current.addEventListener('change', socket.emit('move',camera.position))
//         setUpdateCallback(
//             ref.current.addEventListener('change', socket.emit('move', onControlsChange))
//         )
//     }

//     // Dispose
//     return () => {
//         if (updateCallback && ref.current)
//             ref.current.removeEventListener(
//                 'change',
//                 socket.emit('move', onControlsChange)
//             )
//     }
// })

 
  // window.addEventListener("keydown", socket.emit('move',camera.position))
  
  return (
    <>
      <FPVControls />
      <mesh ref={ref} />
      <group ref={save}>
      <Plane />
      </group>
    </>
  );
};


