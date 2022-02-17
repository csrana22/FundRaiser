import React, { useState } from 'react';
import {Form,Button,Message,Input} from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import {Link,Router} from '../../../routes';
import {abi,evm} from '../../../ethereum/build/Campaign.json';
import Layout from '../../../components/layout';

function RequestNew(props){

    const [val,setVal]= useState('');
    const [desc,setDesc]= useState('');
    const [recp,setRecp]= useState('');
    const [loading,setLoading]= useState(false);
    const [errMsg,setMsg]= useState('');

    async function onSubmit(e){
        e.preventDefault();

        const campaign= await new web3.eth.Contract(abi,props.address);

        setLoading(true);
        setMsg('');

        try{
            const accounts= await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                desc,
                web3.utils.toWei(val,'ether'),
                recp
            ).send({
                from: accounts[0]
            })

            Router.pushRoute(`/campaigns/${props.address}/requests`);
        }
        catch(err){
            setMsg(err.message);
        }

        setLoading(false);
    }

    return (
        <Layout>
        <Link route={`/campaigns/${props.address}/requests`}>
         <a>
            Back
         </a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={onSubmit} error={!!errMsg}>
            <Form.Field>
                <label>Description</label>
                <Input value={desc} onChange={(e)=>{setDesc(e.target.value)}}/>
            </Form.Field>

            <Form.Field>
                <label>Value</label>
                <Input value={val} onChange={(e)=>{setVal(e.target.value)}}/>
            </Form.Field>

            <Form.Field>
                <label>Recipient</label>
                <Input value={recp} onChange={(e)=>{setRecp(e.target.value)}} />
            </Form.Field>

            <Message error header="Oops!" content={errMsg} />

            <Button primary loading={loading}>Create Request</Button>
        </Form>
        </Layout>
    )
}

RequestNew.getInitialProps = async(props)=>{
    const address = props.query.address;

    return {address: address};
}

export default RequestNew;