import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ellipseAddress } from '../utils';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'dex', label: 'Dex', minWidth: 100 },
  {
    id: 'wallet',
    label: 'Wallet',
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
  const rows = props.rows;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', background: "#cfd8dc" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#1976D2', color: "white" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover role="checkbox" tabIndex={-1} key={rows.id}>
              {columns && columns.map((column) => {
                const value = rows[column.id];
                return (
                  <>
                    {
                      column.id === "amountUSD" || column.id === "r_pl" ? (
                        <TableCell key={column.id} align={column.align} style={{background:'white'}}>
                          {value ? `$${value.toLocaleString()}` : ""}
                        </TableCell>
                      ): (
                        <>
                          {
                            column.id === "finalAssetAddr" ? (
                              <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
                                <a target="_blank" href={"https://etherscan.io/address/" + value}>{rows.finalAssetSymbol}</a>
                              </TableCell>
                            ) : (
                              <>
                                {column.id === "initialAssetAddr" ? (
                                  <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
                                    <a target="_blank" href={"https://etherscan.io/address/" + value}>{rows.initialAssetSymbol}</a>
                                  </TableCell>
                                ) : (
                                  <>
                                    {(column.id === "wallet") ? (
                                      <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
                                        <a target="_blank" href={"https://etherscan.io/address/" + value}>{ellipseAddress(value)}</a>
                                      </TableCell>
                                    ) : (
                                      <>
                                        {
                                          column.id === "transactionHash" ? (
                                            <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
                                              <a target="_blank" href={"https://etherscan.io/tx/" + value}>{ellipseAddress(value)}</a>
                                            </TableCell>
                                          ) : (
                                            <>
                                              {
                                                column.id === "initialAmount" || column.id === "finalAmount" ? (
                                                  <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
                                                    {value?.toLocaleString() ?? ""}
                                                  </TableCell>
                                                ) : (
                                                  <TableCell key={column.id} align={column.align} style={{ background: 'white' }}>
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
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}