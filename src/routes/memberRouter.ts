import { code, member, path_value } from './values'
import { Router, Request, Response, NextFunction } from 'express';

// import passport from '../../config/passport';
import passport from 'passport'

import initialQuery from '../util/InitRequest'
import Member from '../model/Member';
import Lockers from '../model/Lockers';
import Room from '../model/Room';
import Result from '../model/Result';
import MemberDao from '@daos/Member/MemberDao';

import { classToPlain, plainToClass } from "class-transformer";
const camelcaseKeysDeep = require('camelcase-keys-deep');

import ResponseVO from '../model/ResponseVO';
import { Values } from './values';
import { setResponseData } from '../model/Result';
import TypeConverUtil from '../util/TypeConvert';

// Sub Router

import { database } from '../Server'
import { isLoggedIn, isNotLoggedIn } from './middlewares'
import { JwtService } from '@shared/JwtService';
import { StatusCodes } from 'http-status-codes';
import { cookieProps } from '@shared/constants';

const memberDao = new MemberDao()

const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

const memberRouter = Router()

const typeConverUtil = new TypeConverUtil()

interface classCodeForm extends Request {
    class_code: string,
}

memberRouter.all('/*', function (req, res, next) {
    console.log('in mebmerRouter', req.url, req.method)
    next();
});

// Routing

memberRouter.get(member.main, (req, res, next) => {
    res.render(path_value.pathView(member.member + member.main))
})

// memberRouter.get(member.login, (req, res, next) => {
//     let action = req.query.action;
//     res.render('member/login.ejs', { action: action });
// })

memberRouter.post(member.login, async (req, res, next) => {
    let res_json: any = {};
    const { email, password, token } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: 'paramMissingError',
        });
    }

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.selectMember(email, conn).then(async (result) => {
                    if (result) {
                        result = camelcaseKeysDeep(result)
                        let member = plainToClass(Member, result as Member)
                        if (!member.authenticate(password)) {
                            console.log('is not authenticate by pw')
                            return res.status(UNAUTHORIZED).json({
                                error: 'loginFailedErr',
                            });
                        } else {
                            console.log('member authenticate')

                            let obj = {
                                id: member.getMemberId(),
                                type: 'member',
                                name: member.getName(),
                                classCode: member.getClassCode(),
                                companyNum: member.getCompanyNum(),
                            }
                            // Setup Member Cookie
                            const jwt = await jwtService.getJwt(obj);
                            const { key, options } = cookieProps;
                            res.cookie(key, jwt, options);
                            res_json.member = obj;
                            res_json.jwt = jwt;
                            res.json(res_json);
                            // // Return
                            // return res.status(OK).end();
                        }
                    } else {
                        console.log('in passport, id/pw is wrong')
                        return res.status(OK).json({
                            error: 'loginFailedErr',
                            code: Values.FAIL_CODE,
                        });
                    }
                }).catch((err) => {
                    if (err.hasOwnProperty('code')) {
                        res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                        res_json.msg = err.msg
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                        res_json.msg = err
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                }).then(() => {
                    // res.json(res_json) //(?????? ??????)
                })
            })
        }
    })
})

memberRouter.get(member.logout, isLoggedIn, (req, res) => {
    req.logout();
    // req.session.destroy();
    res.redirect("/")
})

memberRouter.get(member.auth_app_info, (req, res) => {
    let res_json: any = {};
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }
    console.log(query.email)
    memberDao.selectEmailAuthAppInfo(query.email).then((result: any) => {
        if (result.length != 0) {
            res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        } else {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
        }
    }).catch((err) => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, err)
    }).then((result) => {
        console.log(res_json)
        res.json(res_json)
    })
})

