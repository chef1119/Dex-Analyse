import React, { useEffect, useState, useRef } from 'react'
import { Box, Typography, TextField, Button } from "@mui/material";
import DataTable from '../Components/Table/DexTable';
import SearchResultTable from '../Components/Table/OneTransaction';
import axios from 'axios';

export default function Explore() {

  const [oneTx, updateOneTx] = useState([]);
  const [isTotal, updateIsTotal] = useState(true);
  const [searchTxID, updateSearchTxID] = useState("");
  const textRef = useRef();

  const createData = (
    id, 
    dex, 
    wallet, 
    blockNumber, 
    time,
    timestamp, 
    transactionHash, 
    initialAssetAddr, 
    initialAssetSymbol, 
    initialAmount, 
    finalAssetAddr, 
    finalAssetSymbol, 
    finalAmount, 
    amountUSD, 
    r_pl) => {
    return {
      id, 
      dex, 
      wallet, 
      blockNumber, 
      time, timestamp, 
      transactionHash, 
      initialAssetAddr, 
      initialAssetSymbol, 
      initialAmount, 
      finalAssetAddr, 
      finalAssetSymbol, 
      finalAmount, 
      amountUSD, 
      r_pl
    };
  }

  const txIDChanged = () => {
    updateSearchTxID(textRef.current.value);
    searchTx();
  }

  const searchTx = async () => {
    if(!textRef.current.value) {
      updateIsTotal(true);
    }
    else {
      const dexOneDataURL = "http://52.206.158.38/dex_transactions/"+textRef.current.value+"/detail/";
      updateIsTotal(false);
      await axios.get(dexOneDataURL).then((response) => {
        if(response.data) {
            let data = createData(
              response.data["_id"], 
              response.data["dex"], 
              response.data["wallet_address"], 
              response.data["block_number"],
              response.data["block_time"],
              response.data["block_timestamp"],
              response.data["tx_hash"],
              response.data["initial_asset_address"],
              response.data["initial_asset_symbol"],
              response.data["initial_amount"],
              response.data["final_asset_address"],
              response.data["final_asset_symbol"],
              response.data["final_amount"],
              response.data["amount_usd"],
              response.data["r_pl"]
            );
          updateOneTx(data);
        }
        else console.log("");
      });
    }
  }

  return (
    <Box sx={{margin:'10px'}}>
    <Box sx={{display:'block', width:'100%', justifyContent:"center", textAlign:'center', marginTop:"30px"}}>
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Typography variant='h3' style={{color:'#1976D2', marginLeft:'-20px'}}>Lemuria Dex Transactions</Typography>
      </Box>
        <Box sx={{display:'flex', justifyContent:"center", marginTop:"50px"}}>
            <TextField id="outlined-basic" inputRef={textRef} label="Input Transaction ID" variant="outlined"/>
            <Button variant="contained" type='submit' style={{marginLeft:"5%", backgroundColor:"#1976D2"}} onClick={txIDChanged}>Confirm</Button>
        </Box>
        {isTotal==true?(
          <Box style={{marginTop:'30px'}}>
            <DataTable></DataTable>
          </Box>
        ):(
          <Box style={{marginTop:'3%'}}>
            <SearchResultTable rows={oneTx}></SearchResultTable>
          </Box>
        )}
        
      </Box>
    </Box>
  )
}
