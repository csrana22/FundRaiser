import React from 'react';
import Layout from '../../components/layout';
import web3 from '../../ethereum/web3';
import {abi,evm} from '../../ethereum/build/Campaign.json';
import {Card, Grid,Button} from 'semantic-ui-react';
import ContributeForm from '../../components/contribute';
import {Link} from '../../routes';

function CampaignShow(props){

    function renderCards(){
        const items= [
            {
                header: props.manager ,
                meta:'Address of Manager',
                description: 'Manager created this campaign and can issue requests to withdraw money'  
            },
            {
                header: web3.utils.fromWei(props.balance,'ether') ,
                meta:'Campaign Balance (ether)',
                description: "Balance is the net amount left in the campaign's account"
            },
            {
                header: props.minimumContribution ,
                meta:'Minimum Contribution (wei)',
                description: 'You are advised to contribute at least this much wei to become an approver'
            },
            {
                header: props.reqCnt ,
                meta:'Number of Requests issued',
                description: 'A request tries to withdraw money with the consent of atleast 50% of the approvers'
            },
            {
                header: props.approversCnt,
                meta:'Number of Approvers',
                description: 'Approvers are the people who have contributed to this campaign'
            }
        ]

        return (
            <Card.Content style={{overflowWrap: 'break-word'}}>

                <Card.Group items={items} >
                </Card.Group>

            </Card.Content>
        )
    }
 
    return (
        <Layout>
        <h3>Campaign Details</h3>

        <Grid>
            <Grid.Row>
            <Grid.Column width={10}>
                 {renderCards()}
            </Grid.Column>

            <Grid.Column width={6}>
                 <ContributeForm address={props.address}/>
            </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Link route= {`/campaigns/${props.address}/requests`}>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>
                    </Link>
                </Grid.Column>
            </Grid.Row>

        </Grid>
      
        </Layout>
    );
}

CampaignShow.getInitialProps= async(props)=>{

        const campaign= await new web3.eth.Contract(abi,props.query.address);

        const summary= await campaign.methods.getSummary().call();

         return { 
             address: props.query.address,
             minimumContribution: summary['0'],
             balance: summary['1'],
             reqCnt: summary['2'],
             approversCnt: summary['3'],
             manager: summary['4']
        };
}

export default CampaignShow;