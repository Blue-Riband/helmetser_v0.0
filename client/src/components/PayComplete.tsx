import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import ToastStr from '../request/toastStr';
import { member as v_member, basic, Values, SNACKBAR_TIME } from '../request/values';

const SERVER = basic.server;

const PayComplete: React.FC<any> = props =>  {
    let history = useHistory();
    const state: any = history.location.state
    console.log(history.location)
    const {member} = props
    const { enqueueSnackbar } = useSnackbar();

    const [check, setCheck] = useState<boolean>(false);


    const submitHandler = () => {
        axios({
            method: "POST",
            params : {
                cid: "TC0ONETIME",
                tid: window.localStorage.getItem("tid"),
                partner_order_id: "partner_order_id",
                partner_user_id: "partner_user_id",
                pg_token: history.location.search.split("=")[1]
            },
            url: "https://kapi.kakao.com/v1/payment/approve",
            headers: {
              // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
              Authorization: "KakaoAK 270d461bf4570bdda8b5c7dad6233c46",
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              //"Access-Control-Allow-Origin": '*',
            },
            withCredentials: false,
        }).then((response) => {
            console.log('res?', response);
            if(response.status === 200){
                enqueueSnackbar(ToastStr.PAY_SUCCESS_STR, { variant: "success", autoHideDuration: SNACKBAR_TIME })
                setCheck(true)
            }
            else{
                enqueueSnackbar(ToastStr.PAY_FAIL_STR, { variant: "error", autoHideDuration: SNACKBAR_TIME })
                history.push('/map')
            }
        }).catch((error: any)=>{
            console.log('error?', error);
        })
    }

    const postMoney = () => {
        axios({
          method: "POST",
          data: {
            member_id: member.id,
            point: window.localStorage.getItem("money"),
          },
          withCredentials: true,
          url: SERVER + v_member.member + v_member.point,
    
          headers: { "Access-Control-Allow-Origin": basic.server_url, mode: 'cors', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }
        })
          .then((res) => {
            console.log('res?', res);
    
            return res.data
          }).then((data: any) => {
            // console.log('data?', data)
            if (data.code === Values.SUCCESS_CODE) {
                history.push('/map')
            } else {
              // window.postMessage(data.member.id, '*'
            }
          }).catch((error: any) => {
            if (error.response) {
              console.log('error?', error.response)
              if (error.response.status === 400) {
                enqueueSnackbar(ToastStr.LOGIN_FAIL, { variant: "error", autoHideDuration: SNACKBAR_TIME })
              } else if (error.response.status === 401) {
                enqueueSnackbar(ToastStr.PWD_CHECK_FALSE_STR, { variant: "error", autoHideDuration: SNACKBAR_TIME })
              }
            }
          })
      }

    useEffect(()=>{
        if(check){
            postMoney()
        }
    },[check])
    useEffect(()=>{
        submitHandler()
    },[])


    return (
        <div>
            <h2>Result page</h2>
        </div>
    );

};

export default PayComplete;