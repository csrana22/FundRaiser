import React, { useState } from 'react';
import Layout from '../../components/layout';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';


function NewCampaign(){

    const [minContri, setMinContri]= useState(0);
    const [errMsg,setMsg]= useState('');
    const [loading,setLoading] = useState(false);

    async function onSubmit(e){

        e.preventDefault();

        setLoading(true);
        setMsg('');

        try{
            const accounts= await web3.eth.getAccounts();
            await factory.methods.createCampaign(minContri)
            .send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        }
        catch(err){
            setMsg(err.message);
        }
        setLoading(false);

    };

    return (
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error= {!!errMsg}>
                <Form.Field>   
                    <label>Minimum Contribution</label>
                    <Input label='wei' labelPosition='right' value={minContri} onChange={(e)=> setMinContri(e.target.value)} />
                </Form.Field>

                <Message error header="Oops!" content={errMsg}/>
                 
                <Button primary loading={loading}>Create Campaign</Button>
            </Form>
        </Layout>
    )
}

export default NewCampaign;