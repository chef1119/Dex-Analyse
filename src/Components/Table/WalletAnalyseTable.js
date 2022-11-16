import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { ellipseAddress } from '../utils';
import axios from 'axios';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  {
    id: 'time',
    label: 'Time',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'initialAssetAddr',
    label: 'Initial Asset Address',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'initialAmount',
    label: 'Initial Amount',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'finalAssetAddr',
    label: 'Final Asset Address',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },  
  {
    id: 'finalAmount',
    label: 'Final Amount',
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
    id: 'r_pl',
    label: 'Profit & Lost',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'r_pl_boughtData',
    label: 'Bought Data',
    minWidth: 270,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  }
];

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [rows, updateRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(props.rows11 == 1) {
      let getURL = "http://52.206.158.38/wallet/" + props.walletAddr + "/realized_profits/?from_time=" + props.fromDate + "&to_time=" + props.toDate + "&page_size=" + rowsPerPage + "&page=" + (page+1) + "&token_address=" + props.tokenAddr;
      getData(getURL);
      setIsLoading(true);
    }
  }, [props]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let getURL = "http://52.206.158.38/wallet/" + props.walletAddr + "/realized_profits/?from_time=" + props.fromDate + "&to_time=" + props.toDate + "&page_size=" + rowsPerPage + "&page=" + (newPage+1) + "&token_address=" + props.tokenAddr;
    getData(getURL);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    let getURL = "http://52.206.158.38/wallet/" + props.walletAddr + "/realized_profits/?from_time=" + props.fromDate + "&to_time=" + props.toDate + "&page_size=" + event.target.value + "&page=" + (page+1) + "&token_address=" + props.tokenAddr;
    getData(getURL);
  };
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
    r_pl_boughtData
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
        r_pl_boughtData
    };
  }

  const getData = async (_getUrl) => {

    await axios.get(_getUrl).then((response) => {
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
                boughtData
            );
            tempRows.push(data);
        }
        updateRows(tempRows);
        setIsLoading(false);
      }
      else console.log("");
    });
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
          <TableBody>
            {isLoading?(
              <TableRow>
                <CircularProgress/>
              </TableRow>
            ):(
              <>
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
                                            {
                                              column.id==="transactionHash"?(
                                                <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                                  <a target="_blank" href={"https://etherscan.io/tx/" + value}>{ellipseAddress(value)}</a>
                                                </TableCell>
                                              ):(
                                                <>
                                                  {
                                                  column.id === "initialAmount" || column.id=== "finalAmount" ? (
                                                    <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                                      {value.toLocaleString()}
                                                    </TableCell>
                                                  ):(
                                                    <>
                                                    {column.id === "r_pl_boughtData" ? (
                                                      <TableCell key={column.id} align={column.align} style={{background:'white'}} colSpan={2}>
                                                        {
                                                          value.map((data) => {
                                                            const idOutPut = "ID : " + data._id;
                                                            const amountOutPut = "Amount : " + data.amount.toFixed(3);
                                                            return(
                                                              <TableRow>
                                                                <TableCell key={column.id + "detail"} align={column.align} style={{background:'white'}}>
                                                                  <TableRow>
                                                                    {idOutPut}
                                                                  </TableRow>
                                                                  <TableRow>
                                                                    {amountOutPut}
                                                                  </TableRow>
                                                                </TableCell>
                                                              </TableRow>
                                                            )
                                                          })
                                                        }
                                                      </TableCell>
                                                    ):(
                                                      <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                                        {value}
                                                      </TableCell>
                                                    )}
                                                    </>
                                                  )
                                                  }
                                                </>
                                              )
                                            }
                                          </>
                                        )}
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
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={props.totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{background:'white'}}
      />
    </Paper>
  );
}