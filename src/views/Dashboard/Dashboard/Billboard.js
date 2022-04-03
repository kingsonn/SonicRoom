import {
    Flex,
    Grid,

    Image,
    SimpleGrid,
    useColorModeValue,
  } from "@chakra-ui/react";

  // import { io } from 'socket.io-client'
  import { MeshNormalMaterial, BoxBufferGeometry, SpotLightShadow } from 'three'
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

  import React, {useEffect, useRef} from "react";
  import { ethers } from 'ethers'
  import Web3Modal from 'web3modal'
  import MarketplaceAbi from '../../Dashboard/Profile/SonicRoomMarketplaceAbi.json'
  const vAddress = '0xbD0BB7F67A4b02e14C01997ea9e8718B24C8e13C'
  
  
  const Billboard = ({userAddress}) => {
    //   useEffect(()=>{
    //     loadNfts()
      
    //   },[])
    async function loadNfts(){
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(vAddress, MarketplaceAbi, signer)
        let data = await contract.fetchMyItemsListed(userAddress)
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await contract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
              price,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
            }
            return item
          }))
          setNfts(items)
      }
    //   loadNfts()
    const [ visible, setVisible] =useState(false)
     
          
        // const ref = useRef()
        // const img = useLoader(TextureLoader, image)
     return   (
            <group 
          
            rotation={[Math.PI*2,Math.PI,0]}
            position={[4*30,585,700]}>
            {/* <pointLight intensity={0.00001} position={[5, 3, 5]}></pointLight>   */}
            <mesh
            position={[0,0,-0.1]}
            receiveShadow
            
            >
              
              <meshPhongMaterial color={"purple"} attach="material"  />
              <planeBufferGeometry attach="geometry" args={[500, 100]}  />
            </mesh>
        
         
         
             
            <mesh
            visible={true}
            // ref={ref}
            // onClick={()=> console.log("hahaahh")}
              position={[12,2,0]}
              receiveShadow
        
              >
              <Text  position={[0,0,4]} color={"white"} fontSize={30}>//Billboard: Under Development 🚧</Text>
            
              <meshPhongMaterial color={"purple"} attach="material"  />
              <planeBufferGeometry attach="geometry" args={[50, 50]}  />
            </mesh>:<Text></Text>
            
           <mesh
           visible={visible}
           >
                <Text outlineColor={"purple"} outlineWidth={0.02} position={[12,0,0]} fontSize={1} color={"white"}> </Text>
              <Text textAlign="center" outlineColor={"purple"} outlineWidth={0.02} position={[12,-1,0]} fontSize={0.6} color={"white"}> </Text>
              <Text outlineColor={"purple"} outlineWidth={0.02}  position={[12,-2,0]} fontSize={0.6} color={"white"}> </Text>

           </mesh>
        
            </group>
           
        
          );
    
        }
 
  
  
  export default Billboard;
  