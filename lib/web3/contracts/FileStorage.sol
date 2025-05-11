// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FileStorage
 * @dev Smart contract for storing file metadata as NFTs
 */
contract FileStorage is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to file metadata
    mapping(uint256 => FileMetadata) private _fileMetadata;
    
    // Mapping from file hash to token ID
    mapping(string => uint256) private _fileHashToTokenId;
    
    // Mapping from user address to their files
    mapping(address => uint256[]) private _userFiles;
    
    // Mapping from token ID to authorized users
    mapping(uint256 => mapping(address => bool)) private _fileAccess;
    
    struct FileMetadata {
        string name;
        string fileType;
        uint256 size;
        string ipfsHash;
        uint256 timestamp;
        bool encrypted;
        string category;
    }
    
    event FileUploaded(
        uint256 indexed tokenId,
        address indexed owner,
        string ipfsHash,
        string name,
        uint256 timestamp
    );
    
    event FileShared(
        uint256 indexed tokenId,
        address indexed owner,
        address indexed sharedWith
    );
    
    event FileAccessRevoked(
        uint256 indexed tokenId,
        address indexed owner,
        address indexed revokedFrom
    );
    
    constructor() ERC721("D-CloudX File Storage", "DCX") {}
    
    /**
     * @dev Upload a file to the blockchain
     * @param _name File name
     * @param _fileType File type/extension
     * @param _size File size in bytes
     * @param _ipfsHash IPFS hash of the file
     * @param _tokenURI Metadata URI for the NFT
     * @param _encrypted Whether the file is encrypted
     * @param _category File category
     * @return tokenId The ID of the newly created NFT
     */
    function uploadFile(
        string memory _name,
        string memory _fileType,
        uint256 _size,
        string memory _ipfsHash,
        string memory _tokenURI,
        bool _encrypted,
        string memory _category
    ) public returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_fileHashToTokenId[_ipfsHash] == 0, "File already exists");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        _fileMetadata[newTokenId] = FileMetadata({
            name: _name,
            fileType: _fileType,
            size: _size,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            encrypted: _encrypted,
            category: _category
        });
        
        _fileHashToTokenId[_ipfsHash] = newTokenId;
        _userFiles[msg.sender].push(newTokenId);
        
        // Owner always has access
        _fileAccess[newTokenId][msg.sender] = true;
        
        emit FileUploaded(newTokenId, msg.sender, _ipfsHash, _name, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Share a file with another user
     * @param _tokenId The ID of the NFT representing the file
     * @param _user The address of the user to share with
     */
    function shareFile(uint256 _tokenId, address _user) public {
        require(_exists(_tokenId), "File does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the file owner");
        require(_user != address(0), "Invalid address");
        
        _fileAccess[_tokenId][_user] = true;
        
        emit FileShared(_tokenId, msg.sender, _user);
    }
    
    /**
     * @dev Revoke file access from a user
     * @param _tokenId The ID of the NFT representing the file
     * @param _user The address of the user to revoke access from
     */
    function revokeAccess(uint256 _tokenId, address _user) public {
        require(_exists(_tokenId), "File does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the file owner");
        require(_user != address(0), "Invalid address");
        
        _fileAccess[_tokenId][_user] = false;
        
        emit FileAccessRevoked(_tokenId, msg.sender, _user);
    }
    
    /**
     * @dev Check if a user has access to a file
     * @param _tokenId The ID of the NFT representing the file
     * @param _user The address of the user to check
     * @return bool Whether the user has access
     */
    function hasAccess(uint256 _tokenId, address _user) public view returns (bool) {
        require(_exists(_tokenId), "File does not exist");
        return ownerOf(_tokenId) == _user || _fileAccess[_tokenId][_user];
    }
    
    /**
     * @dev Get file metadata
     * @param _tokenId The ID of the NFT representing the file
     * @return FileMetadata The file metadata
     */
    function getFileMetadata(uint256 _tokenId) public view returns (FileMetadata memory) {
        require(_exists(_tokenId), "File does not exist");
        require(hasAccess(_tokenId, msg.sender), "No access to this file");
        
        return _fileMetadata[_tokenId];
    }
    
    /**
     * @dev Get all files owned by a user
     * @param _user The address of the user
     * @return uint256[] Array of token IDs owned by the user
     */
    function getUserFiles(address _user) public view returns (uint256[] memory) {
        return _userFiles[_user];
    }
    
    /**
     * @dev Get token ID by IPFS hash
     * @param _ipfsHash The IPFS hash of the file
     * @return uint256 The token ID
     */
    function getTokenIdByHash(string memory _ipfsHash) public view returns (uint256) {
        uint256 tokenId = _fileHashToTokenId[_ipfsHash];
        require(tokenId != 0, "File not found");
        return tokenId;
    }
}
