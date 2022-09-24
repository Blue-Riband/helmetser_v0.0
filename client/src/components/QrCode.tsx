import { useState } from "react";
import QrReader from "react-web-qr-reader";
import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../request/values";
import ToastStr from "../request/toastStr";
import { useSnackbar } from "notistack";

type iRoom = {
  lockerId: number;
  roomId: number;
  state: number;
};

const SERVER = basic.server;

const QrCode: React.FC<any> = (props) => {
  let history = useHistory();
  const { member } = props;
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

  useEffect(() => {
    if (result != "") {
      submitHandler();
      //history.push('/map')
    }
  }, [result]);

  return (
    <>
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>
    </>
  );
};

export default QrCode;
