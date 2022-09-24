import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { COLORS } from "../Theme";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 0,
    height: "12vh",
    // minHeight: '104px',
    bottom: "auto",
    backgroundColor: `${COLORS.WATER_BLUE}`,
    boxShadow: "none",
  },
  logoBar: {
    height: "62%",
    minHeight: "32px",
  },
  logo: {
    margin: "auto",
    "& img": {
      width: "45vw",
    },
  },
  settingIcon: {
    width: "6vw",
    height: "6vw",
  },

  tabBar: {
    height: "38%",
    minHeight: "30px",

    "& > div > div": {
      height: "100%",
    },
    "& > div > div > a": {
      height: "100%",
      minHeight: "30px",
      minWidth: "20vw",
    },
    "& .Mui-selected": {
      color: `${COLORS.WHITE}`,
      fontFamily: "NanumB",
      fontWeight: "bold",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: `${COLORS.PUMPKIN}`,
    },
  },
  linkTab: {
    fontSize: "3vw",
    fontFamily: "NanumR",
    padding: 0,
    "&:hover": {
      color: `${COLORS.WHITE}`,
    },
  },

  topNav: {
    width: "100vw",
    height: "10vh",
    top: 0,
    bottom: "auto",

    borderRadius: "36px 36px 0 0",
    boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
    // border: `solid 0.5px ${COLORS.VERY_LIGHT_PINK}`,
    // backgroundColor: `${COLORS.WHITE}`,
  },
  navigationBtn: {
    width: "20%",
    minWidth: 50,
  },
}));

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}

interface LinkTabProps {
  label?: string;
  href?: string;
  history?: any;
  classNameProps?: any;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        props.history.push(props.href);
      }}
      className={props.classNameProps}
      {...props}
    />
  );
}

const address = [
  "/CompanyInfo",
  "/LicenseList",
  "/ProductionList",
  "/MaterialList",
  "/ProductList",
];

const HeaderBar: React.FC<any> = (props) => {
  const classes = useStyles();

  const [value, setValue] = useState(setInitValue(window.location.pathname));
  const history = useHistory();

  const goSetting = () => {
    history.push(`/setting`);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };

  function setInitValue(path: string) {
    if (path === "/") return 0;

    return address.findIndex((element) => element === path) || 0;
  }

  const convertPath = (pathName: string) => {
    // if (pathName === '/CompanyInfo') {
    //     setValue(0)
    // } else if (pathName === '/LicenseList') {
    //     setValue(1)
    // } else if (pathName === '/ProductionList') {
    //     setValue(2)
    // } else if (pathName === '/MaterialList') {
    //     setValue(3)
    // } else if (pathName === '/ProductList') {
    //     setValue(4)
    // }
    if (pathName === "/") return 0;
    return address.findIndex((element) => element === pathName);
  };

  const refresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    console.log("history?", history);

    if (history !== undefined) {
      return history.listen((location: any, action: any) => {
        if (action === "POP") {
          console.log("just POP!");
          setValue(convertPath(location.pathname));
        }
        // console.log('now history?', history)
        // console.log('location action?', location)
        // console.log(`You changed the page to: ${location.pathname}`)
        // console.log('convert path?',convertPath(location.pathname))
        // setValue(convertPath(location.pathname))
      });
    } else {
      return;
    }
  }, [history]);

  useEffect(() => {
    console.log("change value", value);
  }, [value]);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.logoBar}>
          <Box display="flex" style={{ width: "100%" }}>
            <Box flexGrow={1} className={classes.logo}>
              <img src="/images/logo_white.png" />
            </Box>
            <Box>
              <IconButton onClick={goSetting} style={{ padding: 0 }}>
                <img
                  className={classes.settingIcon}
                  src="/images/Settings.webp"
                />
              </IconButton>
              <IconButton
                onClick={refresh}
                style={{ padding: 0, paddingLeft: "3vw" }}
              >
                <img
                  src="/images/refresh_white.webp"
                  style={{ width: "7vw" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
        <Tabs
          className={classes.tabBar}
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs"
        >
          <LinkTab
            classNameProps={classes.linkTab}
            label="경영현황"
            href="/CompanyInfo"
            history={history}
            {...a11yProps(0)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="연구개발"
            href="/LicenseList"
            history={history}
            {...a11yProps(1)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="제품생산"
            href="/ProductionList"
            history={history}
            {...a11yProps(2)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="재료구매"
            href="/MaterialList"
            history={history}
            {...a11yProps(3)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="제품판매"
            href="/ProductList"
            history={history}
            {...a11yProps(4)}
          />
        </Tabs>
      </AppBar>

      {/* <TabPanel value={value} index={0}>
                <img src="/images/app_complete.png"/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Page Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Page Three
            </TabPanel> */}
    </>
  );
};

const oper_address = [
  "/operation/material/list",
  "/operation/material/sale/list",
  "/operation/product/list",
  "/operation/product/purchase/list",
];
export const OperHeaderBar: React.FC<any> = (props) => {
  const classes = useStyles();

  const [value, setValue] = useState(setInitValue(window.location.pathname));
  const history = useHistory();
  const goSetting = () => {
    history.push(`/setting`);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };

  function setInitValue(path: string) {
    if (path === "/") return 0;
    return oper_address.find((element) => element === path) || 0;
  }
  const refresh = () => {
    // window.location.reload()
    history.go(0);
    console.log("click refresh");
    // forceUpdate()
  };

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.logoBar}>
          <Box display="flex" style={{ width: "100%" }}>
            <Box flexGrow={1} className={classes.logo}>
              <img src="/images/logo_white.png" />
            </Box>
            <Box>
              <IconButton onClick={goSetting} style={{ padding: 0 }}>
                <img
                  className={classes.settingIcon}
                  src="/images/Settings.webp"
                />
              </IconButton>
              <IconButton
                onClick={refresh}
                style={{ padding: 0, paddingLeft: "3vw" }}
              >
                <img
                  src="/images/refresh_white.webp"
                  style={{ width: "7vw" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
        <Tabs
          className={classes.tabBar}
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs"
        >
          <LinkTab
            classNameProps={classes.linkTab}
            label="재료판매"
            href={oper_address[0]}
            history={history}
            {...a11yProps(0)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="재료판매내역"
            href={oper_address[1]}
            history={history}
            {...a11yProps(1)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="제품구매"
            href={oper_address[2]}
            history={history}
            {...a11yProps(2)}
          />
          <LinkTab
            classNameProps={classes.linkTab}
            label="제품구매내역"
            href={oper_address[3]}
            history={history}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
    </>
  );
};

export const TopNavigation = () => {
  const classes = useStyles();
  const [value, setValue] = useState(setInitValue(window.location.pathname));

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  // change to useMemo?
  function setInitValue(path: string) {
    if (path === "/" || path === "/test") {
      return 0;
    } else if (path === "/login") {
      return 1;
    } else if (path === "/operation") {
      return 2;
    } else if (path === "/operation/product/purchase/list") {
      return 3;
    } else {
      return 0;
    }
  }

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      className={classes.topNav}
    >
      <BottomNavigationAction
        className={classes.navigationBtn}
        selected={true}
        component={Link}
        to="/test"
        value={0}
        label="재료주문"
      />
      <BottomNavigationAction
        className={classes.navigationBtn}
        component={Link}
        to="/login"
        value={1}
        label="재료완료"
      />
      <BottomNavigationAction
        className={classes.navigationBtn}
        component={Link}
        to="/operation"
        value={2}
        label="상품주문"
      />
    </BottomNavigation>
  );
};

export default HeaderBar;
