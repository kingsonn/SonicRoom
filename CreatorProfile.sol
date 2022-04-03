// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SignedSafeMath.sol";

contract CreatorProfile {
    using SafeMath for uint8;
    using SafeMath for uint256;
    using SignedSafeMath for int256;
    // address public SZMToken;
    // uint cooldown = 1 days;
    // address public rewardAddress = 0xCcAC11e3b73754CE4063F4E318481b33c1AD35C8;

//     constructor (address _SZMToken) {
//     SZMToken = _SZMToken;
//   }
  
    struct Post
    {
      uint256 upvotes;
      uint256 downvotes;
      uint256 timestamp;
      string title;
      string url;
      address owner;
      string thumbnailUrl;
      string category;
      string description;
      uint256 totalComments; // list of userPosts. probably can remove
      mapping(uint256 => Comment) commentStructs; // mapping of postkey to post
    }
    mapping(string => string[]) categoryToAssets;
    struct profile{
        string profileImageUrl;
        string userName;
        address userAddress;
        string userProfileBio;
    }
    

    struct userProfile
    {
        bool exists;
        address[] subscriptions;
        string profileImageUrl;
        string userProfileBio;
        string userName;
        address userAddress;
        uint256 followerCount;
        uint256 joinDate;
        string streamId;
        string userWorld;
        uint256 totalUpvotes;
        uint256 totalDownvotes;
        uint256 userPosts; // list of userPosts. probably can remove
        // string billboardUrl;
        string[] posts;
    }
    
    mapping(string => Post) postStructs; //assetId to post
    // Post[] public posts;
    // mapping(address => Post[]) userToPosts;
    struct Comment
    {
      address commenter;
      string message; 
      uint256 timestamp;
    }
// https://ipfs.infura.io/ipfs/QmVUw5jqRf3zK3P2m5DtNLuD6VBbJhpA2M6j3r96u58ALM
    mapping(address => userProfile) userProfileStructs; // mapping useraddress to user profile
    address[] userProfileList; // list of user profiles
    profile[] public profiles;
    event newPost(address senderAddress, string Id, string category);


    function newProfile(string memory newProfileBio, string memory uName, string memory profileimg, string memory stream) public returns(bool success)
    {
        require(userProfileStructs[msg.sender].exists == false, "Account Already Created"); // Check to see if they have an account
        userProfileStructs[msg.sender].userProfileBio = newProfileBio;
        userProfileStructs[msg.sender].userName = uName;
        userProfileStructs[msg.sender].streamId = stream;
        userProfileStructs[msg.sender].userAddress = msg.sender;
        userProfileStructs[msg.sender].followerCount = 0;
        userProfileStructs[msg.sender].exists = true;
        userProfileStructs[msg.sender].joinDate = block.timestamp;
        userProfileStructs[msg.sender].totalDownvotes = 0;
        userProfileStructs[msg.sender].totalUpvotes = 0;
        userProfileStructs[msg.sender].userPosts = 0;
        userProfileStructs[msg.sender].userWorld = "";
        userProfileStructs[msg.sender].profileImageUrl = profileimg;
        userProfileList.push(msg.sender);
        profiles.push(profile(profileimg, uName, msg.sender, newProfileBio));
        return true;
    }
    function updateWorld(string memory worldLink) public returns(bool success){
        
        userProfileStructs[msg.sender].userWorld = worldLink;
        return true;
    }
    function allProfiles() public view returns(profile[] memory){
        return profiles;
    }
    function getMyWorld() public view returns(string memory){
        return userProfileStructs[msg.sender].userWorld;
    }
    function checkUser() public view returns(bool){
        if(userProfileStructs[msg.sender].exists == false){
            return false;
        }
        else{
            return true;
        }
    }

    function getUserProfile(address userAddress) public view
        returns(string memory profileBio, uint256 totalPosts,uint256 followerCount, string memory username, string memory streamId, string memory profileImageUrl)
    {
        return(userProfileStructs[userAddress].userProfileBio,
        userProfileStructs[userAddress].userPosts,
        userProfileStructs[userAddress].followerCount,
        userProfileStructs[userAddress].userName,
        userProfileStructs[userAddress].streamId,
        userProfileStructs[userAddress].profileImageUrl);
    }
    function getUserWorld(address userAddress) public view returns(string memory){
        return userProfileStructs[userAddress].userWorld;
    }
    function getMyProfile() public view
        returns(string memory profileBio, uint256 totalPosts,uint256 followerCount, string memory username, string memory streamId, string memory profileImageUrl)
    {
        return(userProfileStructs[msg.sender].userProfileBio,
        userProfileStructs[msg.sender].userPosts,
        userProfileStructs[msg.sender].followerCount,
        userProfileStructs[msg.sender].userName,
        userProfileStructs[msg.sender].streamId,
        userProfileStructs[msg.sender].profileImageUrl);
    }
    
    function addPost(string memory _title, string memory _description, string memory _url, string memory _thumbnailUrl, string memory _category) public returns(bool success)
     {
         require(userProfileStructs[msg.sender].exists == true, "Create an Account to Post"); // Check to see if they have an account
         
         userProfileStructs[msg.sender].userPosts += 1;
         postStructs[_url].title= _title;
         postStructs[_url].description= _description;
         postStructs[_url].timestamp = block.timestamp;
         postStructs[_url].upvotes = 0;
         postStructs[_url].downvotes = 0;
         postStructs[_url].url = _url;
         postStructs[_url].category = _category;
         postStructs[_url].thumbnailUrl = _thumbnailUrl;
         postStructs[_url].owner = msg.sender;
         userProfileStructs[msg.sender].posts.push(_url);
         categoryToAssets[_category].push(_url);
        //  userProfileStructs[msg.sender].posts.push(Post(0,0, block.timestamp, _title, _url, _thumbnailUrl, _category, _description));
        // userToPosts[msg.sender].push(0,0, block.timestamp, _title, _url, _thumbnailUrl, _category, _description);
         emit newPost(msg.sender,_url, _category); // emit a post to be used on the explore page
         
         return true;
     }
     function getAllMyPosts() public view returns(string[] memory){
         return( userProfileStructs[msg.sender].posts);
     }
     function getPostByCategory(string memory _category)public view returns(string[] memory){
         return categoryToAssets[_category];
     }
     function addComment( string memory postID, string memory commentText) public returns(bool success)
     {
         require(userProfileStructs[msg.sender].exists == true, "Create an Account to Comment"); // Check to see if they have an account
         require(postStructs[postID].timestamp != 0, "No Post Exists"); //Check to see if comment exists. Timestamps default to 0
         uint256 commentID = postStructs[postID].totalComments; // ID is just an increment. No need to be random since it is associated to each unique account
         postStructs[postID].totalComments += 1;
         postStructs[postID].commentStructs[commentID].commenter = msg.sender;
         postStructs[postID].commentStructs[commentID].message = commentText;
         postStructs[postID].commentStructs[commentID].timestamp = block.timestamp;
         return true;
     }
     function addressToUsername(address userAddress) public view returns(string memory){
        return userProfileStructs[userAddress].userName;
     }
    function getComment(string memory postID, uint256 commentID) public view
         returns(address commenter, string memory message, uint256 timestamp)
     {
         return(postStructs[postID].commentStructs[commentID].commenter,
         postStructs[postID].commentStructs[commentID].message,
         postStructs[postID].commentStructs[commentID].timestamp);
     }
     function getUserPost(string memory postKey) external view
        returns(string memory url, string memory category, string memory thumbnail, string memory title, string memory description, address username, uint256 totalComments)
    {
        return(postStructs[postKey].url,
            postStructs[postKey].category,
            postStructs[postKey].thumbnailUrl,
            postStructs[postKey].title,
            postStructs[postKey].description,
            postStructs[postKey].owner,
            postStructs[postKey].totalComments); // stack is too deep if I try to call profileImageUrl as well
    }
    function getVotes(string memory postKey) external view
        returns(uint256, uint256){
            return(postStructs[postKey].upvotes,
            postStructs[postKey].downvotes);
        }
    function getAllUserPosts(address userAddress) public view
        returns(uint256 userPosts)
    {
        return(userProfileStructs[userAddress].userPosts);
    }
    function Upvote(address userAddress, string memory postKey) public returns(bool success)
    {
        require(userProfileStructs[msg.sender].exists == true, "Create an Account First"); // Check to see if they have an account
       postStructs[postKey].upvotes += 1;
        userProfileStructs[userAddress].totalUpvotes += 1;
        return true;
    }
    function Downvote(address userAddress, string memory postKey) public returns(bool success)
    {
        require(userProfileStructs[msg.sender].exists == true, "Create an Account First"); // Check to see if they have an account
        postStructs[postKey].downvotes += 1;
        userProfileStructs[userAddress].totalDownvotes += 1;
        return true;
    }
    function getTotalVotes(address userAddress) public view returns(uint256 upvotes, uint256 downvotes){
        return(userProfileStructs[userAddress].totalUpvotes, userProfileStructs[userAddress].totalDownvotes);
    }
    function followUser(address userAddress) public returns(bool success)
    {
        require(userProfileStructs[msg.sender].exists == true, "Create an Account First"); // Check to see if they have an account
        userProfileStructs[userAddress].followerCount += 1;
        userProfileStructs[msg.sender].subscriptions.push(userAddress);
        return true;
    }
    function getSubs() public view returns(address[] memory){
        return userProfileStructs[msg.sender].subscriptions;
    }
}
    