memberRouter.post(member.join, async (req, res, next) => {
    let b_params = req.body, res_json: any = {};
    const { email, pwd, phone, name, token } = b_params;
    console.log(b_params)

    let tok = token ? '' : token;

    let member = new Member();
    await member.setMemberId(email)
        .setName(name)
        .setPhone(phone)
        .setPassword(pwd)
    console.log(member);

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.insertMember(
                    member.getMemberId(), member.getPassword(),
                    member.getName(), member.getPhone(), tok, conn = conn)
                    .then(async (result: any) => {
                        let obj = {
                            id: member.getMemberId(),
                            type: 'member',
                            name: member.getMemberId(),
                            classCode: '0',
                            companyNum: 0,
                        }
                        // Setup Member Cookie
                        const jwt = await jwtService.getJwt(obj);
                        res_json.jwt = jwt;
                        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                    }).catch((err) => {
                        if (err.hasOwnProperty('code')) {
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                            res_json.msg = err.msg
                        } else {
                            res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                            res_json.msg = err
                        }
                        conn.rollback();
                    }).then(() => {
                        conn.commit((err) => {
                            if (err) {
                                conn.rollback(() => {
                                    conn.release();
                                })
                                res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                                res_json.msg = err;
                            } else {
                                conn.release();
                            }
                        })
                    }).then(() => {
                        res.json(res_json)
                    })
            })
        }
    })
})

/*
Post ??????
memberRouter.post(member.class_enter, (req, res, next) => {
    let b_params = req.body, res_json: any = {};
    const { email, classCode } = b_params;

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                eduDao.selectClass(classCode, conn).then((result: any) => {
                    result = camelcaseKeysDeep(result)
                    let clazz = plainToClass(Class, result);
                    return clazz[0]
                }).then((clazz: Class) => {
                    if (clazz == null) throw { code: Values.FAIL_CODE }
                    else if (clazz.getClassStatus() == 'wait') throw { 'code': Values.CLASS_NO_START_CODE, 'msg': "Class is Waiting" }
                    else if (clazz.getClassStatus() == 'finish') throw { 'code': Values.CLASS_FINISH_CODE, 'msg': "Class is finished" }
                    else return;
                }).then(() => {
                    return memberDao.updateMemberClass(email, classCode, conn)
                }).then(() => {
                    return memberDao.updateClassEnter(classCode, conn)
                }).then(() => {
                    res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                }).catch((err: any) => {
                    console.log('in error ', err)
                    if (err.hasOwnProperty('code')) {
                        if (err.code == Values.CLASS_NO_START_CODE) {
                            res_json = setResponseData(res_json, Values.CLASS_NO_START_CODE, Values.CLASS_NO_START_MESSAGE)
                        } else if (err.code == Values.CLASS_FINISH_CODE) {
                            res_json = setResponseData(res_json, Values.CLASS_FINISH_CODE, Values.CLASS_FINISH_MESSAGE)
                        } else {
                            res_json = setResponseData(res_json, Values.FAIL_CODE, err.msg)
                        }
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, err);
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                })
                    .then(() => {
                        res.json(res_json)
                    })
            })
        }
    })

})
*/

/*
Get ??????
memberRouter.get(member.company_list, (req, res, next) => {
    let res_json: any = {};
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    companyDao.selectCompanyList(query.classCode).then((result: any) => {
        if (result.length != 0) {
            res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
            res_json.companies = result;
        } else {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
        }
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})
*/


memberRouter.post(member.delete, (req, res) => {
    let b_params = req.body, res_json: any = {};
    const { email } = b_params;

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.selectMember(email, conn).then((result: any) => {
                    if (result != null || result.length > 0) {
                        return memberDao.deleteMember(email, conn)
                    } else {
                        throw { code: Values.FAIL_CODE }
                    }
                }).then((result: any) => {
                    if (result != null || result.length > 0) {
                        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                    } else {
                        throw { code: Values.FAIL_CODE }
                    }
                }).catch(err => {
                    if (err.hasOwnProperty('code')) {
                        res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                        if (err.code == Values.FAIL_CODE) {
                            res_json.msg = "There is no Member to Delete"
                        } else {
                            res_json.msg = err.msg
                        }
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                        res_json.err = err
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                })
                    .then(() => {
                        res.json(res_json)
                    })
            })
        }
    })
})

