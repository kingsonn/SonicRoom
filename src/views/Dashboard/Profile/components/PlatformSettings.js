// Chakra imports
import { Button, Flex, Switch, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, {useState, useEffect} from "react";
import axios from 'axios'
import { ethers, Signer } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from '../CreatorProfileAbi.json'

const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'

const PlatformSettings = ({ title, subtitle1, subtitle2 }) => {
  useEffect(()=>{
    loadStreamId()
  
  },[])
  const [ live, goLive]= useState(false)
  const [streamKey,  setStreamKey]= useState()
  async function loadStreamId(){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
    let transaction = await contract.getMyProfile()
  console.log(transaction)
    await getPlaybackId(transaction[4])  
   
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
    console.log(id)
    setStreamKey(id.data.streamKey)
  
  }
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card p='16px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          Live Stream Settings
        </Text>
      </CardHeader>
      <CardBody px='5px'>
        <Flex direction='column'>
          <Text fontSize='sm' color='gray.500' fontWeight='600' mb='20px'>
            {subtitle1}
          </Text>
          <Flex align='center' mb='20px'>
            
            <Button noOfLines={1} onClick={()=> goLive(true)} fontSize='md' color='gray.500' fontWeight='00'>
              Go Live
            </Button>
          </Flex>
          <Flex align='center' mb='20px'>
            <Switch colorScheme='teal' me='10px' />
            <Text noOfLines={1} fontSize='md' color='gray.500' fontWeight='400'>
              Record Session
            </Text>
          </Flex>
     
          {live&&  
            <Text noOfLines={1} fontSize='md' color='gray.500' fontWeight='400'>
              Stream Key: 
            </Text>
}
{live&&
            <Text noOfLines={1} fontSize='md' color='gray.500' fontWeight='400'>
            {streamKey}
            </Text>
}
{live&& 
            <Text noOfLines={1} fontSize='md' color='gray.500' fontWeight='400'>
              RMTP Ingest URL:
            </Text>
}
{live&&
            <Text noOfLines={1} fontSize='md' color='gray.500' fontWeight='400'>
              rtmp://rtmp.livepeer.com/live
            </Text>
}
          
          
         
          
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PlatformSettings;
