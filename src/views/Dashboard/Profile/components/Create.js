// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import profileimg from '../profile.png'
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";

import {Suspense, useState, useEffect} from 'react'
import axios from 'axios'
import { ethers, Signer } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import Web3 from "web3";
import {Biconomy} from "@biconomy/mexa";
import CreatorProfileAbi from '../CreatorProfileAbi.json'
import CreatorProfile from '../CreateProfile'
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const domainType = [
  {name:"name",type:"string"},
  {name:"version",type:"string"},
  {name:"verifyingContract",type:"address"},
  {name:"salt",type:"bytes32"},
];

const metaTransactionType = [
  {name:"nonce",type:"uint256"},
  {name:"from",type:"address"},
  {name:"functionSignature",type:"bytes"}
];

let domainData = {
  name:"CreatorProfile", //your dapp name as in your contract
  version: "1", //version as per your contract
  verifyingContract:"0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b", //contract address
  salt: '0x'+(80001).toString(16).padStart(64,'0') //For mainnet replace 80001 with 137
}
let web3,walletWeb3;
const Create = ({
  backgroundHeader,
  backgroundProfile,
}) => {
  const [contract,setContract] = useState("");

  useEffect(()=>{

    if(!window.ethereum){
      console.log("Metamask is required to use this DApp")
      return;
    }

    let maticProvider = new Web3.providers.HttpProvider("https://rpc-mumbai.matic.today"); //RPC URL as argument
    let biconomy = new Biconomy(maticProvider,{apiKey:"f0P_G8VY-.789cbcf5-b9b7-4560-9eab-9463339e1b48"});

    web3 = new Web3(biconomy);
    walletWeb3 = new Web3(window.ethereum);

    biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your contracts here using biconomy's provider instance
      // Initialize dapp here like getting user accounts etc

      await window.ethereum.request({method:'eth_requestAccounts'});

      const newContract = new web3.eth.Contract(CreatorProfileAbi, vAddress);
      setContract(newContract);


    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa

      console.log(error)
      console.log(message)
    });
  },[]);
  const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ name: '', description: '' })
    
  
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
        console.log(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    async function getPlaybackId() {
        const api_key="de3fbe64-204e-4359-ad48-f57f39d6a0dc"
        const { name, description} = formInput
        const id = await axios(
            {
              url: "https://livepeer.com/api/stream",
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc"
              },
              data: {
                name: name,
                profiles: [
                  {
                    name: "720p",
                    bitrate: 2000000,
                    fps: 30,
                    width: 1280,
                    height: 720,
                  },
                  {
                    name: "480p",
                    bitrate: 1000000,
                    fps: 30,
                    width: 854,
                    height: 480,
                  },
                  {
                    name: "360p",
                    bitrate: 500000,
                    fps: 30,
                    width: 640,
                    height: 360,
                  },
                ],
              },
            }
          ).then((res) => {
            // console.log(res.data.id)
            return res.data.id
          }).catch((err) => {
            console.log(err)
          })
       console.log(id)   
    return id
      
    }
  
    async function SRMProfile() {
        const { name, description} = formInput
      const stream = await getPlaybackId()
      
      // const web3Modal = new Web3Modal()
      // const connection = await web3Modal.connect()
      // const provider = new ethers.providers.Web3Provider(connection)
      // const signer = provider.getSigner()
  

      let nonce = await contract.methods.getNonce(window.ethereum.selectedAddress).call();

      let functionSignature = contract.methods.newProfile(description, name, fileUrl, stream).encodeABI();
      
      let message = {};
      message.nonce = parseInt(nonce);
      message.from = window.ethereum.selectedAddress;
      message.functionSignature = functionSignature;
  
      const dataToSign = JSON.stringify({
        types:{
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType 
        },
        domain:domainData,
        primaryType: "MetaTransaction",
        message:message
      });
  
      walletWeb3.currentProvider.sendAsync({
        jsonrpc:"2.0",
        id:999999999999,
        method:"eth_signTypedData_v4",
        params: [window.ethereum.selectedAddress,dataToSign]
      },
      async function(err,result){
        if(err){
          return console.error(err);
        }
        console.log("Signature result from wallet :")
        console.log(result);
        if(result && result.result) {
          const signature = result.result.substring(2);
          const r = "0x" + signature.substring(0,64);
          const s = "0x" + signature.substring(64,128);
          const v = parseInt(signature.substring(128,130),16);
          console.log(r,"r")
          console.log(s,"s")
          console.log(v,"v")
  
          console.log(window.ethereum.selectedAddress,"userAddress")
  
          const promiEvent = contract.methods
          .executeMetaTransaction(window.ethereum.selectedAddress,functionSignature,r,s,v)
          .send({
            from: window.ethereum.selectedAddress
          })
          promiEvent.on("transactionHash",(hash)=>{
            console.log("Transaction sent successfully. Check console for Transaction hash")
            console.log("Transaction Hash is ",hash)
          }).once("confirmation",(confirmationNumber,receipt)=>{
            if(receipt.status){
              console.log("Transaction processed successfully")
              // GetAddress();
            }else{
              console.log("Transaction failed");
            }
            console.log(receipt)
          })
        }else{
          console.log("Could not get user signature. Check console for error")
        }
      }
      )

      // let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
      // let transaction = await contract.newProfile(description, name, fileUrl, stream)
      // await transaction.wait()  
    }
  
  const textColor = useColorModeValue("gray.700", "white");
  const borderProfileColor = useColorModeValue(
    "white",
    "rgba(255, 255, 255, 0.31)"
  );
  const emailColor = useColorModeValue("gray.400", "gray.300");
  return (
    <Box
      mb={{ sm: "205px", md: "75px", xl: "110px" }}
      borderRadius='15px'
      px='0px'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      
      align='center'>
      
      <Box
        bgImage={backgroundHeader}
        w='97%'
        h='300px'
        borderRadius='25px'
        bgPosition='50%'
        bgRepeat='no-repeat'
        position='relative'
        display='flex'
        marginBottom='100px'
        justifyContent='center'>
        <Flex
          direction={{ sm: "column", md: "row" }}
          mx='1.5rem'
          h='400px'
          w={{ sm: "90%", xl: "95%" }}
          justifyContent={{ sm: "center", md: "space-between" }}
          align='center'
          backdropFilter='saturate(200%) blur(50px)'
          // position='absolute'
          
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
          border='2px solid'
          borderColor={borderProfileColor}
          bg={backgroundProfile}
          p='24px'
          borderRadius='20px'
          transform={{
            sm: "translateY(45%)",
            md: "translateY(110%)",
            lg: "translateY(30%)",
          }}>
    <div>
         <CardHeader>
          <Text as={"samp"} fontSize={"4xl"}>Create Your Channel</Text> 
      </CardHeader>
      <hr/>
      <Flex>
      <Text mt={"10px"} fontSize={"2xl"} marginRight={4}> Profile Image: </Text>
      <input
      style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px",marginTop:"10px", marginBottom:"20px"}}
        type="file"
        name="Asset"
        
        required
       
        onChange={onChange}
      />
      </Flex>
        <Flex >
       <Text fontSize={"2xl"} marginRight={4}> Name: </Text>
        <input 
        color="black"
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px", marginBottom:"20px"}}
          required
          
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          /><br></br>
          </Flex>
          <Flex>
            <Text fontSize={"2xl"} marginRight={4}>Bio: </Text>
        <textarea
       style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px", marginBottom:"20px"}}
       required
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        </Flex>
        <Flex>
       
        <Button onClick={SRMProfile} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Profile
        </Button>
        </Flex>
        </div>
        {
        fileUrl && (
          <img style={{borderRadius:"10px"}} className="rounded mt-4" width="350" src={fileUrl} />
        )
}
{
        !fileUrl && (
       <img style={{borderRadius:"10px"}} className="rounded mt-4" width="350" src={profileimg} />
        )
      }
        </Flex>
      </Box>
    </Box>
  );
};

export default Create;
