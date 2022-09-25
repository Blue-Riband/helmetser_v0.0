import { Button, Container, CssBaseline, makeStyles, TextField, Typography, Input, InputAdornment, InputLabel, IconButton, FormControl  } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { member as  v_member, basic, Values, SNACKBAR_TIME } from '../request/values';
import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSnackbar } from 'notistack';
import ToastStr from '../request/toastStr';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({

    nanumSquare_regular: {
        fontFamily: 'NanumR',
    },
    back : {
        marginLeft : '-1vh',
    },
    container: {
        width: '82%',
        marginTop: '7vh',
        padding: 0,
    },
    paper: {
        // marginTop: theme.spacing(8),
        // width: '82%',
        margin: 'auto',
        marginTop: '6vh',
        display: 'flex',
        flexDirection: 'column',
    },

}));

type iRecord = {
    memberId : string,
    helmetId : number,
    startLocker : number,
    startRoom : number,
    startDate : string,
    endLocker : number,
    endRoom : number,
    endDate : string
    status : number,
}

const SERVER = basic.server;

const MyUse: React.FC<any> = props => {
    const classes = useStyles();
    let history = useHistory();
    const state: any = history.location.state
    const {member} = props
    const [record, setRecord] = useState<iRecord[]>([])

    const getMyUse = () => {
        let url = new URL(SERVER + v_member.member + v_member.get_record);
        let params = {'member_id': member.id}
        url.search = new URLSearchParams(params).toString();
    
        axios({
            method: 'GET',
            withCredentials: true,
            url: url.toString(),
        }).then((res) => {
            return res.data
        }).then((data: any) => {
            console.log(data);
            if (data.code === Values.SUCCESS_CODE) {
                setRecord(data.member)
            } else if (data.code === Values.FAIL_CODE) {
            }
        })
    }

    useEffect(()=>{
        getMyUse()
    },[])


    return (
        <div></div>
    )
}

export default MyUse;