memberRouter.get(member.get_locker, (req, res, next) => {
    let res_json: any = {};
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }
    memberDao.selectLocker().then((result: any) => {
        result = camelcaseKeysDeep(result)
        return plainToClass(Lockers, result)
    }).then((locker: any)=>{
        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        res_json.lockers = locker;
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})

memberRouter.get(member.get_status, (req, res, next) => {
    let res_json: any = {};
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    console.log(query.member_id)
    memberDao.selectMemberStatus(query.member_id).then((result: any) => {
        result = camelcaseKeysDeep(result)
        return result[0].status
    }).then((status: any)=>{
        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        res_json.status = status;
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})

memberRouter.post(member.point, (req, res, next) =>{
    let b_params = req.body, res_json: any = {};
    const { member_id, point } = b_params;
    let query: any = typeConverUtil.convert(req.query)
    console.log(member_id, point)
    let helmet_id;

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.updateMemberPoint(member_id, point, conn).then((result: any) => {
                    res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                }).catch(err => {
                    if (err.hasOwnProperty('code')) {
                        res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                        if (err.code == Values.FAIL_CODE) {
                            res_json.msg = "There is no Member to Delete"
                        } else {
                            res_json.msg = err.msg
                        }
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                        res_json.err = err
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                })
                    .then(() => {
                        res.json(res_json)
                    })
            })
        }
    })
})

memberRouter.post(member.borrow_helmet, (req, res, next) =>{
    let b_params = req.body, res_json: any = {};
    const { member_id, locker_id, room_id } = b_params;
    let query: any = typeConverUtil.convert(req.query)
    console.log(locker_id, room_id)
    let helmet_id;

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.selectRoom(locker_id, room_id, conn).then((result: any) => {
                    if(result[0] == undefined)
                        throw {code: Values.HELMET_CANNOT_BORROW}
                    result = camelcaseKeysDeep(result)
                    console.log(result[0].status)
                    if ((result[0].status != 0) && (result[0].helmet_status != 0)) {
                       throw {code: Values.HELMET_CANNOT_BORROW}
                    } else {
                        helmet_id =  result[0].helmetId
                        console.log(result)
                        return result
                    }
                }).then((result: any) => {
                    return memberDao.selectMemberPoint(member_id) 
                }).then((result: any) => {
                    if(result.point < 15000)
                        throw {code: Values.MONEY_NOT_ENOUGH}
                }).then((result: any) => {
                    return memberDao.insertRentSheet(member_id, helmet_id, locker_id, room_id) 
                }).then((result: any)=>{
                    return memberDao.updateMemberStatusBorrowing(member_id)
                }).then((result: any)=>{
                    return memberDao.updateHelmetStatusBorrowing(helmet_id)
                }).then((result: any)=>{
                    return memberDao.updateLockerCurrent(locker_id)
                }).then((result: any)=>{
                    return memberDao.updateRoomStatusBorrowing(locker_id, room_id)
                }).then(()=>{
                    res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                }).catch(err => {
                    if (err.hasOwnProperty('code')) {
                        res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                        if (err.code == Values.FAIL_CODE) {
                        
                            res_json.msg = "There is no Member to Delete"
                        } 
                        else if(err.code == Values.HELMET_CANNOT_BORROW){
                            res_json.code = err.code
                            res_json.msg = "room empty"
                        }
                        else if(err.code == Values.MONEY_NOT_ENOUGH){
                            res_json.code = err.code
                            res_json.msg = "money not enough"
                        }
                        else {
                            res_json.msg = err.msg
                        }
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                        res_json.err = err
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                })
                    .then(() => {
                        res.json(res_json)
                    })
            })
        }
    })
})

