import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import { Backdrop, CircularProgress } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { ellipseAddress } from '../utils';
import { useState, useEffect } from 'react';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'dex', label: 'Dex', minWidth: 100 },
  {
    id: 'wallet',
    label: 'Wallet Address',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'time',
    label: 'Time',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'transactionHash',
    label: 'Transaction Hash',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'initialAssetAddr',
    label: 'Sell',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'initialAmount',
    label: 'Sell Amount',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'finalAssetAddr',
    label: 'Buy',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'finalAmount',
    label: 'Buy Amount',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amountUSD',
    label: 'Amount USD',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'r_pl',
    label: 'Profit & Lost',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];

export default function StickyHeadTable(props) {
  
  const [rows, updateRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [dataURL, setDataURL] = useState("http://52.206.158.38/dex_transactions/latest/?page=1&page_size=25");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData(dataURL);
  },[])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const newDataURL = "http://52.206.158.38/dex_transactions/latest/?page=" + (newPage+1) + "&page_size=" + rowsPerPage;
    setDataURL(newDataURL);
    getData(newDataURL);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    const newDataURL = "http://52.206.158.38/dex_transactions/latest/?page=1&page_size=" + event.target.value;
    setDataURL(newDataURL);
    setPage(0);
    getData(newDataURL);
  };

  const getData = async (_dataURL) =>   {
    const response = await axios.get(_dataURL);
    updateRows([]);
    setIsLoading(true);
    if(response.data) {
      const tempRows = [];
      setTotalCount(response.data["total_count"]);
      for(let index = 0; index < response.data["transactions"].length; index++){
        let data = createData(
          response.data["transactions"][index]._id, 
          response.data["transactions"][index].dex, 
          response.data["transactions"][index].wallet_address, 
          response.data["transactions"][index].block_number,
          response.data["transactions"][index].block_time,
          response.data["transactions"][index].block_timestamp,
          response.data["transactions"][index].tx_hash,
          response.data["transactions"][index].initial_asset_address,
          response.data["transactions"][index].initial_asset_symbol,
          response.data["transactions"][index].initial_amount,
          response.data["transactions"][index].final_asset_address,
          response.data["transactions"][index].final_asset_symbol,
          response.data["transactions"][index].final_amount,
          response.data["transactions"][index].amount_usd,
          response.data["transactions"][index].r_pl
        );
        tempRows.push(data);
      }
      setIsLoading(false);
      updateRows(tempRows);
    }
    else console.log("");
  }

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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', background:"#cfd8dc" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor:'#1976D2', color:"white" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{justifyContent:'center', textAlign:'center'}}>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            {rows
            .map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <>
                        {
                          column.id === "amountUSD" || column.id === "r_pl" ? (
                            <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                              {value ? `$${value.toLocaleString()}` : ""}
                            </TableCell>
                          ):(
                            <>
                              {
                                column.id === "finalAssetAddr"? (
                                  <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                    <a target="_blank" href={"https://etherscan.io/address/" + value}>{row.finalAssetSymbol}</a>
                                  </TableCell>  
                                ):(
                                  <>
                                    {column.id === "initialAssetAddr"? (
                                      <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                        <a target="_blank" href={"https://etherscan.io/address/" + value}>{row.initialAssetSymbol}</a>
                                      </TableCell>
                                    ):(
                                      <>
                                    {(column.id==="wallet")?(
                                      <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                        <a target="_blank" href={"https://etherscan.io/address/" + value}>{ellipseAddress(value)}</a>
                                      </TableCell>
                                    ):(
                                      <>
                                        {
                                          column.id==="transactionHash"?(
                                            <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                              <a target="_blank" href={"https://etherscan.io/tx/" + value}>{ellipseAddress(value)}</a>
                                            </TableCell>
                                          ):(
                                            <>
                                              {
                                              column.id === "initialAmount" || column.id=== "finalAmount" ?(
                                                <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                                  {value.toLocaleString()}
                                                </TableCell>
                                              ):(
                                                <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                                  {value}
                                                </TableCell>
                                              )
                                              }
                                            </>
                                          )
                                        }
                                      </>
                                    )}</>)}
                                  </>
                                )
                              }         
                            </>
                          )
                        }                        
                      </>
                    );
                  })}
                </TableRow>
              );
            })}
            
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{background:'white'}}
      />
    </Paper>
  );
}