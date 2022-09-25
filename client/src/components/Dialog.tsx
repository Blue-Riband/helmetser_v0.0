import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  InputBase,
} from "@material-ui/core";

import Select from "react-select";

import { COLORS } from "./Theme";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    display: "inline-block",
    alignContent: "center",
    padding: 0,
    "& h2": {
      color: `${COLORS.WATER_BLUE}`,
      fontFamily: "NanumB",
      fontSize: "3vh",
      "& svg": {
        margin: "auto",
        marginRight: "2vw",
      },
    },
  },
  content: {
    textAlign: "center",
    marginTop: "4vh",
    marginBottom: "2.5vh",
    overflowY: "visible",
    padding: 0,
    "& #contentTitle": {
      color: `${COLORS.CHARCOAL_GREY}`,
      fontFamily: "NanumB",
      fontWeight: "bold",
      marginBottom: "1vh",
    },
  },
  action: {
    padding: 0,
    "& button": {
      fontSize: "16px",
      color: `${COLORS.BROWNISH_GREY}`,
    },
  },

  underline: {
    // borderBottom: "0px solid red !important",
    "&:hover": {
      borderBottom: "0px solid rgba(0,0,0,0)",
    },
    backgroundColor: "#ffffff",
  },
}));

const DialogRent: React.FC<any> = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "3px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "84vw",
          height: "auto",
        },
      }}
    >
      <DialogContent
        style={{
          display: "inline-block",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingTop: 0,
        }}
      >
        <DialogContentText
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "3vh 0",
          }}
        >
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              marginRight: 3,
              color: `${COLORS.CHARCOAL_GREY}`,
            }}
          >
            {props.title}
          </Typography>
        </DialogContentText>

        <DialogContentText>
          <Typography
            variant="h2"
            style={{
              textAlign: "center",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontSize: "3.5vw",
              fontWeight: "bold",
              whiteSpace: "pre-line",
            }}
          >
            {props.context}
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        {props.alarm !== true && (
          <Button
            style={{
              fontSize: "3vw",
              border: "1px grey solid",
              borderRadius: "10px",
            }}
            onClick={props.noConfirm}
          >
            {props.noText}
          </Button>
        )}
        <Button
          style={{
            fontSize: "3vw",
            // border: "1px grey solid",
            borderRadius: "10px",
            color: `${COLORS.WHITE}`,
            backgroundColor: `${COLORS.HELMETSER}`,
          }}
          onClick={props.yesConfirm}
        >
          {props.yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogRent.defaultProps = {
  yesText: "대여하기",
  noText: "신고하기",
  alarm: false,
};

const DialogCompanyApproval: React.FC<any> = (props) => {
  const classes = useStyles();

  const variant: any = [
    { value: "purchase", label: "구매담당자" },
    { value: "production", label: "생산담당자" },
    { value: "sale", label: "판매담당자" },
  ];

  const [grade, setGrade] = useState(variant[0]);

  const onSelectChange = (e: any) => {
    setGrade(e);
  };

  const handleYes = () => {
    if (grade.label !== "") {
      props.yesConfirm(grade.label);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 27,
          boxShadow: "6px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "84vw",
          height: "auto",
          // maxWidth: 400,
          textAlign: "center",
          alignContent: "center",
          padding: "5vh 15vw 3vh",
          overflowY: "visible",
          // height: '50vh',
          // maxHeight: 300,
        },
      }}
    >
      <DialogContent className={classes.content}>
        <Typography variant="h1" id="contentTitle">
          {props.memberName}님의 역할
        </Typography>
        <Select
          // className={classes.select}s
          value={grade}
          onChange={onSelectChange}
          defaultValue={variant[0]}
          options={variant}
        />
      </DialogContent>
      <DialogActions
        style={{ justifyContent: "space-around" }}
        className={classes.action}
      >
        <Button style={{ fontSize: "3vw" }} onClick={props.noConfirm}>
          취소
        </Button>
        <Button style={{ fontSize: "3vw" }} onClick={handleYes}>
          완료
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogInput: React.FC<any> = (props) => {
  const [input, setInput] = useState<number | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || parseInt(e.target.value) >= 0) {
      setInput(parseInt(e.target.value));
    }
  };

  const confirm = (e: any) => {
    if (input !== undefined && input > 0) {
      props.yesConfirm(e, input);
    }
  };

  useEffect(() => {
    setInput(undefined);
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "3px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "84vw",
          height: "auto",
          // maxWidth: 400,
          paddingLeft: "3vw",
          paddingRight: "3vw",
          paddingTop: "3vh",
          paddingBottom: "3vh",
          // height: '25vh',
          // maxHeight: 300,
        },
      }}
    >
      <DialogContent
        style={{ justifyContent: "center", paddingLeft: 0, paddingRight: 0 }}
      >
        <DialogContentText
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontFamily: "NanumB",
              fontWeight: "bold",
              fontSize: "4vw",
            }}
          >
            {props.title}
          </Typography>
        </DialogContentText>

        <InputBase
          style={{
            backgroundColor: `${COLORS.LIGHT_GREY}`,
            width: "52vw",
            height: "5.4vh",
            borderRadius: 12,
            display: "flex",
            margin: "auto",
          }}
          autoFocus
          margin="dense"
          type="number"
          value={input}
          onChange={handleChange}
          inputProps={{
            "aria-label": "search google maps",
            style: { textAlign: "center" },
          }}
        />
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        <Button style={{ fontSize: "3vw" }} onClick={props.noConfirm}>
          취소
        </Button>
        <Button style={{ fontSize: "3vw" }} onClick={confirm}>
          완료
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogInputText: React.FC<any> = (props) => {
  const [input, setInput] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const confirm = (e: any) => {
    if (input !== undefined) {
      props.yesConfirm(e, input);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "3px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "84vw",
          height: "34vh",
          // maxWidth: 400,
          paddingTop: "3vh",
          paddingBottom: "3vh",
          // height: '25vh',
          // maxHeight: 300,
        },
      }}
    >
      <DialogContent
        style={{ justifyContent: "center", paddingLeft: 0, paddingRight: 0 }}
      >
        <DialogContentText
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontFamily: "NanumB",
              fontWeight: "bold",
            }}
          >
            {props.title}
          </Typography>
        </DialogContentText>
        <InputBase
          style={{
            backgroundColor: `${COLORS.LIGHT_GREY}`,
            width: "52vw",
            height: "5.4vh",
            borderRadius: 12,
            display: "flex",
            margin: "auto",
          }}
          autoFocus
          margin="dense"
          type="text"
          value={input}
          onChange={handleChange}
          inputProps={{
            "aria-label": "search google maps",
            style: { textAlign: "center" },
          }}
        />

        {/* <div style={{ width: '100%'}}>
                    <TextField
                        style={{ width: '80%' }}
                        id="standard-number" label="대출금"
                        type="number" name="loan_price"
                        // inputStyle={{ textAlign: 'center' }}
                        // inputProps={{
                        //     style: { textAlign: "right" }
                        // }}
                        value={input} onChange={handleChange} />
                </div> */}
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={props.noConfirm}>취소</Button>
        <Button onClick={confirm}>완료</Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogDeleteClass: React.FC<any> = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "3px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "40vw",
          height: "20vw",
        },
      }}
    >
      <DialogContent
        style={{
          display: "inline-block",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "17% 0 0 0",
        }}
      >
        <DialogContentText
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              marginRight: 3,
              marginBottom: "2vh",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontSize: "1.8vw",
              fontWeight: "bold",
            }}
          >
            {props.title}
          </Typography>
        </DialogContentText>

        <DialogContentText>
          <Typography
            variant="h2"
            style={{
              textAlign: "center",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontSize: "1.8vw",
              whiteSpace: "pre-line",
            }}
          >
            {props.context}
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions
        style={{ justifyContent: "center", padding: "3%", marginBottom: "3vh" }}
      >
        {props.alarm !== true && (
          <Button style={{ fontSize: "1.8vw" }} onClick={props.noConfirm}>
            취소
          </Button>
        )}
        <Button
          style={{ color: "Red", fontSize: "1.8vw" }}
          onClick={props.yesConfirm}
        >
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DialogApprove: React.FC<any> = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "3px 3px 6px 0 rgba(0, 0, 0, 0.16)",
          backgroundColor: `${COLORS.WHITE}`,
          width: "84vw",
          height: "auto",
        },
      }}
    >
      <DialogContent
        style={{
          display: "inline-block",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingTop: 0,
        }}
      >
        <DialogContentText
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "3vh",
          }}
        >
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              marginRight: 3,
              color: `${COLORS.CHARCOAL_GREY}`,
              fontSize: "2.5vw",
              fontWeight: "bold",
            }}
          >
            {props.title}
          </Typography>
        </DialogContentText>

        <DialogContentText>
          <Typography
            variant="h2"
            style={{
              textAlign: "center",
              color: `${COLORS.CHARCOAL_GREY}`,
              fontSize: "2vw",
              whiteSpace: "pre-line",
            }}
          >
            {props.context}
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        {props.alarm !== true && (
          <Button style={{ fontSize: "2vw" }} onClick={props.noConfirm}>
            취소
          </Button>
        )}
        <Button style={{ fontSize: "2vw" }} onClick={props.yesConfirm}>
          승인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRent;
export {
  DialogRent,
  DialogCompanyApproval,
  DialogInput,
  DialogInputText,
  DialogDeleteClass,
  DialogApprove,
};
