import React, { useState, useRef } from 'react'
import { Box, Button, TextField, Typography } from "@mui/material";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import WalletAnalyseTable from '../Components/Table/WalletAnalyseTable';
import axios from 'axios';

export default function WalletStatistics() {
  const [fromValue, setFromValue] = React.useState(dayjs('2022-01-01 00:00:00').format("YYYY-MM-DD 00:00:00"));
  const [toValue, setToValue] = React.useState(dayjs().format("YYYY-MM-DD 00:00:00"));
  const [walletAddr_tobesent, updateWalletAddr] = useState("");
  const [tokenAddr_tobesent, updateTokenAddr] = useState("");
  const [rows11, updateRows11] = useState(0);
  const [totalCount, updateTotalCount] = useState(0);
  const [rows, updateRows] = useState([]);
  const tokenAddr = useRef();
  const walletAddr = useRef();

  const handleFromChange = (newValue) => {
    setFromValue(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"));
  };

  const handleToChange = (newValue) => {
    let today = new Date(newValue);
    let tomorrow = new Date(newValue);
    tomorrow.setDate(today. getDate() + 1);
    setToValue(dayjs(tomorrow).format("YYYY-MM-DD 00:00:00"));
  }

  const createData = (
    id, 
    timestamp, 
    time, 
    initialAssetAddr, 
    initialAssetSymbol, 
    initialAmount, 
    finalAssetAddr, 
    finalAssetSymbol, 
    finalAmount, 
    transactionHash,
    r_pl,
    r_pl_ID,
    r_pl_boughtAmount
    ) => {
    return {
        id, 
        timestamp, 
        time, 
        initialAssetAddr, 
        initialAssetSymbol, 
        initialAmount, 
        finalAssetAddr, 
        finalAssetSymbol, 
        finalAmount, 
        transactionHash,
        r_pl,
        r_pl_ID,
        r_pl_boughtAmount
    };
  }


  const getData = async () => {
    let getUrl = "http://52.206.158.38/wallet/" + walletAddr.current.value + "/realized_profits/?from_time=" + fromValue + "&to_time=" + toValue + "&page_size=100&page=1&token_address=" + tokenAddr.current.value;

    await axios.get(getUrl).then((response) => {
      if(response.data) {
        const tempRows = [];
        for(let index = 0; index < response.data["r_pls"].length; index++){
            const boughtData = response.data["r_pls"][index].r_pl_bought_data;
            let data = createData(
                response.data["r_pls"][index]._id, 
                response.data["r_pls"][index].block_timestamp,
                response.data["r_pls"][index].block_time,
                response.data["r_pls"][index].initial_asset_address,
                response.data["r_pls"][index].initial_asset_symbol,
                response.data["r_pls"][index].initial_amount,
                response.data["r_pls"][index].final_asset_address,
                response.data["r_pls"][index].final_asset_symbol,
                response.data["r_pls"][index].final_amount,
                response.data["r_pls"][index].tx_hash,
                response.data["r_pls"][index].r_pl,
                boughtData[0]._id,
                boughtData[0].amount
            );
            tempRows.push(data);
        }
        updateRows(tempRows);
        updateRows11(1);
        updateWalletAddr(walletAddr.current.value);
        updateTokenAddr(tokenAddr.current.value);
        updateTotalCount(response.data["total_count"]);
      }
      else console.log("");
    });
  }

  return (
      <Box sx={{margin:'10px'}}>
        <Box sx={{display:'block', width:'100%', justifyContent:"center", textAlign:"center", textAlign:'center', marginTop:"30px"}}>
          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Typography variant='h3' style={{color:'#1976D2', marginLeft:'-20px'}}>Lemuria Wallet Analysis</Typography>
          </Box>
          <Box style={{display:'block'}}>
            <Box style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs} style={{display:'flex', marginTop:'30px'}}>
                  <DesktopDatePicker
                    label="from"
                    inputFormat="MM/DD/YYYY HH:mm:ss"
                    value={fromValue}
                    onChange={handleFromChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <div style={{marginLeft: "20px"}}>
                    <DesktopDatePicker
                      label="to"
                      inputFormat="MM/DD/YYYY HH:mm:ss"
                      value={toValue}
                      onChange={handleToChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
              </LocalizationProvider>
              <Box sx={{ display:"inline-block", justifyContent:"center" }}>
                <TextField id="outlined-basic" inputRef={walletAddr} label="Input Wallet Address" variant="outlined" style={{width:"350px", marginLeft: "20px"}}/>
                <TextField id="outlined-basic" inputRef={tokenAddr} label="Input Token Address" variant="outlined" style={{width:"350px", marginLeft: "20px"}}/>
              </Box>
              <Box>
                <Button variant="contained" type='submit' style={{backgroundColor:"#1976D2", width:"100px", marginTop: "10px", marginLeft: "20px"}} onClick={getData}>Confirm</Button>
              </Box>
            </Box>
          </Box>
          <Box style={{marginTop:'30px'}}>
              <WalletAnalyseTable rows11={rows11} walletAddr={walletAddr_tobesent} tokenAddr={tokenAddr_tobesent} fromDate={fromValue} toDate={toValue} totalCount={totalCount}></WalletAnalyseTable>
          </Box>
        </Box>
      </Box>
    )
}
