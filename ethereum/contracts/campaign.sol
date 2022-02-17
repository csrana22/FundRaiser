// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


contract Factory{

    address[] public deployedContracts;

    function createCampaign(uint minContri) public{
        address newCamp = address(new Campaign(minContri, msg.sender));
        deployedContracts.push(newCamp);
    }

    function getDeployedContracts()public view returns (address[] memory){

        return deployedContracts;
    }
}



contract Campaign{

    struct Request{  // introducing/defining a new data type 
        string description;
        uint value;
        address recipient;
        bool complete;
        uint yesvotes;
        mapping(address => bool) approvals;
    }

    mapping (uint => Request) public requests;
    address public manager;
    uint public minContribution; 
    mapping(address => bool) public approvers;
    uint public approverscnt;
    
    uint requestidx;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    constructor(uint minContri,address owner){
        manager= owner; //global variable 'msg'
        minContribution= minContri;
        
    }

    function contractBalance() public view returns(uint) {
  return address(this).balance;
}

    function contribute() public payable{

        require(msg.value > minContribution);
        
        approvers[msg.sender]= true;

        approverscnt++;
    }

    function createRequest(string memory desc,uint val,address rec) public restricted{
        
        Request storage  newReq =requests[requestidx++]; // new isntance of Request
            newReq.description = desc;
            newReq.value=val;
            newReq.recipient=rec;
            newReq.complete=false;
            newReq.yesvotes=0;
      
       //alternative syntax but not recommended 
       //(arguments should be in order to struct declarations)
       // Request(desc,val,reci,false);
    }

    function approveRequest(uint index) public{

        // is a valid contributor

        require(approvers[msg.sender]);

        // check not voted more than once
        require(!requests[index].approvals[msg.sender]);

        requests[index].approvals[msg.sender]=true;
        requests[index].yesvotes++;

    }

    function finalizeRequest(uint idx) public restricted payable{

        require(!requests[idx].complete);

        uint sufficientvotes= approverscnt/2;

        require(requests[idx].yesvotes >= sufficientvotes);

    
        payable(requests[idx].recipient).transfer(requests[idx].value);

         requests[idx].complete=true;
    }

    
    function noOfRequests() public view returns (uint) {

        return requestidx;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address){

        return (
            minContribution,

            contractBalance(),

            noOfRequests(),

            approverscnt,

            manager
        );

    }


}