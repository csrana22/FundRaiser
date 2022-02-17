
const assert = require('assert');
const ganache= require('ganache-cli');
const Web3= require('web3');
const web3= new Web3(ganache.provider());

const {abi,evm}= require('../ethereum/build/Factory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{

    accounts= await web3.eth.getAccounts();

    factory= await new web3.eth.Contract(abi)
    .deploy({data: evm.bytecode.object})
    .send({from: accounts[0] , gas: '5000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress]=await factory.methods.getDeployedContracts().call();
 
    campaign= await new web3.eth.Contract(
         compiledCampaign['abi'],
        campaignAddress
    );

});

describe('Campaigns',()=>{

    it('deploy',()=>{
         assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
});