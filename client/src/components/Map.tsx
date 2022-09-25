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
}));

type iLocker = {
  lockerId: number;
  totalCapacity: number;
  currentCapacity: number;
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
  const side = useRef<HTMLElement>(null);
  const { member } = props;

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(width);
      setOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수

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
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const container = document.getElementById("myMap");
    let options = {
      center: new kakao.maps.LatLng(35.8881679003687, 128.61134827189184),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        let locPosition = new kakao.maps.LatLng(lat, lon);
        map.panTo(locPosition);
      });
    } else {
    }
    // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
    const iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

    // 인포윈도우를 생성합니다
    const infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable,
    });

    lockers.forEach((el, index) => {
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        //마커가 표시 될 지도
        map: map,
        //마커가 표시 될 위치
        position: new kakao.maps.LatLng(el.locationX, el.locationY),
        //마커에 hover시 나타날 title
        title: el.lockerId,
        image: markerImage,

        clickable: true,
      });
      kakao.maps.event.addListener(marker, "click", function () {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, marker);
        // handleNew(index);
      });
    });
    //getLocker()
  }, [lockers]);

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
          <Button onClick={() => toggleMenu()} className={classes.gpsLabel}>
            <img className={classes.gpsButton} src="/images/gps.png"></img>
          </Button>
        </div>
        <div className={classes.qrLabel}>
          <Button onClick={() => moveQrCode()} className={classes.qrButton}>
            {status ? <span>QR스캔하기</span> : <span>반납하기</span>}
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
            <Typography className={classes.name}>{member.name}님</Typography>
            <Typography className={classes.name2}>안녕하세요!</Typography>
            <ul onClick={() => moveMypage()}>내 정보 보기</ul>
            <ul onClick={() => moveMyUse()}>이용 현황</ul>
            <ul onClick={() => moveGuide()}>이용 안내</ul>
            <ul onClick={() => moveSetting()}>설정</ul>
            <ul onClick={() => moveKakaoPay()}>결제</ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Map;
