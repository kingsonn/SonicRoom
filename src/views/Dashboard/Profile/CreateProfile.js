import {
    Flex,
    Button,
    Grid,
    Text,
    Image,
    SimpleGrid,
    useColorModeValue,
  } from "@chakra-ui/react";
import axios from 'axios'
import { ethers, Signer } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from './CreatorProfileAbi.json'
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {Suspense, useState} from 'react'
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateProfile() {
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
      
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
      let transaction = await contract.newProfile(description, name, fileUrl, stream)
      await transaction.wait()  
    }
  
    return (
    
 
        <div>
      <CardHeader>
          <Text>Create Your Channel</Text> 
      </CardHeader>
      <div className="w-1/2 flex flex-col pb-12">
      <input
        type="file"
        name="Asset"
        required
        className="my-4"
        onChange={onChange}
      />
      {
        fileUrl && (
          <img style={{borderRadius:"10px", width:"20px  "}} className="rounded mt-4" width="350" src={fileUrl} />
        )
      }
        <Flex >
       <Text fontSize={"2xl"} marginRight={4}> Name: </Text>
        <input 
        color="black"
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px"}}
          required
          
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          /><br></br>
          </Flex>
          <Flex>
            <Text fontSize={"2xl"} marginRight={4}>Bio: </Text>
        <textarea
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px"}}
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
          </div>
  
    );
  }
  