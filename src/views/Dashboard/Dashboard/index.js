// Chakra imports
import {
  Flex,
  Grid,
  Image,
  SimpleGrid,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
// assets
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from 'ethers'
import Card from "components/Card/Card.js";



import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

import {Suspense, useState, useEffect} from 'react'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from '../Profile/CreatorProfileAbi.json'
const address = "0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b"
async function jaja(){
  const id = await axios(
    {
      url: 'https://livepeer.com/api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]',
      method: "GET",
      headers: {
        authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc"
      },
}
  )
  console.log(id.data)
}


export default function Dashboard() {
  const [profiles, setProfiles]= useState([])
  useEffect(()=>{
    loadProfiles()
  },[])
  async function loadProfiles() {
  
    const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/5fb2b877931dac9074f8c06f/polygon/mumbai")
    const contract = new ethers.Contract(address, CreatorProfileAbi, provider)
    const data = await contract.allProfiles()
    // console.log(data)

    const arr = await Promise.all(data.map(async p=>{
      let prof = {
        img: p[0],
        uname: p[1],
        add: p[2],
        bio: p[3]
      }
      return prof
    }))
    
    setProfiles(arr)
  }
  const iconBoxInside = useColorModeValue("white", "white");



  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }} >
      <Card>
       
        < SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} spacing='24px' >
          
          {
            profiles.map((p,i)=>{
              return (
             <div  style={{borderRadius:"12px",background:"linear-gradient(44deg, rgba(141,25,244,1) 0%, rgba(206,31,214,1) 43%, rgba(255,170,49,1) 100%)"}} key={i}>
               <Link to={`/views/${p.add}`}>
               <img style={{borderRadius:"20px", padding:"10px"}}  src={p.img}/>
               <h1 style={{textAlign:"center", fontSize:"x-large"}}>{p.uname}</h1>
               <h1 style={{padding:"10px"}}>{p.bio}</h1>
               </Link>
               <div style={{ paddingBottom:"10px", display:"flex", justifyContent:"center"}} >
               <Button style={{margin:"10px"}} onClick={ async ()=>{
                const web3Modal = new Web3Modal()
                const connection = await web3Modal.connect()
                const provider = new ethers.providers.Web3Provider(connection)
                const signer = provider.getSigner()
                let contract = new ethers.Contract(address, CreatorProfileAbi, signer)
                let data = await contract.followUser(p.add)

               }} >
               
                 Subscribe</Button>
                 <Button style={{margin:"10px"}} onClick={async()=>{
                     const web3Modal = new Web3Modal()
                     const connection = await web3Modal.connect()
                     const provider = new ethers.providers.Web3Provider(connection)
                     const signer = provider.getSigner()
                   
                     const sf = await Framework.create({
                       chainId: 80001,
                       provider: provider
                     });
                   
                     const DAIx = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";
                   
                     try {
                       const createFlowOperation = sf.cfaV1.createFlow({
                         receiver: p.add,
                         flowRate: 3870000000000,
                         superToken: DAIx
                         // userData?: string
                       });
                   
                       console.log("Creating your stream...");
                   
                       const result = await createFlowOperation.exec(signer);
                       console.log(result);
                   
                     } catch (error) {
                       console.log(
                         "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
                       );
                       console.error(error);
                     }
                 }}>SuperFan</Button>
                 </div>
             </div>
              )
            })
          }
        </SimpleGrid>
      </Card>
    
    </Flex>
  );
}
