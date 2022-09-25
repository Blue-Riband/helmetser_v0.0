import {
  Button,
  Container,
  CssBaseline,
  makeStyles,
  TextField,
  Typography,
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
  FormControl,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../request/values";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import ToastStr from "../request/toastStr";
import axios from "axios";
import { useCookies } from "react-cookie";
import { COLORS } from "./Theme";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ProgressBar from "@ramonak/react-progress-bar";
import { time } from "console";

const useStyles = makeStyles((theme) => ({
  nanumSquare_regular: {
    fontFamily: "NanumR",
  },
  headbar: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gridTemplateColumns: "1fr 4fr 1fr",
    backgroundColor: `${COLORS.WHITE}`,
    color: `${COLORS.HELMETSER}`,
    width: "90vw",
    margin: "3vh 5vw",
    zIndex: 2,
  },
  buttonLabel: {
    width: "15vw",
    height: "15vw",
    padding: 0,
    zIndex: 2,
    minWidth: 0,
    backgroundColor: "white",
    borderRadius: "20%",
  },
  menuButton: {
    width: "100%",
  },
  logo: {
    fontSize: "10vw",
    fontWeight: "bolder",
    color: `${COLORS.HELMETSER}`,
    margin: "3vh 0",
  },
  container: {
    backgroundColor: "white",
    width: "100vw",
    textAlign: "center",
  },
  info: {
    display: "grid",
    gridTemplateColumns: "2fr 5fr",
    borderRadius: "15px",
    boxShadow: "2px 2px 10px grey",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 10px",
  },
  memberInfo: {
    fontSize: "5vw",
    margin: "3vh 0",
  },
  gradeIcon: {
    width: "75%",
    boxShadow: "2px 2px 10px grey",
    borderRadius: "50%",
    margin: "auto",
  },
  progressBar: {
    width: "80%",
    margin: "3vh auto",
  },
}));

const SERVER = basic.server;

const MyPage: React.FC<any> = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const state: any = history.location.state;
  const { member } = props;
  const [memberId, setMemberId] = useState<string>("");
  const [memberDate, setMemberDate] = useState<string>("");
  const [memberPoint, setMemberPoint] = useState<number>(0);
  const [memberCode, setMemberCode] = useState<number>(-1);
  const [memberName, setMemberName] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [imgsrc, setSrc] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [max, setMax] = useState<number>(500);
  const [color, setColor] = useState<string>("");

  const getMember = () => {
    let url = new URL(SERVER + v_member.member + v_member.get_member);
    let params = { member_id: member.id };
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
        console.log(data.member);
        if (data.code === Values.SUCCESS_CODE) {
          setMemberId(data.member[0].memberId);
          setMemberDate(data.member[0].regDate);
          setMemberPoint(data.member[0].point);
          setMemberCode(data.member[0].membershipCode);
          setMemberName(data.member[0].name);
          setMemberPhone(data.member[0].phone);
        } else if (data.code === Values.FAIL_CODE) {
        }
      });
  };

  const getGrade = () => {
    if (memberCode == -1) {
      console.log(memberCode);
      console.log("error");
    } else if (memberCode < 500) {
      setSrc("/images/grade/0bronze.png");
      setLevel("Lv1. Bronze Helmet");
      setColor("#622101");
      console.log("bronze");
    } else if (memberCode < 1000) {
      setSrc("/images/grade/1silver.png");
      setLevel("Lv2. Silver Helmet");
      setColor("#848484");
      setMax(1000);
      console.log("silver");
    } else if (memberCode < 5000) {
      setSrc("/images/grade/2gold.png");
      setLevel("Lv3. Gold Helmet");
      setColor("#EE991A");
      setMax(5000);
      console.log("gold");
    } else if (memberCode < 10000) {
      setSrc("/images/grade/3platinum.png");
      setLevel("Lv4. Platinum Helmet");
      setColor("#1AED9C");
      setMax(10000);
      console.log("platinum");
    } else if (memberCode < 50000) {
      setSrc("/images/grade/4diamond.png");
      setLevel("Lv5. Diamond Helmet");
      setColor("#6D77F0");
      setMax(50000);
      console.log("diamond");
    } else {
      setSrc("/images/grade/5vip.png");
      setLevel("Lv6. VIP Helmet");
      setColor("#FF4500");
      setMax(1000000);
      console.log("vip");
    }
    console.log(imgsrc);
  };
  const moveMap = () => {
    history.push("/map");
  };

  useEffect(() => {
    getMember();
  }, []);
  useEffect(() => {
    getGrade();
  }, [memberCode]);
  return (
    <div className={classes.container}>
      <div className={classes.headbar}>
        <Button onClick={() => moveMap()} className={classes.buttonLabel}>
          <img className={classes.menuButton} src="/images/back.png"></img>
        </Button>
        <h2>마이페이지</h2>
      </div>
      <Typography className={classes.logo}>HELMETSER</Typography>
      <Typography className={classes.memberInfo}>
        {memberName}님 환영합니다!
      </Typography>
      <Box>
        <div className={classes.info}>
          <img className={classes.gradeIcon} src={imgsrc}></img>
          <div>
            <Typography className={classes.memberInfo}>
              사용 가능 포인트: {memberPoint}
            </Typography>
            <Typography className={classes.memberInfo}>{level}</Typography>
            <div className={classes.progressBar}>
              <ProgressBar
                completed={memberCode.toString()}
                maxCompleted={max}
                bgColor={color}
                customLabel={memberCode + "/" + max}
              ></ProgressBar>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default MyPage;
