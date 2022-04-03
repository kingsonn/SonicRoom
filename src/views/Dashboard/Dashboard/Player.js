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
import CreatorProfileAbi from './CreatorProfileAbi.json'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const SPEED = 6;
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'


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
     
    </>
  );
};


