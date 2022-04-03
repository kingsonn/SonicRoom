// Chakra imports
import {
  Avatar,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar6 from "assets/img/avatars/avatar6.png";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, {useState} from "react";
import axios from 'axios'
import { ethers, Signer } from 'ethers'
import Web3Modal from 'web3modal'
import MarketplaceAbi from '../SonicRoomMarketplaceAbi.json'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const vAddress = '0xbD0BB7F67A4b02e14C01997ea9e8718B24C8e13C'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const Conversations = ({ title }) => {
  // Chakra color mode
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
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
   
    let contract = new ethers.Contract(vAddress, MarketplaceAbi, signer)
    let transaction = await contract.createToken(url, price)
    await transaction.wait()


  }
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card p='16px'>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      
      <Flex paddingBottom={3}>
      <Text mt={"10px"} fontSize={"xl"} marginRight={4}> File: </Text>
      <input
      style={{background:"rgb(214 172 218 / 37%)", width:"150px", borderRadius:"10px", padding:"2px",marginTop:"10px", marginBottom:"7px"}}
        type="file"
        name="Asset"
        
        required
       
        onChange={onChange}
      /><br/>
     
      <br/>
        </Flex>
        <Flex paddingBottom={3}>
       <Text fontSize={"xl"} marginRight={4}> Name: </Text>
        <input 
        color="black"
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"2px", marginBottom:"2px"}}
          required
          
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          /><br></br>
          </Flex>
          <Flex paddingBottom={3}>
            <Text fontSize={"xl"} marginRight={4}>Description: </Text>
        <textarea
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px"}}
       required
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        </Flex>
        <Flex paddingBottom={3}>
        <Text fontSize={"xl"} marginRight={4}> Price: </Text>
        <input 
        color="black"
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"2px", marginBottom:"2px"}}
          required
          
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          /><br></br>
          </Flex>
      <Button onClick={listNFTForSale}>Mint</Button>
      
    </Card>
  );
};

export default Conversations;
