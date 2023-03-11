import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CSVLink } from "react-csv";
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

let headers = [
    { label: "_id", key: "_id" },
    { label: "startDate", key: "startDate" },
    { label: "description", key: "description" },
    { label: "selectOption", key: "selectOption" },
    { label: "amount", key: "amount" },
    { label: "summary", key: "summary" }
];
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#aabccf',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



function List({ onUpdate, tableList, onDelete }) {

    tableList.sort(function (a, b) {
        var c = new Date(a.startDate);
        var d = new Date(b.startDate);
        return c - d;
    })

    return (
        <Paper sx={{ overflow: 'hidden', marginBottom: "20px", marginLeft: "10px", marginRight: "20px" }}>
            <Typography sx={{ display: "flex", justifyContent: "end" }}>
                <CSVLink data={tableList} headers={headers} filename={'transaction'}>
                    <Button variant="contained" sx={{ mb: 1 }} endIcon={<DownloadIcon />}>
                        Download transaction
                    </Button>
                </CSVLink>
            </Typography>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr.No </StyledTableCell>
                            <StyledTableCell align="center">Date</StyledTableCell>
                            <StyledTableCell align="center">Descriptions&nbsp;</StyledTableCell>
                            <StyledTableCell align="center">income/expense&nbsp;</StyledTableCell>
                            <StyledTableCell align="center">Amount&nbsp;($)</StyledTableCell>
                            <StyledTableCell align="center">Summary&nbsp;</StyledTableCell>
                            <StyledTableCell align="center">Action&nbsp;</StyledTableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableList?.map((row, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.startDate.split('T')[0]}</StyledTableCell>

                                <StyledTableCell align="center">{row.description}</StyledTableCell>
                                <StyledTableCell align="center">{row.selectOption}</StyledTableCell>
                                <StyledTableCell align="center">{row.selectOption === "Income" ? <span style={{ color: "green" }}>+ {row.amount}</span> : <span style={{ color: "red" }}>-{row.amount}</span>}</StyledTableCell>
                                <StyledTableCell align="center">{row.summary}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <div className='main-action'>
                                        <div className='edit-icon' onClick={() => onUpdate(row, index)}>
                                            <EditIcon />
                                        </div>
                                        <div className='dels-icon' onClick={() => onDelete(row._id)}>
                                            <DeleteIcon />
                                        </div>
                                    </div>

                                </StyledTableCell>

                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
export default List