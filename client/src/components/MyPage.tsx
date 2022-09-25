import { Button, Container, CssBaseline, makeStyles, TextField, Typography, Input, InputAdornment, InputLabel, IconButton, FormControl  } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { member as  v_member, basic, Values, SNACKBAR_TIME } from '../request/values';
import React, { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import ToastStr from '../request/toastStr';
import axios from "axios";
import { useCookies } from "react-cookie";import { COLORS } from "./Theme";

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({

    nanumSquare_regular: {
        fontFamily: 'NanumR',
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
    memberInfo: {
        fontSize: '5vw',
        margin: '3vh 0',
    },
}));

type iMember = {
    memberId : string,
    regDate : string,
    point : number,
    membershipCode : number,
    name : string,
    phone : string,
}

const SERVER = basic.server;

const MyPage: React.FC<any> = props => {
    const classes = useStyles();
    let history = useHistory();
    const state: any = history.location.state
    const {member} = props
    const [memberInfo, setMember] = useState<iMember[]>([])

    const getMember = () => {
        let url = new URL(SERVER + v_member.member + v_member.get_member);
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
                setMember(data.member)
            } else if (data.code === Values.FAIL_CODE) {
            }
        })
    }

    useEffect(()=>{
        getMember()
    },[])
    /*

            <Typography className = {classes.memberInfo}>아이디: {memberInfo[0].memberId}</Typography>
            <Typography className = {classes.memberInfo}>이름: {memberInfo[0].name}</Typography>
            <Typography className = {classes.memberInfo}>포인트: {memberInfo[0].point}</Typography>
            <Typography className = {classes.memberInfo}>등급 점수: {memberInfo[0].membershipCode}</Typography>
            <Typography className = {classes.memberInfo}>가입 날짜: {memberInfo[0].regDate}</Typography>
    */
    return (
        <div className = {classes.container}>
            <Typography className = {classes.logo}>HELMETSER</Typography>


        </div>
    );
};

export default MyPage;