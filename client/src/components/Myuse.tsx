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
  Grid,
  List,
  ListItem,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../request/values";
import React, { useEffect, useState } from "react";
import { COLORS } from "./Theme";
import axios from "axios";

import { useSnackbar } from "notistack";
import ToastStr from "../request/toastStr";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
  container: {
    backgroundColor: "white",
    width: "100vw",
    textAlign: "center",
  },
  materialImage: {
    textAlign: "center",
    margin: "auto",
    "& img": {
      width: "11vw",
    },
  },
  materialDesc: {
    paddingLeft: "1vw",
    "& #materialSubName": {
      fontSize: "3vw",
      color: `${COLORS.BROWNISH_GREY}`,
    },
    "& #materialSubName1": {
      fontSize: "3vw",
      color: `${COLORS.BROWNISH_GREY}`,
    },
  },
  materialName: {
    fontSize: "3vw",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "& statusComplete": {
      color: `${COLORS.WATER_BLUE}`,
    },
    "& statusWarn": {
      color: `${COLORS.HELMETSER}`,
    },
  },
  materialItem: {
    borderRadius: 12,
    margin: "auto",
    marginBottom: "1.5vh",

    boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
    width: "82vw",
    paddingTop: "2.2vh",
    paddingBottom: "2.2vh",
  },
  list: {
    width: "95vw",
    height: "76vh",
    overflowY: "auto",
    fontFamily: "NanumB",
    fontWeight: "bold",
    fontSize: "4vw",
    color: `${COLORS.BROWNISH_GREY}`,
  },
}));

type iRecord = {
  memberId: string;
  helmetId: number;
  startLocker: number;
  startRoom: number;
  startDate: string;
  endLocker: number;
  endRoom: number;
  endDate: string;
  status: number;
};

const SERVER = basic.server;

const MyUse: React.FC<any> = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const state: any = history.location.state;
  const { member } = props;
  const [record, setRecord] = useState<iRecord[]>([]);

  const getMyUse = () => {
    let url = new URL(SERVER + v_member.member + v_member.get_record);
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
        if (data.code === Values.SUCCESS_CODE) {
          setRecord((prevState) => data.record);
        } else if (data.code === Values.FAIL_CODE) {
        }
      });
  };

  const moveMap = () => {
    history.push("/map");
  };

  useEffect(() => {
    getMyUse();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.headbar}>
        <Button onClick={() => moveMap()} className={classes.buttonLabel}>
          <img className={classes.menuButton} src="/images/back.png"></img>
        </Button>
        <h2>이용 내역</h2>
      </div>
      <List className={classes.list}>
        {record != null &&
          record.map((item: any, index: number) => {
            return (
              <ListItem className={classes.materialItem} alignItems="center">
                <MaterialSaleItem {...item} />
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

const MaterialSaleItem: React.FC<any> = (props) => {
  const classes = useStyles();
  const [statusColor, setStatusColor] = useState<number>(0);

  const getColor = () => {
    setStatusColor(props.status);
  };
  useEffect(() => {
    getColor();
  }, [props.status]);

  return (
    <Grid container justify={"center"} alignContent="center">
      <Grid xs={2} className={classes.materialImage}>
        <img src="/images/grade/5vip.png" />
      </Grid>
      <Grid xs={9} style={{ margin: "auto" }}>
        <Grid container className={classes.materialDesc} direction="column">
          <div className={classes.materialName}>
            이용 시작 : {props.startDate}
          </div>
          <div className={classes.materialName}>
            이용 종료 : {props.endDate}
          </div>
          <div className={classes.materialName}>
            현재 상태 :
            <span
              id={`${
                statusColor === 0
                  ? ""
                  : statusColor === 1
                  ? "statusComplete"
                  : "statusWarn"
              }`}
            >
              {props.status === 0
                ? " 대여중"
                : props.status === 1
                ? " 반납완료"
                : " 신고중"}
            </span>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyUse;
