// Chakra imports
import { Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import avatar4 from "assets/img/avatars/avatar4.png";
import ProfileBgImage from "assets/img/profilebg.jpg";
import React, {useState} from "react";
import { FaCube, FaPenFancy } from "react-icons/fa";
import { IoDocumentsSharp } from "react-icons/io5";
import Conversations from "./components/Conversations";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import ProfileInformation from "./components/ProfileInformation";
// import Projects from "./components/Projects";
import Create from "./components/Create";
import { ethers } from 'ethers'
import { useEffect} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import CreatorProfileAbi from "./CreatorProfileAbi.json";
const vAddress = '0x18e13d26493C53D5F8A79C8c19Ae2336BA51D18b'
function Profile() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
const [accountExists, setAccountExists]= useState(null)
const [account, setAccount] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadAccount()
  }, [])
  useEffect(() => {
    loadAccount()
  }, [accountExists])
  async function loadAccount() {
    const web3Modal = new Web3Modal({
      network: "testnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const CreatorContract = new ethers.Contract(vAddress, CreatorProfileAbi, signer)
    const verification = await CreatorContract.checkUser()
    if(verification == true){
      setAccountExists(true)

      const myaccount = await CreatorContract.getMyProfile()
      setAccount(myaccount)
    }
  }
if(!accountExists){
  return (
   
<Create
 backgroundHeader={ProfileBgImage}
 backgroundProfile={bgProfile}
 />
 
  )
}
  return (
  
    <Flex direction='column'>
      <Header
        backgroundHeader={ProfileBgImage}
        backgroundProfile={bgProfile}
        avatarImage={account[5]}
        name={account[3]}
        email={account[0]}
        tabs={[
          {
            name: "Subscribers: " + account[2],
            icon: <FaCube w='100%' h='100%' />,
          },
       
        ]}
      />
      <Grid templateColumns={{ sm: "1fr", xl: "repeat(3, 1fr)" }} gap='22px'>
        <PlatformSettings
          title={"Platform Settings"}
          subtitle1={"ACCOUNT"}
          subtitle2={"APPLICATION"}
        />
        <ProfileInformation
          title={"Profile Information"}
          description={
            "Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
          }
          name={"Esthera Jackson"}
          mobile={"(44) 123 1234 123"}
          email={"esthera@simmmple.com"}
          location={"United States"}
        />
       
        <Conversations title={"Mint NFTs"} />
      </Grid>
   
    </Flex>
  );
}

export default Profile;
