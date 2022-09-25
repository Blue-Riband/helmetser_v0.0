import { Button, Container, CssBaseline, makeStyles, TextField, Typography, Input, InputAdornment, InputLabel, IconButton, FormControl  } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { member as basic, SNACKBAR_TIME } from '../request/values';

import React, { useState } from "react";
import { useSnackbar } from 'notistack';
import ToastStr from '../request/toastStr';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { useCookies } from "react-cookie";import { COLORS } from "./Theme";
;

const useStyles = makeStyles((theme) => ({

    nanumSquare_regular: {
        fontFamily: 'NanumR',
    },
    back : {
        marginLeft : '-1vh',
    },
    logo :{
        fontSize: '10vw',
        fontWeight: 'bolder',
        color: `${COLORS.HELMETSER}`,
        margin: '10vh 0'
    },
    container: {
        backgroundColor: 'white',
        width: '100vw',
        marginTop: '15vh',
        textAlign: 'center',
    },
    logout: {
        width: '25vw',
        fontSize: "4vw",
        border: "none",
        boxShadow: "2px 2px 10px grey",
        borderRadius: "10px",
        color: `${COLORS.HELMETSER}`,
    },

}));



const Setting: React.FC<any> = props => {
    const classes = useStyles();
    let history = useHistory();
    const state: any = history.location.state
    const [cookies, setCookie, removeCookie] = useCookies();
    const { member, deleteMember } = props;
    const logout = () => {
        removeCookie("access");
        deleteMember()
        history.push('/');
    }

    return (
        <div className = {classes.container}>
            <Typography className = {classes.logo}>HELMETSER</Typography>
            <Button className = {classes.logout}
                onClick = {logout}>
                <Typography>
                    로그아웃
                </Typography>
            </Button>

        </div>
    )
}

export default Setting;