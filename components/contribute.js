import React, { useState } from 'react';
import {Form, Input, Message, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import {abi,evm} from '../ethereum/build/Campaign.json';
import { Router } from '../routes';

function Contribute(props){

    const [val,setVal]= useState('');
    const [errMsg, setMsg]= useState('');
    const [loading,setLoading] = useState(false);

   async function onSubmit(e){
        e.preventDefault();

        const address= props.address;

        const campaign= await new web3.eth.Contract(abi, address);
        setLoading(true);
        setMsg('');

        try{
            const accounts= await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(val, 'ether')
            })

            Router.replaceRoute(`/campaigns/${props.address}`)
        }
        catch(err){
            setMsg(err.message);
        }

        setLoading(false);
        setVal('');

    }

    return (

        <Form onSubmit= {onSubmit} error={errMsg}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input value={val} onChange={(e)=>{ setVal(e.target.value)}} label='ether' labelPosition='right' />
            </Form.Field>

            <Message error header="Oops!" content={errMsg} />
            <Button primary loading={loading}>Contribute</Button>
        </Form>
    )

}

export default Contribute;