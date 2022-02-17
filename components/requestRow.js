import React from 'react';
import {Table,Button} from 'semantic-ui-react';
import {abi,evm} from '../ethereum/build/Campaign.json';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

function RequestRow(props){

    const {Row, Cell}= Table;
    const {id,request,appCnt}= props;
    const readyToFinalize= request.yesvotes >= appCnt/2;

    async function onApprove(){
        const accounts= await web3.eth.getAccounts();

        const campaign= await new web3.eth.Contract(abi,props.address);

        await campaign.methods.approveRequest(id).send({
            from: accounts[0]
        });

        Router.replaceRoute(`/campaigns/${props.address}/requests`)
    };

    async function onFinalize(){
        const accounts= await web3.eth.getAccounts();

        const campaign= await new web3.eth.Contract(abi,props.address);

        await campaign.methods.finalizeRequest(id).send({
            from: accounts[0]
        });

        Router.replaceRoute(`/campaigns/${props.address}/requests`)

    };



    return(
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id} </Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
            <cell>{request.recipient}</cell>
            <Cell>{request.yesvotes}/{appCnt}</Cell>
            <Cell>
                {request.complete? null : (<Button color='green' basic onClick={onApprove}> Approve </Button>)}
            </Cell>
            <Cell> {request.complete?null : (<Button color='teal' basic onClick={onFinalize}> Finalize </Button>)} 
            </Cell>
        </Row>
    )
}

export default RequestRow;