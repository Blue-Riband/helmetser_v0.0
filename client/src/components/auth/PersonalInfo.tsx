import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useHistory } from "react-router-dom";

import axios from 'axios'

import { COLORS } from '../Theme'

import { useSnackbar } from 'notistack';
import { useCookies } from "react-cookie";
import ToastStr from '../../request/toastStr';
import { SNACKBAR_TIME, Values } from '../../request/values'

import { member as v_member, basic } from '../../request/values';
const SERVER = basic.server;


const useStyles = makeStyles((theme) => ({
    background: {
        position: 'absolute',
        top: 0,
        width: '100vw',
        height: '100vh',
        background: `url("/images/background.png")`,
    },
    container: {
        padding: 0,
        height: '100vh',
    },
    paper: {
        // marginTop: theme.spacing(8),
        marginTop: '15vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        width: '80%',
        alignItems: 'left'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '80%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        height: 60,
        margin: theme.spacing(3, 0, 2),
        borderRadius: '27px',
        boxShadow: '6px 3px 6px 0 rgba(0, 0, 0, 0.16)',
        border: 'solid 0.5px #cfd4d9',
        backgroundColor: 'red',
        color: `${COLORS.WATER_BLUE}`,
        textColor: '#ffffff',
    },
    logoSection: {
        position: 'absolute',
        bottom: '5vh',
        width: '100vw',
        textAlign: 'center'
    },
}));

const PersonalInfo: React.FC<any> = props => {
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();
    let history = useHistory();
    const state: any = history.location.state
    const { email, password } = state;

    const { setMember, token } = props
    const [cookies, setCookie, removeCookie] = useCookies();
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        if (id === 'name') setName(value);
        else setPhone(value);
    }

    const checkData = () => {
        if (name.length < 2 || name.length > 10) {
            enqueueSnackbar(ToastStr.NAME_ET_CHECK_STR, { variant: "warning", autoHideDuration: SNACKBAR_TIME })
            return false;
        }
        if (phone.length !== 11) {
            enqueueSnackbar(ToastStr.PHONE_ET_CHECK_STR, { variant: "warning", autoHideDuration: SNACKBAR_TIME })
            return false;
        }
        console.log('check true')
        return true;
    }

    const handleButton = (event: any) => {
        // event.preventDefault();

        // console.log(email, password)

        if (!checkData()) {
            console.log('check false')
            return;
        }


        axios({
            method: "POST",
            data: {
                name: name,
                phone: phone,
                email: email,
                pwd: password,
                token: token,
            },
            withCredentials: true,
            url: SERVER + v_member.member + v_member.join,
        })
            .then((res) => {
                return res.data
            }).then((data: any) => {
                console.log(data)
                if (data.code === Values.SUCCESS_CODE) {
                    setMember({ id: email, name: name })
                    setCookie('access', data.jwt)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
                    history.push({
                        pathname: '/map',
                    });
                } else {
                    if (data.code === Values.FAIL_CODE) {
                        enqueueSnackbar(ToastStr.JOIN_FAIL_STR, { variant: "warning", autoHideDuration: SNACKBAR_TIME })
                    } else {
                        enqueueSnackbar(ToastStr.REQUEST_GET_POST_FAIL_STR, { variant: "error", autoHideDuration: SNACKBAR_TIME })
                    }
                }
            })
    }

    return (
        <div className={classes.background}>
            <Container component="main" className={classes.container}>
                <CssBaseline />
                <div className={classes.paper}>
                    <div className={classes.title}>
                        <Typography variant="h6" style={{ color: 'red' }}>
                            HELMETSER
                        </Typography>
                    </div>

                    <div className={classes.form}>
                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="이름"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            InputProps={{ style: { fontSize: '4vw' } }}
                            InputLabelProps={{ style: { fontSize: '3vw' } }}
                            value={name}
                            onChange={valueChangeHandler}
                            style={{ color: `${COLORS.charcoal_grey}` }}
                        />
                        <TextField
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            name="phone"
                            label="전화번호"
                            id="phone"
                            autoComplete="phone"
                            InputProps={{ style: { fontSize: '4vw' } }}
                            InputLabelProps={{ style: { fontSize: '3vw' } }}
                            value={phone}
                            onChange={valueChangeHandler}
                            style={{ color: `${COLORS.charcoal_grey}` }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={handleButton}
                        >
                            <Typography variant="h3">
                                회원가입
                            </Typography>
                        </Button>
                    </div>
                </div>
            </Container>
        </div>


    );
}
export default PersonalInfo;