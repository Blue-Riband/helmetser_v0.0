import { List, Button, Container, CssBaseline, makeStyles, TextField, Typography, Input, InputAdornment, InputLabel, IconButton, FormControl, Table  } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { member as v_member, basic, Values, SNACKBAR_TIME, } from "../request/values";
import axios from "axios";

import React, { useState, useEffect } from "react";
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
    locker: {
        display: 'flex',
        flexDirection: 'row',
    },
    room0:{
        

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
            <div>

                
            </div>
        )
    }
    else{
        return(
            <div>

            </div>
        )
    }
}

export default Locker;
