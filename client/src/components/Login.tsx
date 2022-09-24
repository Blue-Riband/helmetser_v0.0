import React, { useState } from 'react';
import { Button, CssBaseline, TextField, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
//import LongPressable from 'react-longpressable';
import ToastStr from '../request/toastStr';

import axios from 'axios'

import { COLORS } from './Theme'

import { member as v_member, basic, Values, SNACKBAR_TIME } from '../request/values';
import { useSnackbar } from 'notistack';

const SERVER = basic.server;


const useStyles = makeStyles((theme: any) => ({

  background: {
    position: 'absolute',
    top: 0,
    width: '100vw',
    height: '100vh',
    background: `url("/images/background.png")`,
  },
  container: {
    padding: 0,
    height: '100vh',
    paddingTop: '15vh',
  },
  paper: {
    // marginTop: theme.spacing(8),
    // marginTop: '15vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    width: '80%',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    height: '50px',
    margin: theme.spacing(3, 0, 2),
    borderRadius: '27px',
    boxShadow: '6px 3px 6px 0 rgba(0, 0, 0, 0.16)',
    border: 'solid 0.5px #cfd4d9',
    backgroundColor: 'red',
    "&:hover": {
      backgroundColor: 'black',
    }
  },
  submitButton: {
    "& :hover": {
      backgroundColor: 'red',
    }
  },
  logoSection: {
    // position: 'absolute',
    // bottom: '5vh',
    // width: '100vw',
    // textAlign: 'center'
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
    marginTop: '30vh',
    paddingBottom: '10vh',
  },
  logobutton: {
    border: 'none',
    backgroundColor: 'transparent',
  },
}));

// interface LoginProps {
//   setMember: Dispatch<SetStateAction<Function>>,
// }


const LoginIn: React.FC<any> = props => {
  const classes = useStyles();

  const [member_email, setEmail] = useState<any | null>();
  const [member_password, setPassword] = useState<any | null>();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies();
  const { enqueueSnackbar } = useSnackbar();
  const { setMember, token } = props;

  const handleLogin = (member: any) => {

    console.log('in Login handleLogin', member)
    if (member) {
        history.push({
          pathname: '/map',
      })
    }
  }

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'member_email') setEmail(value);
    else setPassword(value);
  }

  const submitHandler = (event: any) => {
    axios({
      method: "POST",
      data: {
        email: member_email,
        password: member_password,
        token: token,
      },
      withCredentials: true,
      url: SERVER + v_member.member + v_member.login,

      headers: { "Access-Control-Allow-Origin": basic.server_url, mode: 'cors', "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }
    })
      .then((res) => {
        console.log('res?', res);

        return res.data
      }).then((data: any) => {
        // console.log('data?', data)
        if (data.code === Values.FAIL_CODE) {
          enqueueSnackbar(ToastStr.LOGIN_FAIL, { variant: "error", autoHideDuration: SNACKBAR_TIME })
        } else {
          setCookie('access', data.jwt)
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
          setMember(data.member);
          handleLogin(data.member);

          if (window.ReactNativeWebView) {
            console.log('to rn!!', data.member.id)
            window.ReactNativeWebView.postMessage(data.member.id)
          }
          // window.postMessage(data.member.id, '*')
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

  const moveEmail = () => {
    history.push('/email')
  }

  return (
    <div className={classes.background}>
      <Container component="main" className={classes.container}>
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.title}>
            <Typography variant="h6" style={{ color: 'red' }}>
              HELMETSER
            </Typography>
          </div>

          <div className={classes.form}>
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="member_email"
              label="ID"
              name="email"
              autoComplete="email"
              autoFocus
              value={member_email}
              onChange={valueChangeHandler}
              style={{ color: `${COLORS.charcoal_grey}` }}
            />
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              name="password"
              label="PASSWORD"
              type="password"
              id="member_password"
              autoComplete="current-password"
              value={member_password}
              onChange={valueChangeHandler}
              style={{ color: `${COLORS.charcoal_grey}` }}
            />
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={(e) => submitHandler(e)}
            >
              <Typography variant="h3">
                로그인하기
              </Typography>
            </Button>

            <Grid container justify="center">
              <Grid item>
                <Button onClick={moveEmail}>
                  <Typography variant="h2" style={{ color: 'black' }}>
                    회원가입하기
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LoginIn;