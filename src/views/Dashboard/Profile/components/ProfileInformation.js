// Chakra imports
import { Button, Flex, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, {useState} from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from 'axios'
import { ethers, Signer } from 'ethers'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from '../CreatorProfileAbi.json'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const ProfileInformation = ({
  title,
  description,
  name,
  mobile,
  email,
  location,
}) => {
  const [fileUrl, setFileUrl] = useState(null)
  // Chakra color mode
  const [thumbnail, setThumbnail] = useState(null)
  const [formInput, updateFormInput] = useState({ name: '', description: '', category: ''})
  const uploadVid = async (e)=>{
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
  const uploadThumbnail = async (e)=>{
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setThumbnail(url)
      console.log(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function SRMPost(assetId) {
    const { name, description, category} = formInput
  
  
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  let contract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
  let transaction = await contract.addPost(name, description, assetId, thumbnail, category)
  await transaction.wait()  
}
  async function upload(){
    const {name} = formInput
    await axios(
        {
          url: "https://livepeer.com/api/asset/import",
          method: "POST",
          headers: {
            "access-control-allow-credentials": "true",
            "access-control-allow-origin": "https://lively-sunshine-ae0d00.netlify.app/",
            "access-control-expose-headers": "*",
            authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc",
            "content-type": "application/json"
          },
          data: {
            url: fileUrl,
            name:name || " "
          }
        }
    
    ).then((res)=>{
    //  axios(
    //     {
    //       url: `https://livepeer.com/api/asset/ae0d4256-3c84-4df8-ba4f-9637b523732a`,
    //       method: "GET",
    //       headers: {
    //         authorization: "Bearer de3fbe64-204e-4359-ad48-f57f39d6a0dc", 
    //       }
    //     }
    //   ).then((res)=> console.log(res))
        SRMPost(res.data.asset.id)
    }).then(console.log("done"))
    

      }
    async function saveId(){

    }
    async function final(){
      const vid = await upload()
    }
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Card p='16px' my={{ sm: "24px", xl: "0px" }}>
      <CardHeader p='12px 5px' mb='12px'>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
         Upload Video
        </Text>
      </CardHeader>
      
      <Flex paddingBottom={3}>
      <Text mt={"10px"} fontSize={"xl"} marginRight={4}> Video: </Text>
      <input
      style={{background:"rgb(214 172 218 / 37%)", width:"150px", borderRadius:"10px", padding:"2px",marginTop:"10px", marginBottom:"7px"}}
        type="file"
        name="Asset"
        
        required
       
        onChange={uploadVid}
      /><br/>
     
      <br/>
        </Flex>
      <Flex paddingBottom={3}>
      <Text mt={"10px"} fontSize={"xl"} marginRight={4}> Thumbnail: </Text>
      <input
      style={{background:"rgb(214 172 218 / 37%)", width:"150px", borderRadius:"10px", padding:"2px",marginTop:"10px", marginBottom:"7px"}}
        type="file"
        name="Asset"
        
        required
       
        onChange={uploadThumbnail}
      /><br/>
     
      <br/>
        </Flex >
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
       <Text fontSize={"xl"} marginRight={4}> Category: </Text>
        <select 
        color="black"
        style={{background:"rgb(214 172 218 / 37%)", borderRadius:"10px", padding:"10px"}}
          required
          
          onChange={e => updateFormInput({ ...formInput, category: e.target.value })}
          >
           <option style={{color:"black" }} value={"Music"}>Music</option> 
           <option style={{color:"black" }} value={"Entertainment"}>Entertainment</option> 
           <option style={{color:"black" }} value={"Gaming"}>Gaming</option> 
           <option style={{color:"black" }} value={"News"}>News</option> 
           <option style={{color:"black" }} value={"Learning"}>Learning</option> 
           <option style={{color:"black" }} value={"Sports"}>Sports</option> 
           <option style={{color:"black" }} value={"Fashion"}>Fashion</option> 
            
            </select><br></br>
          </Flex>
      <Button onClick={upload}>Upload</Button>
    </Card>
  );
};

export default ProfileInformation;
