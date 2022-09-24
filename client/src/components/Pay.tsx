import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { basic } from '../request/values';
import { parseAsync } from "@babel/core";
import { TextField, Button } from "@material-ui/core";

const Pay: React.FC<any> = props =>  {
    let history = useHistory();
    const state: any = history.location.state
    const {member} = props
    const [nextUrl, setNextUrl] = useState("");
    const [tid, setTid] = useState("")
    const [money, setMoney] = useState("")
    const [check, setCheck] = useState<boolean>(false)

    const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = e.target;
        if (id === 'money') {
            setMoney(value);
        }
    }
    /*
    useEffect(()=>{
        if(nextUrl != ""){
            console.log(nextUrl)
            history.push(nextUrl)
        }
    },[nextUrl])
    */
    const submitHandler = () => {
        axios({
            method: "POST",
            params : { 
                cid: "TC0ONETIME",
                partner_order_id: "partner_order_id",
                partner_user_id: "partner_user_id",
                item_name: "HelmetSer 충전하기",
                quantity: 1,
                total_amount: money,
                vat_amount: 200,
                tax_free_amount: 0,
                approval_url: "http://localhost:3000/payComplete",
                fail_url: "http://localhost:3000/",
                cancel_url: "http://localhost:3000/",
            },
            url: "https://kapi.kakao.com/v1/payment/ready",
            headers: {
              // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
              Authorization: "KakaoAK 270d461bf4570bdda8b5c7dad6233c46",
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              //"Access-Control-Allow-Origin": '*',
            },
            withCredentials: false,
        }).then((response) => {
            console.log('res?', response);
            setNextUrl(response.data.next_redirect_pc_url)
            setTid(response.data.tid)
            window.localStorage.setItem('tid', response.data.tid)
            window.localStorage.setItem('money', money)
            setCheck(true)
        }).catch((error: any)=>{
            console.log('error?', error);
        })
    }
    if(!check){
        return (
        <div>
            <h2>Pay page</h2>
            <TextField
                variant="standard"
                margin="normal"
                required
                id="money"
                label=" 충전할 금액을 입력하세요. (숫자만)"
                name="money"
                autoFocus
                InputProps={{ style: { fontSize: '4vw' } }}
                InputLabelProps={{ style: { fontSize: '3vw' } }}
                value={money}
                onChange={valueChangeHandler}
                style={{ color: 'light grey', width: '50vw', margin: '0 5vw' }}
            >
                충전할 금액을 입력하세요.
            </TextField>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={submitHandler}
                style={{width: '20vw', height: '5vh', margin: '0 10vw', fontSize: '3vw'}}>
                충전하기
            </Button>
        </div>
        );
    }
    else{
        return (
            <div>
                <h2>Pay page</h2>
                <a href={ nextUrl }>
                    충전하기 페이지
                </a>
            </div>
            );
    }
};

export default Pay;