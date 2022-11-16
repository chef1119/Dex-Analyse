import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Backdrop, CircularProgress } from '@mui/material';
import { ellipseAddress } from '../utils';
import { useState, useEffect } from 'react';
import axios from 'axios';

const columns = [
  { id: 'walletAddr', label: 'Wallet Address', minWidth: 170 },
  { id: 'r_pl', label: 'Profit & Lost', minWidth: 100 },
];

export default function StickyHeadTable(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rows, updateRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(props.rows11 == 1) {
      let getUrl="";
      if(props.mode === "winners") getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + rowsPerPage + "&page=1&metric=winners";
      else getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + rowsPerPage + "&page=1&metric=losers";
      getData(getUrl);
      setIsLoading(true);
    }
  }, [props]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    let getUrl="";
    if(props.mode === "winners") getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + rowsPerPage + "&page=" + (newPage+1) + "&metric=winners";
    else getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + rowsPerPage + "&page=" + (newPage+1) + "&metric=losers";
    getData(getUrl);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    let getUrl = "";
    if(props.mode === "winners") getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + event.target.value + "&page=" + (page+1) + "&metric=winners";
    else getUrl = "http://52.206.158.38/token/" + props.tokenAddr + "/traders/?from_time=" + props.fromValue + "&to_time=" + props.toValue + "&page_size=" + event.target.value + "&page=" + (page+1) + "&metric=losers";
    getData(getUrl);
  };
  const createData = (walletAddr, r_pl) => {
    return {walletAddr, r_pl};
  }


  const getData = async (_getUrl) => {
    await axios.get(_getUrl).then((response) => {
      if(response.data) {
        const tempRows = [];
        for(let index = 0; index < response.data[props.mode].length; index++){
          let data = createData(
            response.data[props.mode][index].wallet_address, 
            response.data[props.mode][index].r_pl
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
              <TableRow style={{justifyContent:'center'}}>
                <CircularProgress/>
              </TableRow>
            ) : (
              <>
                {rows
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.walletAddr}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <>
                              {column.id==="walletAddr"?(
                                <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                  <a target="_blank" href={"https://etherscan.io/address/" + value}>{value}</a>
                                </TableCell>
                              ):(
                                <>
                                  {
                                  column.id === "r_pl"?(
                                    <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                      {value && value > 0 ? `$${parseInt(value).toLocaleString()}` : (value && value < 0 ? `-$${(-1*parseInt(value)).toLocaleString()}` : "")}
                                    </TableCell>
                                  ):(
                                    <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                                      {value}
                                    </TableCell>
                                  )
                                  }
                                </>
                              )}
                            </>
                          );
                        })}
                      </TableRow>
                    );
                })}
              </>
            )
            }
            
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={props.mode === "winners" ? props.totalWinners : props.totalLosers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{background:'white'}}
      />
    </Paper>
  );
}