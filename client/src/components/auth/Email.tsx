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
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  member as v_member,
  basic,
  Values,
  SNACKBAR_TIME,
} from "../../request/values";

import React, { useState } from "react";
import { COLORS } from "../Theme";

import { useSnackbar } from "notistack";
import ToastStr from "../../request/toastStr";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  nanumSquare_regular: {
    fontFamily: "NanumR",
  },
  background: {
    position: "absolute",
    top: 0,
    width: "100vw",
    height: "100vh",
    background: `url("/images/background.png")`,
  },
  back: {
    marginLeft: "-1vh",
  },
  container: {
    width: "82%",
    marginTop: "7vh",
    padding: 0,
  },
  paper: {
    // marginTop: theme.spacing(8),
    // width: '82%',
    margin: "auto",
    marginTop: "6vh",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    // width: '80%',
    alignItems: "center",
  },
  emailreceiver: {
    display: "grid",
    gridTemplateColumns: "4fr 1fr",
    width: "100%",
  },
  emailsubmit: {
    height: 30,
    color: `${COLORS.WHITE}`,
    margin: theme.spacing(4, 2, 1),
    borderRadius: "13px",
    boxShadow: "6px 3px 6px 0 rgba(0, 0, 0, 0.16)",
    border: "solid 0.5px #cfd4d9",
    backgroundColor: `${COLORS.HELMETSER}`,
    "&:hover": {
      backgroundColor: `${COLORS.BLACK}`,
    },
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    height: 60,
    color: `${COLORS.WHITE}`,
    margin: theme.spacing(3, 0, 2),
    borderRadius: "27px",
    boxShadow: "6px 3px 6px 0 rgba(0, 0, 0, 0.16)",
    border: "solid 0.5px #cfd4d9",
    backgroundColor: `${COLORS.HELMETSER}`,
    "&:hover": {
      backgroundColor: `${COLORS.BLACK}`,
    },
  },
}));

const SERVER = basic.server;

const AuthEmail: React.FC<any> = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const [email, setEmail] = useState<string>("");
  const [auth, setAuth] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordRe, setPasswordRe] = useState<string>("");
  const [check, setCheck] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const buttonText = ["중복 확인", "다음으로"];
  const buttonText2 = [
    "비밀번호를 입력해주세요.",
    "비밀번호를 확인해주세요",
    "다음으로",
  ];

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  const getAuth = () => {
    let url = new URL(SERVER + v_member.member + v_member.auth_app_info);
    let params = { email: email };
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
          enqueueSnackbar(ToastStr.JOIN_FAIL_STR, {
            variant: "warning",
            autoHideDuration: SNACKBAR_TIME,
          });
        } else if (data.code === Values.FAIL_CODE) {
          // this is success == dont exist same id
          enqueueSnackbar(ToastStr.EMAIL_AUTH_SUCCESS_STR, {
            variant: "success",
            autoHideDuration: SNACKBAR_TIME,
          });
          setAuth((prevState) => true);
        }
      });
  };
  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const valueChangeHandler2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    if (id === "password") {
      setPassword(value);
      if (passwordRe === value) setCheck((prevState) => true);
      else setCheck((prevState) => false);
    } else if (id === "passwordRe") {
      setPasswordRe(value);
      if (password === value) setCheck((prevState) => true);
      else setCheck((prevState) => false);
    }
  };

  const handleButton = (e: any) => {
    // e.preventDefault();
    if (auth) {
      getAuth();
    } else {
      // setAnimation(true);
      if (email.length === 0) {
        enqueueSnackbar(ToastStr.EMAIL_ADDR_CHECK_STR, {
          variant: "warning",
          autoHideDuration: SNACKBAR_TIME,
        });
      } else if (email.length > 32) {
        enqueueSnackbar(ToastStr.EMAIL_ADDR_CHECK_LEN, {
          variant: "warning",
          autoHideDuration: SNACKBAR_TIME,
        });
      } else {
        getAuth();
      }
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClick = (e: any) => {
    if (!auth) {
      enqueueSnackbar(ToastStr.EMAIL_AUTH_CHECK_STR, {
        variant: "warning",
        autoHideDuration: SNACKBAR_TIME,
      });
      return;
    }
    if (!check) {
      enqueueSnackbar(ToastStr.PWD_CHECK_FALSE_STR, {
        variant: "warning",
        autoHideDuration: SNACKBAR_TIME,
      });
      setPasswordRe("");
      return;
    } else if (password.length < 6 || password.length > 20) {
      enqueueSnackbar(ToastStr.PWD_ET_CHECK_STR, {
        variant: "warning",
        autoHideDuration: SNACKBAR_TIME,
      });
      return;
    }
    // setMember(Object.assign(member, { password : password}))
    history.push({
      pathname: "/personalInfo",
      // search: '?update=true',  // query string
      state: {
        // location state
        email: email,
        password: password,
      },
    });
  };

  return (
    <div className={classes.background}>
      <Container component="main" className={classes.container}>
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.title}>
            <Typography
              variant="h6"
              style={{ textAlign: "center", color: "red" }}
            >
              HELMETSER
            </Typography>
          </div>
          <div className={classes.emailreceiver}>
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="member_email"
              label=" 이메일을 입력하세요. (32자 이내)"
              name="email"
              autoComplete="email"
              autoFocus
              InputProps={{ style: { fontSize: "4vw" } }}
              InputLabelProps={{ style: { fontSize: "3vw" } }}
              value={email}
              onChange={valueChangeHandler}
              style={{ color: `${COLORS.charcoal_grey}` }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.emailsubmit}
              onClick={handleButton}
            >
              {/*
                            {auth && <CheckIcon style={{marginRight: '2vw', color: `${COLORS.WHITE}`}}/>}
                            */}
              <Typography variant="h3">
                {auth ? buttonText[1] : buttonText[0]}
              </Typography>
            </Button>
          </div>
          <Typography variant="h1" style={{ fontFamily: "NanumR" }}>
            HELMETSER 이용을 위해 이메일 가입이 필요합니다.
          </Typography>
          <div className={classes.form}>
            <FormControl fullWidth>
              <InputLabel
                style={{ fontSize: "3vw" }}
                htmlFor="filled-adornment-password"
              >
                비밀번호를 입력하세요
              </InputLabel>
              <Input
                id="password"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={valueChangeHandler2}
                style={{ fontSize: "4vw" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              id="passwordRe"
              label="비밀번호를 다시 입력하세요"
              name="password"
              type="password"
              value={passwordRe}
              InputProps={{ style: { fontSize: "4vw" } }}
              InputLabelProps={{ style: { fontSize: "3vw" } }}
              onChange={valueChangeHandler2}
              style={{ color: `${COLORS.charcoal_grey}` }}
            />

            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleClick}
            >
              <Typography variant="h3">
                {password === ""
                  ? buttonText2[0]
                  : check
                  ? buttonText2[2]
                  : buttonText2[1]}
              </Typography>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AuthEmail;
