import React from 'react';
import Layout from '../../../components/layout';
import {Button,Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import web3 from '../../../ethereum/web3';
import {abi,evm} from '../../../ethereum/build/Campaign.json';
import RequestRow from '../../../components/requestRow';

function RequestIdx(props){

    const {Header,Row,HeaderCell,Body}= Table;

    function renderRows(){
        return props.requests.map((req,idx)=>{
            return (
            <RequestRow 
                key={idx}
                id={idx}
                request={req}
                address= {props.address}
                appCnt= {props.appCnt}
            />
            )
        }) 
    }

    return(
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${props.address}/requests/new`}>
             <a>
                <Button primary floated='right' style={{marginBottom: '4vh'}}>Add Request</Button>  
             </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>

                <Body>
                    {renderRows()}
                </Body>
            </Table>

            <div>Found {props.reqCnt} requests</div>
        </Layout>
    )
}
RequestIdx.getInitialProps=async(props)=>{

    const campaign= await new web3.eth.Contract(abi,props.query.address);

    const reqCnt= await campaign.methods.noOfRequests().call();

    const requests= await Promise.all(
        Array(parseInt(reqCnt)).fill().map((ele,idx)=>{
            return campaign.methods.requests(idx).call();
        })
    )

    const appCnt= await campaign.methods.approverscnt().call();

    return{
        address: props.query.address,
        requests,
        reqCnt,
        appCnt
    }
}

export default RequestIdx;