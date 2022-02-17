const HDwallet= require('@truffle/hdwallet-provider');
const Web3= require('web3');
const {abi,evm} = require('./build/Factory.json');
const util= require('util');

const provider= new HDwallet( 
 'gown venture woman margin lawsuit mango social swing grief business maze obey',  // my account mnemonic
 'https://rinkeby.infura.io/v3/5f7bcae0994b4f8d94424bd95c13b8e2'   //path to rinkeby network
);

const web3= new Web3(provider);

const deploy = async() =>{

    const accounts= await web3.eth.getAccounts();   // our mnemonic points to many accounts.
    console.log(accounts[0]);

    const contract_instance=await new web3.eth.Contract(abi)
         .deploy({ data: evm.bytecode.object })
         .send({ gas:'5000000' , from: accounts[0]})
    
     console.log(util.inspect(abi,false,null,true));
     console.log(contract_instance.options.address);

     provider.engine.stop()  //deployment hangs without this
    
};

deploy();