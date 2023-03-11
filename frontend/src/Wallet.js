import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios';
import { toast } from 'react-toastify';
import List from './List';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const theme = createTheme();
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    overflow: 'scroll',
    maxHeight: "60%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Wallet() {
    const [userData, setUserData] = React.useState({
        startDate: new Date(),
        description: '',
        selectOption: "",
        amount: "",
        summary: '',
    })
    const [userDataError, setUserDataError] = React.useState({})
    const [tableList, setTableList] = React.useState([])
    const [active, setActive] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [balance, setBalance] = React.useState({
        IncomeBalance: 0,
        ExBalance: 0,
        TotalBalance: 0
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        let allErrors = {}
        Object.keys(userData).forEach(key => {
            const error = validation(key, userData[key])
            if (error && error.length) {
                allErrors[key] = error
            }
        });
        if (Object.keys(allErrors).length) {
            return setUserDataError(allErrors)
        } else {
            if (active === "") {

                AddList(userData)
            } else {
                EditList(userData)
            }
        }
    };

    const AddList = async (userData) => {
        const data = await axios.post('http://localhost:9090/api/v1/create', userData)
        if (data?.status) {
            toast.success('added successFully!')
            setUserData({
                startDate: new Date(),
                description: '',
                selectOption: "",
                amount: "",
                summary: '',
            })
            getList()
        } else {
            toast.error('something went to wrong !')
        }
    }

    const EditList = async (userData) => {
        const data = await axios.put(`http://localhost:9090/api/v1/edit/${active}`, userData)
        if (data?.status) {
            toast.success('Edit successFully!')
            setUserData({
                startDate: new Date(),
                description: '',
                selectOption: "",
                amount: "",
                summary: '',
            })
            getList()
            setActive("")
        }
    }

    const validation = (name, value) => {
        switch (name) {
            case 'description':
                if (!value) {
                    return 'description required *'
                } else {
                    return ''
                }

            case 'selectOption':
                if (!value) {
                    return 'selectOption required *'
                } else {
                    return ''
                }
            case 'amount':
                if (!value) {
                    return 'amount required *'
                } else {
                    return ''
                }
            default:
                break;
        }
    }

    const onUpdate = (value, index) => {
        setActive(value._id)
        setUserData({
            startDate: new Date(value.startDate),
            description: value?.description,
            selectOption: value?.selectOption,
            amount: value?.amount,
            summary: value?.summary,
        })
    }


    const onDelete = async (index) => {
        const data = await axios.delete(`http://localhost:9090/api/v1/delete/${index}`)
        if (data?.status) {
            toast.success("remove successfully !")
            getList()
        }
    }

    const getList = async () => {
        const data = await axios.get('http://localhost:9090/api/v1/listnotes')
        setTableList(data?.data?.data || [])
        if (data?.status) {
            const array = data?.data?.data;
            let TotalIncome = array.filter((val) => val.selectOption === 'Income').reduce((n, { amount }) => n + amount, 0)
            let TotalEx = array.filter((val) => val.selectOption === 'Expences').reduce((n, { amount }) => n + amount, 0)
            setBalance({
                IncomeBalance: TotalIncome,
                ExBalance: TotalEx,
                TotalBalance: TotalIncome - TotalEx
            })
        }
    }

    const onTogglehandle = (e) => {
        setOpen(e.target.checked)
    }

    React.useEffect(() => {
        getList()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#56747a' }}>
                        <AccountBalanceWalletIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{
                        fontFamily: 'serif',
                        fontWeight: 600
                    }}>
                        Wallet Balance :
                        {
                            balance?.TotalBalance > 0 ?
                                <span style={{ color: "green" }}> $ {balance?.TotalBalance}</span>
                                :
                                <span style={{ color: "red" }}> $ {balance?.TotalBalance}</span>

                        }
                    </Typography>
                    <Grid container sx={{ mt: 1 }}>
                        <Grid item xs>
                            <div className='wallet-class'>
                                <div>
                                    Income
                                </div>
                                <div className='balance-Total-In'>
                                    $ {balance?.IncomeBalance}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs>
                            <div className='wallet-class'>
                                <div>

                                    Expences
                                </div>
                                <div className='balance-Total-Ex'>
                                    $ - {balance?.ExBalance}
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <div>
                            <DatePicker selected={userData?.startDate} name='startDate' value={userData?.startDate} onChange={(date) =>
                                setUserData({ ...userData, ['startDate']: date })
                            }
                            />

                        </div>
                        <TextField
                            sx={{ mt: 1 }}
                            fullWidth id="outlined-basic"
                            label="Descriptions"
                            variant="outlined"
                            value={userData.description}
                            name='description'
                            onChange={(e) => handleChange(e)}
                            helperText={userDataError?.description?.length > 0 ? userDataError?.description : null}
                            error={userDataError?.description?.length > 0 ? true : false} />


                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel id="demo-simple-select-label">select</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="select Option"
                                name='selectOption'
                                value={userData.selectOption}
                                onChange={(e) => handleChange(e)}
                                helperText={userDataError?.selectOption?.length > 0 ? userDataError?.selectOption : null}
                                error={userDataError?.selectOption?.length > 0 ? true : false}
                            >
                                <MenuItem value={'Income'}>Income</MenuItem>
                                <MenuItem value={'Expences'}>Expences</MenuItem>
                            </Select>
                            <FormHelperText sx={{ color: 'red' }}>{userDataError?.selectOption?.length > 0 ? userDataError?.selectOption : null}</FormHelperText>

                        </FormControl>

                        <TextField
                            sx={{ mt: 1 }}
                            type='number'
                            fullWidth
                            id="outlined-basic"
                            label="Amount"
                            variant="outlined"
                            name='amount'
                            value={userData.amount}
                            onChange={(e) => handleChange(e)}
                            helperText={userDataError?.amount?.length > 0 ? userDataError?.amount : null}
                            error={userDataError?.amount?.length > 0 ? true : false}
                        />


                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            placeholder="Write summary (optional) .."
                            style={{ width: "100%", marginTop: "10px" }}
                            name='summary'
                            value={userData?.summary}
                            onChange={(e) => handleChange(e)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add
                        </Button>

                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={(e) => onTogglehandle(e)}
                            />} label={open ? <span className='textfamily'>close List History</span> : <span className='textfamily'>Open List History</span>} />
                        </FormGroup>
                    </Box>
                </Box>
            </Container>

            {
                open ?
                    (tableList?.length > 0 ?

                        <List
                            onUpdate={onUpdate}
                            tableList={tableList}
                            onDelete={onDelete}
                        /> :
                        null
                    ) :
                    null
            }

        </ThemeProvider>
    )
}

export default Wallet