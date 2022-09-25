import { useState } from "react";
import QrReader from "react-web-qr-reader";
import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, CssBaseline, makeStyles, Typography } from "@material-ui/core";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../request/values";
import ToastStr from "../request/toastStr";
import { useSnackbar } from "notistack";
import DialogRent from "./Dialog";
import { COLORS } from "./Theme";
import { borderLeft, textAlign } from "@material-ui/system";
import { classNames } from "react-select/src/utils";

type iRoom = {
  lockerId: number;
  roomId: number;
  state: number;
};

const useStyles = makeStyles((theme) => ({

  nanumSquare_regular: {
      fontFamily: 'NanumR',
  },
  logo :{
      fontSize: '10vw',
      fontWeight: 'bolder',
      color: `${COLORS.HELMETSER}`,
      margin: '5vh 0',
      textAlign: 'center'
  },
  container: {
      heigth: '100vh',
      width: '100vw',
      textAlign: 'center',
  },
  qr: {
    marginTop: '5vh',
    fontSize: '5vw',
    color: `${COLORS.HELMETSER}`,
    textAlign: 'center'
  },
}));

const SERVER = basic.server;

const QrCode: React.FC<any> = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const state: any = history.location.state;
  const status = state.status;
  const { member } = props;
  const [rentDialog, setRentDialog] = useState<boolean | number>(false);
  const [room, setLockers] = useState<iRoom[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const delay = 500;

  const previewStyle = {
    height: "100%",
    width: "100%",
  };

  const [result, setResult] = useState<string>("");

  const handleScan = (res: any) => {
    console.log(res);
    if (res) {
      setResult(res.data);
    }
  };

  const handleError = (error: any) => {
    console.log(error);
  };

  const handleClose = () => {
    setRentDialog((prevState) => false);
  };

  const handleOpen = (index: number) => {
    console.log("open", index);
    if (rentDialog === false) {
      setRentDialog((prevState) => index);
    }
  };

  const submitHandler = () => {
    const split = result.split(" ");
    console.log(split);
    axios({
      method: "POST",
      data: {
        member_id: member.id,
        locker_id: split[0],
        room_id: split[1],
      },
      withCredentials: true,
      url: SERVER + v_member.member + v_member.borrow_helmet,
    })
      .then((res) => {
        console.log("res?", res);

        return res.data;
      })
      .then((data: any) => {
        // console.log('data?', data)
        if (data.code === Values.SUCCESS_CODE) {
          enqueueSnackbar(ToastStr.BORROW_SUCCESS, {
            variant: "success",
            autoHideDuration: SNACKBAR_TIME,
          });
          history.push('/map')
        } else if (data.code === Values.MONEY_NOT_ENOUGH) {
          enqueueSnackbar(ToastStr.MONEY_NOT_ENOUGH, {
            variant: "warning",
            autoHideDuration: SNACKBAR_TIME,
          });
        } else if (data.code === Values.HELMET_CANNOT_BORROW) {
          enqueueSnackbar(ToastStr.HELMET_CANNOT_BORROW, {
            variant: "warning",
            autoHideDuration: SNACKBAR_TIME,
          });
        } else if (data.code === Values.FAIL_CODE) {
          enqueueSnackbar(ToastStr.REQUEST_GET_POST_FAIL_STR, {
            variant: "error",
            autoHideDuration: SNACKBAR_TIME,
          });
        }
      })
      .catch((error: any) => {
        if (error.response) {
          console.log("error?", error.response);
          enqueueSnackbar(ToastStr.REQUEST_GET_POST_FAIL_STR, {
            variant: "error",
            autoHideDuration: SNACKBAR_TIME,
          });
        }
      });
  };

  const restoreHandler = () => {
    const split = result.split(" ");
    console.log(split);
    axios({
      method: "POST",
      data: {
        member_id: member.id,
        locker_id: split[0],
        room_id: split[1],
      },
      withCredentials: true,
      url: SERVER + v_member.member + v_member.restore_helmet,
    })
      .then((res) => {
        console.log("res?", res);

        return res.data;
      })
      .then((data: any) => {
        // console.log('data?', data)
        if (data.code === Values.SUCCESS_CODE) {
          enqueueSnackbar(ToastStr.RESTORE_SUCCESS, {
            variant: "success",
            autoHideDuration: SNACKBAR_TIME,
          });
          history.push('/map')
        } else if (data.code === Values.HELMET_CANNOT_RESTORE) {
          enqueueSnackbar(ToastStr.ROOM_FULL, {
            variant: "warning",
            autoHideDuration: SNACKBAR_TIME,
          });
        } else if (data.code === Values.FAIL_CODE) {
          enqueueSnackbar(ToastStr.REQUEST_GET_POST_FAIL_STR, {
            variant: "error",
            autoHideDuration: SNACKBAR_TIME,
          });
        }
      })
      .catch((error: any) => {
        if (error.response) {
          console.log("error?", error.response);
          enqueueSnackbar(ToastStr.REQUEST_GET_POST_FAIL_STR, {
            variant: "error",
            autoHideDuration: SNACKBAR_TIME,
          });
        }
      });
  };

  const refusal = () => {
    // postCompanyAppDelete();
    handleClose();
  };

  useEffect(() => {
    if (result != "") {
      handleOpen(parseInt(result[0]));
      // submitHandler();
      if(status)
        restoreHandler()
    }
  }, [result]);
  if(!status){
    return (
      <>
        <Typography className = {classes.logo}>HELMETSER</Typography>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
        <Typography className = {classes.qr}>QR을 찍어주세요 :)</Typography>
        <div className = {classes.qr}></div>
        <DialogRent
          open={rentDialog === false ? false : true}
          handleClose={() => handleClose()}
          title={"헬멧의 상태를 확인해주세요."}
          memberName={rentDialog === false ? "" : member.name}
          yesConfirm={submitHandler}
          noConfirm={() => handleClose()}
        />
      </>
    );
  }
  else{
    return (
      <>
        <Typography className = {classes.logo}>HELMETSER</Typography>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      </>
    );
  }
};

export default QrCode;
