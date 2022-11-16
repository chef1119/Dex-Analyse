import React, { useState, useRef, useEffect } from 'react'
import { Box, FormControl, InputLabel, NativeSelect, Button, TextField, Typography } from "@mui/material";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TokenAnalyseTable from '../Components/Table/TokenAnalyseTable';
import axios from 'axios';

export default function TokenStatistics() {
  const [fromValue, setFromValue] = React.useState(dayjs('2022-01-01 00:00:00').format("YYYY-MM-DD 00:00:00"));
  const [toValue, setToValue] = React.useState(dayjs('2022-01-15 00:00:00').format("YYYY-MM-DD 00:00:00"));
  const [mode, setMode] = useState("winners");
  const [totalWinners, setTotalWinners] = useState(0);
  const [totalLosers, setTotalLosers] = useState(0);
  const [rows, updateRows] = useState([]);
  const [rows11, updateRows11] = useState(0);
  const [tokenAddr_tobeSent, updateTokenAddr] = useState("");
  const tokenAddr = useRef();

  const handleFromChange = (newValue) => {
    setFromValue(dayjs(newValue).format("YYYY-MM-DD HH:mm:ss"));
  };

  const handleToChange = (newValue) => {
    const today = new Date(newValue);
    let tomorrow = new Date(newValue);
    tomorrow.setDate(today. getDate() + 1);
    setToValue(dayjs(tomorrow).format("YYYY-MM-DD 00:00:00"));
  }

  const createData = (walletAddr, r_pl) => {
    return {walletAddr, r_pl};
  }


  const getData = async () => {
    let getUrl = "";
    if(mode === "winners") getUrl = "http://52.206.158.38/token/" + tokenAddr.current.value + "/traders/?from_time=" + fromValue + "&to_time=" + toValue + "&page_size=100&page=1&metric=winners";
    else getUrl = "http://52.206.158.38/token/" + tokenAddr.current.value + "/traders/?from_time=" + fromValue + "&to_time=" + toValue + "&page_size=100&page=1&metric=losers";
    await axios.get(getUrl).then((response) => {
      if(response.data) {
        const tempRows = [];
        for(let index = 0; index < response.data[mode].length; index++){
          let data = createData(
            response.data[mode][index].wallet_address, 
            response.data[mode][index].r_pl
          );
          tempRows.push(data);
        }
        updateTokenAddr(tokenAddr.current.value);
        setTotalWinners(response.data["total_winners"]);
        setTotalLosers(response.data["total_losers"]);
        updateRows11(1);
      }
      else console.log("");
    });
  }

  const handleModeChanged = (event) => {
    setMode(event.target.value);
  }

  return (
      <Box sx={{margin:'10px'}}>
        <Box sx={{display:'block', width:'100%', justifyContent:"center", textAlign:"center", textAlign:'center', marginTop:"30px"}}>
          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Typography variant='h3' style={{color:'#1976D2', marginLeft:'-20px'}}>Lemuria Token Analysis</Typography>
          </Box>
          <br></br>
          <Box style={{display:'block',marginTop:'15px'}}>
            <Box style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
              <TextField id="outlined-basic" inputRef={tokenAddr} label="Input Token Address" variant="outlined" style={{marginRight:"3%", width: "450px"}}/>
              <Box style={{display:'flex', justifyContent:'center'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} style={{display:'flex', marginTop:'30px', marginLeft:'3%'}}>
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
                        renderInput={(params) => <TextField {...params}/>}
                        sx={{marginLeft:'3%'}}
                      />
                    </div>                    
                </LocalizationProvider>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%", display:"inline-flex", justifyContent:"center", marginTop:'20px' }}>
            <FormControl style={{width:'200px'}}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                View Mode
              </InputLabel>
              <NativeSelect
                defaultValue={"winners"}
                inputProps={{
                  name: 'mode',
                  id: 'uncontrolled-native',
                }}
                onChange={handleModeChanged}
              >
                <option value={"winners"}>Winner</option>
                <option value={"losers"}>Loser</option>
              </NativeSelect>
            </FormControl>
            <Button variant="contained" type='submit' style={{marginLeft:"5%", backgroundColor:"#1976D2", width:"100px"}} onClick={getData}>Confirm</Button>
          </Box>
          <Box style={{marginTop:'30px'}}>
              <TokenAnalyseTable 
                rows11={rows11} 
                mode={mode} 
                fromValue={fromValue} 
                toValue={toValue} 
                tokenAddr={tokenAddr_tobeSent}
                totalLosers={totalLosers}
                totalWinners={totalWinners}
              ></TokenAnalyseTable>
          </Box>
        </Box>
      </Box>
    )
}
