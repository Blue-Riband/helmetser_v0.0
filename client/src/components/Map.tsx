import {
  Button,
  Box,
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
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import axios from "axios";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../request/values";

import React, { useEffect, useState, useRef, useCallback } from "react";

import ToastStr from "../request/toastStr";
import { useSnackbar } from "notistack";
import { COLORS } from "./Theme";
import { ClientRequest } from "http";
import { markAsUntransferable } from "worker_threads";
import { positions } from "@material-ui/system";

const useStyles = makeStyles((theme) => ({
  nanumSquare_regular: {
    fontFamily: "NanumR",
  },
  container: {
    padding: 0,
    display: "grid",
    width: "100vw",
    height: "100vh",
    gridTemplateRows: "100px 35fr 3fr 2fr",
  },
  headbar: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: "30px 5vw 0 5vw",
    gridTemplateColumns: "1fr 4fr 1fr",
    backgroundColor: `${COLORS.WHITE}`,
    color: `${COLORS.HELMETSER}`,
    width: "90vw",
    borderRadius: "10px",
    zIndex: 2,
    boxShadow: "2px 2px 10px grey",
  },
  middle: {
    display: "grid",
    gridTemplateColumns: "16fr 3.5fr 1fr",
    gridTemplateRows: "20fr 3fr 1fr",
  },
  sidebar: {
    backgroundColor: "white",
    //borderLeft: '4px solid',
    position: "fixed",
    transition: "0.4s ease",
    height: "100%",
    width: "40vw",
    zIndex: 99,
    left: 0,
    top: 0,
    bottom: 0,
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
  content: {
    padding: "40px 0 0 0",
    position: "relative",
    width: "100%",
    "& ul": {
      cursor: "pointer",
    },
  },
  name: {
    textAlign: "center",
    marginTop: "10vh",
  },
  name2: {
    textAlign: "center",
    marginBottom: "10vh",
  },
  menuButton: {
    width: "100%",
  },
  gpsLabel: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  gpsButton: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "50%",
    // border: "1px grey solid",
    boxShadow: "2px 2px 10px grey",
  },
  qrLabel: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  qrButton: {
    width: "85vw",
    height: "15vw",
    padding: 0,
    zIndex: 2,
    minWidth: 0,
    backgroundColor: "#ff4500",
    color: "white",
    borderRadius: "10px",
    border: "1px lightgrey solid",
    bottom: 0,
    "&:hover": {
      backgroundColor: "#ff4500",
    },
  },
  info: {
    display: 'block',
    backgroundColor: `${COLORS.HELMETSER}`,
    color: 'white',
    textAlign: 'center',
    height: '24px',
    lineHeight: '22px',
    borderRadius: '4px',
    padding: '0px 10px'
  }
}));

type iLocker = {
  lockerId: number;
  totalCapacity: number;
  currentCapacity: number;
  repairCapacity: number;
  locationX: number;
  locationY: number;
};

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

const SERVER = basic.server;

