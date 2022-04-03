import React, {useEffect, useState} from 'react';
import { useStore } from '../hooks/useStore';
import { useInterval } from '../hooks/useInterval';
import Cube from './Cube';
import { ethers } from 'ethers'
import axios from 'axios'
import { Sky , Html, Text} from '@react-three/drei';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from './CreatorProfileAbi.json'
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
// export var data;
export default function Cubes({userAddress}) {
  const [cubes, addCube, removeCube, saveWorld] = useStore((state) => [
    state.cubes,
    state.addCube,
    state.removeCube,
    state.saveWorld,
  ]);
  useEffect(()=>{
    getWorld()
  },[])
  const [ cubies, getCubies]= useState()
 async function getWorld(){
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
        let data = await contract.getUserWorld(userAddress)
        const meta = await axios.get(data)
      
        console.log(meta.data.cubes, "hi")
        getCubies(meta.data.cubes)
 }
if(cubies){
 return cubies.map((cube) => {
  return (
    <Cube
      key={cube.key}
      texture={cube.texture}
      position={cube.pos}
      addCube={addCube}
      removeCube={removeCube}
    />
    );
  });
}
return(
  <Text></Text>
)
}