memberRouter.post(member.restore_helmet, (req, res, next) =>{
    let b_params = req.body, res_json: any = {};
    const { member_id, locker_id, room_id } = b_params;
    let query: any = typeConverUtil.convert(req.query)
    console.log(locker_id, room_id)
    let helmet_id;

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    database.getConnection((err: any, conn: any) => {
        if (err) {
            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
            res_json.msg = err;
            res.json(res_json)
        } else {
            conn.beginTransaction((err) => {
                memberDao.selectCheckRoom(locker_id, room_id, conn)
                .then((result: any) => {
                    result = camelcaseKeysDeep(result)
                    console.log(result[0].status)
                    if (result[0].status != 1) {
                       throw {code: Values.HELMET_CANNOT_RESTORE}
                    }
                }).then(() => {
                    return memberDao.selectHelmetId(member_id)
                }).then((result: any)=>{
                    result = camelcaseKeysDeep(result)
                    console.log(result[0].helmetId)
                    helmet_id = result[0].helmetId
                }).then(() => {
                    return memberDao.updateRentSheet(member_id, locker_id, room_id) 
                }).then(()=>{
                    return memberDao.updateMemberStatusRestored(member_id)
                }).then(()=>{
                    return memberDao.updateHelmetStatusRestored(helmet_id)
                }).then(()=>{
                    return memberDao.updateLockerCurrentRestored(locker_id)
                }).then(()=>{
                    return memberDao.updateRoomStatusRestored(locker_id, room_id)
                }).then(()=>{
                    res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
                }).catch(err => {
                    if (err.hasOwnProperty('code')) {
                        res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE)
                        if (err.code == Values.FAIL_CODE) {
                            res_json.msg = "There is no Member to Delete"
                        } else if(err.code == Values.HELMET_CANNOT_RESTORE){
                            res_json.code = err.code
                            res_json.msg = "room is full"
                        }
                        else{
                            res_json.msg = err.msg
                        }
                    } else {
                        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
                        res_json.err = err
                    }
                    conn.rollback();
                }).then(() => {
                    conn.commit((err) => {
                        if (err) {
                            conn.rollback(() => {
                                conn.release();
                            })
                            res_json = setResponseData(res_json, Values.FAIL_CODE, Values.FAIL_MESSAGE);
                            res_json.msg = err;
                        } else {
                            conn.release();
                        }
                    })
                })
                    .then(() => {
                        res.json(res_json)
                    })
            })
        }
    })
})


memberRouter.get(member.get_member, (req, res, next) => {
    let b_params = req.body, res_json: any = {};
    //const {member_id} = b_params;
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    memberDao.selectMemberInfo(query.member_id).then((result: any) => {
        result = camelcaseKeysDeep(result)
        return plainToClass(Member, result)
    }).then((member: any)=>{
        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        res_json.member = member;
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})

memberRouter.get(member.get_record, (req, res, next) => {
    let b_params = req.body, res_json: any = {};
    //const {member_id} = b_params;
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    memberDao.selectMemberRecord(query.member_id).then((result: any) => {
        result = camelcaseKeysDeep(result)
        return result
    }).then((record: any)=>{
        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        res_json.record = record;
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})

memberRouter.get(member.get_room, (req, res, next) => {
    let b_params = req.body, res_json: any = {};
    //const {locker_id} = b_params;
    let query: any = typeConverUtil.convert(req.query)

    if (query == null) {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.msg = "Query Type Error!"
        return res.json(res_json)
    }

    memberDao.selectRoomByLocker(query.locker_id).then((result: any) => {
        result = camelcaseKeysDeep(result)
        return result
    }).then((room: any)=>{
        res_json = setResponseData(res_json, Values.SUCCESS_CODE, Values.SUCCESS_MESSAGE)
        res_json.room = room;
    }).catch(err => {
        res_json = setResponseData(res_json, Values.EXCEPTION_CODE, Values.EXCEPTION_MESSAGE);
        res_json.err = err;
    }).then(() => {
        res.json(res_json)
    })
})

export default memberRouter;