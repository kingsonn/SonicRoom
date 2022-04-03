// Chakra imports
import {
  Flex,
  Grid,
  Text,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
// import scene from '../../../components/images/scene.gltf'
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {Suspense, useState} from 'react'
import { Canvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import * as THREE from 'three'
import { Ground } from '../../../components/Ground';
import Cubes from '../../../components/Cubes';
import { Player } from '../../../components/Player';
import { Hud } from '../../../components/Hud';
// import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { useGLTF } from '@react-three/drei'
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import CreateProfile from './CreateProfile'
import React, {useEffect, useRef} from "react";
import LiveVideo from './LiveVideo'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import VerthAbi from '../../../contracts/VerthAbi.json'
const vAddress = '0xfabB25f11151D0ec5e0f13BB0Eb164C167A7407f'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
function Audi(){
  const gltf = useLoader(GLTFLoader, scene)
  return(
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  )
}
function Build(props){
  return (
    <>
    <Grid>
      <Suspense fallback={<h1>Loading...</h1>}>
    <Canvas gl={{preserveDrawingBuffer: true}} shadowMap sRGB style={{height:"90vh"}}>
  <Sky sunPosition={[100, 20, 100]} />
  <ambientLight intensity={0.25} />
  <pointLight castShadow intensity={0.7} position={[100, 100, 100]} />
  <Hud position={[0, 0, -2]} />
  <LiveVideo/>
  <Physics gravity={[0, -30, 0]}>
    
    <Ground position={[0, 0.5, 0]} />
    <Player  {...props} />
    <Cubes />
  </Physics>
  {/* <group position={[0.6, -0.27, 0.5]}>
  <Plane />
  </group> */}
 
</Canvas>
</Suspense>
</Grid>
<Grid mt={10}>

</Grid>
</>
  )
}

export default function Dashboard() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  

  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(vAddress, VerthAbi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()

    
  }

  return (
    <div className="flex justify-center">
 {/* <Build
 name= {formInput.name}
 description= {formInput.description}
 price={formInput.price}
 /> */}
 <CreateProfile/>
<Card>
    <div className="w-1/2 flex flex-col pb-12">
      <Flex >
     <Text fontSize={"2xl"} marginRight={4}> Asset Name: </Text>
      <input 
      color="black"
      
        
        
        onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        /><br></br>
        </Flex>
        <Flex>
          <Text fontSize={"2xl"} marginRight={4}>Asset Description: </Text>
      <textarea
     
        className="mt-2 border rounded p-4"
        onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
      />
      </Flex>
      <Flex>
        <Text fontSize={"2xl"} marginRight={4}>Asset Price in Matic: </Text>
      <input
        
        className="mt-2 border rounded p-4"
        onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
      />
      </Flex>
      {/* <input
        type="file"
        name="Asset"
        className="my-4"
        onChange={onChange}
      />
      {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        } */}
      {/* <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
        Create NFT
      </button> */}
    </div>
        </Card>
  </div>
  );
}
