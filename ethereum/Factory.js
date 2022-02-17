import web3 from './web3';
import {abi,evm} from './build/Factory.json';

const instance= new web3.eth.Contract(
    abi,
    '0x4E2EDD817D8A4d9ff65fCeE69DABC19D64F42769'
);

export default instance;