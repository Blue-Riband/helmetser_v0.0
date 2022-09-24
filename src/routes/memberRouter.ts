import { code, member, path_value } from './values'
import { Router, Request, Response, NextFunction } from 'express';

// import passport from '../../config/passport';
import passport from 'passport'

import initialQuery from '../util/InitRequest'
import Member from '../model/Member';
import Lockers from '../model/Lockers';
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
                    // res.json(res_json) //(삭제 부분)
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
Post 예시
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
Get 예시
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

export default memberRouter;