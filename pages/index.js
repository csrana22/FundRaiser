import React, { useEffect } from 'react';
import Factory from '../ethereum/Factory.js';
import {Card, Button} from 'semantic-ui-react' ;
import Layout from '../components/layout';
import {Link} from '../routes';

const App=(props)=>{

    function renderCampaigns(){

        const items= props.campaigns.map(address=>{
        
           return {
               header: address,

               description: (
                <Link route= {`/campaigns/${address}`}>
                    <a>View Campaign</a>
                </Link>
               ),
               fluid:true
           };

        });

        return <Card.Group items={items} />
    }

    return(
        <Layout>
     
        <h3>Open Campaigns</h3>
        
        <Link route= '/campaigns/new'>
          <a>
            <Button floated= 'right' content="Create Campaign" icon="add" primary style={{marginTop: '1.3vh'}}/>
          </a>
        </Link>

        <h2>{renderCampaigns()}</h2>
     
        </Layout>

    )
}; 

App.getInitialProps= async()=>{
    const campaigns=  await Factory.methods.getDeployedContracts().call();

    return {campaigns};
}

export default App;