const Map: React.FC<any> = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const width = 180;
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(width);
  const [lockers, setLockers] = useState<iLocker[]>([]);
  const [status, setStatus] = useState(1);
  const [move, setMove] = useState(0);
  const side = useRef<HTMLElement>(null);
  const { member } = props;

  // button ?????? ??? ??????
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(width);
      setOpen(false);
    }
  };

  // ???????????? ?????? ????????? ????????? ??????

  const getLocker = () => {
    let url = new URL(SERVER + v_member.member + v_member.get_locker);
    let params = {};
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
          //enqueueSnackbar(ToastStr.JOIN_FAIL_STR, { variant: "warning", autoHideDuration: SNACKBAR_TIME })
          setLockers(data.lockers);
        } else if (data.code === Values.FAIL_CODE) {
          // this is success == dont exist same id
          //enqueueSnackbar(ToastStr.EMAIL_AUTH_SUCCESS_STR, { variant: "success", autoHideDuration: SNACKBAR_TIME * 2 })
          //setLockers(data.lockers);
        }
      });
  };

  const getMemberStatus = () => {
    let url = new URL(SERVER + v_member.member + v_member.get_status);
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
          //enqueueSnackbar(ToastStr.JOIN_FAIL_STR, { variant: "warning", autoHideDuration: SNACKBAR_TIME })
          setStatus(data.status);
        } else if (data.code === Values.FAIL_CODE) {
          // this is success == dont exist same id
          //enqueueSnackbar(ToastStr.EMAIL_AUTH_SUCCESS_STR, { variant: "success", autoHideDuration: SNACKBAR_TIME * 2 })
          //setLockers(data.lockers);
        }
      });
  };

  const onClickOutside = (event: Event) => {
    let sideArea = side.current;
    let sideChildren = side.current?.contains(event.target as Node);

    if (isOpen && (!sideArea || !sideChildren)) {
      setX(width);
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("click", onClickOutside);
    };
  });

  const moveMypage = () => {
    history.push("/mypage");
  };
  const moveMyUse = () => {
    history.push("/myuse");
  };
  const moveQnA = () => {
    history.push("/qna");
  };
  const moveGuide = () => {
    history.push("/guide");
  };
  const moveSetting = () => {
    history.push("/setting");
  };
  const moveQrCode = () => {
    history.push({
      pathname: "/qrcode",
      state: {
        status: status,
      },
    });
  };
  const moveKakaoPay = () => {
    history.push("/pay");
  };

  const handleNew = (E: any) => {
    history.push({
      pathname: "/locker/" + lockers[E].lockerId,
      state: {
        locker_id: lockers[E].lockerId,
      },
    });
  };


    const { enqueueSnackbar } = useSnackbar();
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=09a2bf6aef7641e6ca9ed7991df1bf89&autoload=false&Libraries=services,clusterer,drawing";
    const imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";


    useEffect(() => {
    getLocker();
    getMemberStatus();
    }, []);
    useEffect(() => {
    const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // ?????????????????? ???????????????
        imageSize = new kakao.maps.Size(64, 69), // ?????????????????? ???????????????
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // ?????????????????? ???????????????. ????????? ????????? ???????????? ????????? ???????????? ????????? ???????????????.

    const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
    );
    let options = {
        center: new kakao.maps.LatLng(35.8881679003687, 128.61134827189184),
        level: 4,
    };
    const container = document.getElementById("myMap");
    const map = new kakao.maps.Map(container, options);

    if (navigator.geolocation) {
        // GeoLocation??? ???????????? ?????? ????????? ???????????????
        navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // ??????
        const lon = position.coords.longitude; // ??????
        let locPosition = new kakao.maps.LatLng(lat, lon);
        map.panTo(locPosition);
        });
    } else {
    }


    
    lockers.forEach((el, index) => {
        // ????????? ???????????????
        let position;
        const marker = new kakao.maps.Marker({
            //????????? ?????? ??? ??????
            map: map,
            //????????? ?????? ??? ??????
            position: new kakao.maps.LatLng(el.locationX, el.locationY),
            //????????? hover??? ????????? title
            title: el.lockerId,
            image: markerImage,
            
            clickable: true,
        });
        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: new kakao.maps.LatLng(el.locationX, el.locationY),
            content: `<div style="display: block;
            background-color: orangeRed;
            color: white;
            text-align: center;
            height: 24px;
            line-height: 22px;
            border-radius: 4px;
            padding: 0px 10px" >${((lockers[index].totalCapacity)-(lockers[index].currentCapacity)-(lockers[index].repairCapacity))}/${lockers[index].totalCapacity}</div>`,
            yAnchor: 1 
        });
        //customOverlay()

        kakao.maps.event.addListener(marker, "click", function () {
            // ?????? ?????? ?????????????????? ???????????????

            handleNew(index);
        });
    });
    //getLocker()
    }, [lockers, move]);

  const addMove = () =>{
    setMove(move + 1)
  }

  return (
    <div
      id="myMap"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Container component="main" className={classes.container}>
        <div className={classes.headbar}>
          <Button onClick={() => toggleMenu()} className={classes.buttonLabel}>
            <img className={classes.menuButton} src="/images/menu.png"></img>
          </Button>
          <h2>HELMETSER</h2>
        </div>
        <div className={classes.middle}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <Button onClick={() => addMove()} className={classes.gpsLabel}>
            <img className={classes.gpsButton} src="/images/gps.png"></img>
          </Button>
        </div>
        <div className={classes.qrLabel}>
          <Button onClick={() => moveQrCode()} className={classes.qrButton}>
            {!status ? <span>QR????????????</span> : <span>????????????</span>}
          </Button>
        </div>
        <div></div>
        <div
          className={classes.sidebar}
          style={{
            width: `${width}px`,
            height: "100%",
            transform: `translatex(${-xPosition}px)`,
          }}
        >
          <div className={classes.content}>
            <Typography className={classes.name}>{member.name}???</Typography>
            <Typography className={classes.name2}>???????????????!</Typography>
            <ul onClick={() => moveMypage()}>??? ?????? ??????</ul>
            <ul onClick={() => moveMyUse()}>?????? ??????</ul>
            <ul onClick={() => moveGuide()}>?????? ??????</ul>
            <ul onClick={() => moveSetting()}>??????</ul>
            <ul onClick={() => moveKakaoPay()}>??????</ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Map;
