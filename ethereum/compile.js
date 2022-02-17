const path= require('path');
const solc= require('solc');
const fs= require('fs-extra');

const buildPath= path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath= path.resolve(__dirname,'contracts','campaign.sol');

const src= fs.readFileSync(campaignPath,'utf8');

const input = {
    language: 'Solidity',
    sources: {
      'campaign.sol': {
        content: src,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

const output= JSON.parse(solc.compile(JSON.stringify(input))).contracts['campaign.sol'];


//console.log(output);

fs.ensureDirSync(buildPath);

for(let contract in output){
    fs.outputJSONSync(
        path.resolve(buildPath,contract + '.json'),
        output[contract]
    );
    
}