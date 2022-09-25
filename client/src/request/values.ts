import { STATUS_CODES } from "http";

// Global
export const SPLASH_TIME = process.env.NODE_ENV === 'production' ? 2000 : 2000;
export const SNACKBAR_TIME = process.env.NODE_ENV === 'production' ? 5000 : 2000;


// path
const VERSION = '/v0';
const SERVER_URL = 'http://13.125.36.254:5000'
const SERVER_DEV_URL = 'http://localhost:5000'

const SERVER = process.env.NODE_ENV === 'production' ? SERVER_URL + VERSION : SERVER_DEV_URL + VERSION;

const USER = '/user';
const PRI = '/privacy';

const MAIN = '/main'
const MEMBER = '/member'

// method
const UPD = '/upd'
const DELETE = '/delete'
const AUTH = '/auth'
const JOIN = '/join'
const LOGIN = '/login'
const LOGOUT = '/logout'
const GET = '/get'
const BORROW = '/borrow'
const RESTORE = '/restore'


// object
const APP = '/app'
const PWD = '/pwd'
const TOKEN = '/token'
const INFO = '/info'
const LOCKER = '/locker'
const HELMET = '/helmet'
const POINT = '/point'
const STATUS = '/status'
const RECORD = '/record'

const DISPLAYIMAGE = '/displayImage'
const DISPLAYFILE = '/displayFile'


export const basic = {
    version : VERSION,
    server : SERVER,
    server_url : SERVER_URL,
}


export const routes = {
    home : VERSION,
}

export const path_value = {
    pathURL : (path:string, target:string)=> {
        return path + target;
    } ,
    pathView : (target:string)=> {
        return target.substring(1)
    }
}


export const member = {
    path : VERSION + MEMBER,
    member : MEMBER,
    basic : basic,
    main : MAIN,
    join : JOIN,
    auth_app_info : AUTH + APP + INFO,
    login : LOGIN,
    logout : LOGOUT,
    delete :  DELETE,
    point : POINT,
    get_status: GET + STATUS,

    pwd_upd : PWD + UPD,
    token_upd : TOKEN + UPD,
    get_locker: GET + LOCKER,
    borrow_helmet: BORROW + HELMET, 
    restore_helmet: RESTORE + HELMET,
    get_member: GET + MEMBER,
    get_record: GET + RECORD,
}

export const util = {
    home : VERSION,
    displayImage : DISPLAYIMAGE,
}

export const code = {
    SUCCESS_CODE: "9200",
	SUCCESS_MESSAGE: "success",
	FAIL_CODE : "9400",
	FAIL_MESSAGE : "fail",
	EXCEPTION_CODE : "9500",
	EXCEPTION_MESSAGE : "exception",
}

export const Values = {

	S3_URL : "https://s3.ap-northeast-2.amazonaws.com/",
	BUCKET_NAME : "pstartup-bucket",
	
	SUCCESS_CODE :"9200" ,
	SUCCESS_MESSAGE : "success",
	FAIL_CODE :"9400" ,
	FAIL_MESSAGE : "fail",
	EXCEPTION_CODE : "9500",
	EXCEPTION_MESSAGE : "exception",
    HELMET_CANNOT_BORROW: "7777",
    HELMET_CANNOT_RESTORE: "7778",
    MONEY_NOT_ENOUGH: "7779",
	
	FIREBASE_SERVER_KEY : "c5623cb20e3e72b1f77d30c09c27c05df9c0b06498b2775e1bb20e71fed18627399b345670c7516c",
	FIREBASE_API_URL : "https://fcm.googleapis.com/fcm/send",
	
	AUTH_ACTION : "AUTH",
	PUSH_TITLE : "해커톤",

	MEMBER_DUPLICATION_LOGIN_MESSAGE : "다른기기에서 로그인되었습니다.",
}
