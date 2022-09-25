import { List, Button, Container, CssBaseline, makeStyles, TextField, Typography, Input, InputAdornment, InputLabel, IconButton, FormControl, Table  } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { member as v_member, basic, Values, SNACKBAR_TIME, } from "../request/values";
import axios from "axios";

import React, { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';
import ToastStr from '../request/toastStr';
import { COLORS } from "./Theme";
import { textAlign } from "@material-ui/system";

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
        margin: '5vh 0',
        textAlign: 'center',
    },
    logo2 :{
        fontSize: '5vw',
        color: `${COLORS.HELMETSER}`,
        textAlign: 'center',
    },
    sul :{
        fontSize: '3vw',
        color: `${COLORS.HELMETSER}`,
        textAlign: 'right',
        marginRight: '10px',
    },
    locker: {
        display: 'grid',
        width: '100vw',
        height: '30vh',
        gridTemplateColumns: '1fr 1fr 1fr',
        //flexDirection: 'row',
    },
    room0:{
        width: '30vw',
        backgroundColor: 'green',
        opacity: '0.5',
        textAlign: 'center',
        lineHeight: '30vh',
        justifyContent: 'center',
        margin:'10px',
        borderRadius: '15px',
    },
    room1:{
        width: '30vw',
        backgroundColor: 'red',
        opacity: '0.5',
        textAlign: 'center',
        lineHeight: '30vh',
        justifyContent: 'center',
        margin:'10px',
        borderRadius: '15px',
    },
    room2:{
        width: '30vw',
        backgroundColor: 'orange',
        opacity: '0.5',
        textAlign: 'center',
        lineHeight: '30vh',
        justifyContent: 'center',
        margin:'10px',
        borderRadius: '15px',
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

type iRoom = {
    roomId: number;
    lockerId: number;
    status: number;
  };

const SERVER = basic.server;

const Locker: React.FC<any> = props => {
    const classes = useStyles();
    let history = useHistory();
    const state: any = history.location.state
    const { member} = props;
    const [room, setRoom] = useState<iRoom[]>([]);

    const getRoomsByLocker = () => {
        let url = new URL(SERVER + v_member.member + v_member.get_room);
        let params = {'locker_id': state.locker_id};
        url.search = new URLSearchParams(params).toString();
        
        axios({
          method: "GET",
          withCredentials: true,
          url: url.toString(),
        })
          .then((res) => {
            return res.data;
          })
          .then((data: any) => {
            console.log(data);
            if (data.code === Values.SUCCESS_CODE) {
              setRoom(data.room);
            } else if (data.code === Values.FAIL_CODE) {
            }
        });
    };



    useEffect(() => {
        getRoomsByLocker()
    },[]);
    console.log(state)

    return (
        <div>
            <Typography className = {classes.logo}>HELMETSER</Typography>
            <Typography className = {classes.logo2}>{state.locker_id}번 락커입니다!</Typography>
            <Typography className ={classes.sul}>* 초록: 사용가능 빨강: 사용중 주황: 고장입니다! </Typography>
            <Table className={classes.locker}>
                {room != null && room.map((item: any, index:number) =>{
                    return <AppListItem index={index} roomId = {item.roomId} status = {item.status}/>
                })}
            </Table>    
        </div>
    )
}
const AppListItem: React.FC<any> = props =>{
    const classes = useStyles();
    const { index, roomId, status } = props
    if(status == 0){
        return(
            <div className={classes.room0}>
                {roomId}
            </div>
        )
    }
    else if(status == 1){
        return (
            <div className={classes.room1}>
                {roomId}
            </div>
        )
    }
    else{
        return(
            <div className={classes.room2}>
                {roomId}
            </div>
        )
    }
}

export default Locker;
