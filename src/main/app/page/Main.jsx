import React, { Component } from 'react';
import { Tabs, Input, Row, Col, Card, Button, DatePicker, message, Modal } from 'antd';
import FastScanner from 'fastscan';
import SimpleEditor from '../component/SimpleEditor';
import ValidationModal from '../component/captch/ValidationModal';
import Counter from '../component/Counter';
import Config from '../config/global-config';
import SensitiveWordLib from '../config/sensitive-words-lib';
import BackgroundImage from '../../resource/img/15.jpg';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'antd/dist/antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const TabPane = Tabs.TabPane;
const SEND_TO_MYSELF = 0; //发送邮件给未来的自己
const SEND_TO_OTHER = 1;  //发送邮件给其他人

/**
 * 主界面
 * @author yoking-wi
 * @version 2019年3月10日 20:42:53
 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputIsVisible: false, //添加邮箱地址按钮 是否可见
            emailAddress: '',  //邮箱地址
            emailSubject: '',  //邮件主题
            emailContent: '',  //邮件内容
            emailSendTime: undefined, //邮件定时发送的时间
            validationModalIsVisible: false, // 滑动拼图验证码的窗口 是否可见
            secondValidationModalIsVisible: false, // 第二个滑动拼图验证码的窗口 是否可见
            instructionModalIsVisible: false //使用说明的弹窗 是否可见
        };
    }

    /**
     * 监听输入变化
     * @param {*} type
     */
    onInputChange(value, type) {
        switch (type) {
            case 'address':
                this.setState({ emailAddress: value });
                break;
            case 'subject':
                this.setState({ emailSubject: value });
                break;
            default:
                break;
        }
    }

    /**
     * 监听日期选择框变化
     * @param {*} dateString 日期字符串
     */
    onDatePickerChange(date, dateString) {
        this.setState({ emailSendTime: dateString })
    }

    /**
     * 显示或隐藏 使用说明弹窗
     */
    showOrHideInstructionModal(type) {
        if (type === "open") {
            this.setState({ instructionModalIsVisible: true });
        }
        else if (type === "close") {
            this.setState({ instructionModalIsVisible: false });
        }
    }

    /**
     * 校验邮箱地址
     * @param value
     * */
    checkEmailAddress(value) {
        return new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/).test(value);
    }

    /**
     * 校验邮件内容是否为空
     * @param value
     */
    checkEmailContent(value) {
        if (value === "<p></p>" || value === "") {
            return false;
        }
        return true;
    }

    /**
     * 校验敏感字符
     * @param value
     * @returns 有敏感词就返回包含 校验到的第一个敏感词 的二维数组 否则就返回空的二维数组
     */
    checkSensitiveWords(value) {
        //定义敏感词库
        let sensitiveWordLib = SensitiveWordLib.LIB;
        let scanner = new FastScanner(sensitiveWordLib);
        // 查询敏感词 longest:匹配最长 quick:匹配到一个即返回
        let sensitiveWords = scanner.search(value, { quick: true, longest: false });
        // if (sensitiveWords.length !== 0) {
        //     // 返回找到的第一个敏感词
        //     return sensitiveWords[0][1];
        // }
        return sensitiveWords;

    }

    /**
     * 定时发送邮件
     * @param type
     */
    sendWithSchedule(type) {
        let url = '';
        if (type === SEND_TO_MYSELF) {
            url = `${Config.URL}/api/email/schedule/myself`;
        } else if (type === SEND_TO_OTHER) {
            url = `${Config.URL}/api/email/schedule`;
        }
        let headers = new Headers();
        headers.append("Content-Type", "application/json;charset=utf-8");
        let send = () => fetch(url, {
            method: 'post',
            headers: headers,
            mode: 'cors',//跨域请求
            body: JSON.stringify({
                address: this.state.emailAddress,
                subject: this.state.emailSubject,
                content: this.state.emailContent,
                sendTime: this.state.emailSendTime,
                type: 'html'
            })
        }).then(response => {
            return response.json();
        }
        ).then(result => {
            if (result.code === '200') {
                message.success("鸿雁将在 " + this.state.emailSendTime + " 传送书信");
            } else {
                message.error("鸿雁很心累 表示书信无法传送")
            }
        }).catch((err) => {
            message.error("鸿雁发疯了 书信无法传送")
            console.log(err);
        });
        message.loading("正在挑选传送书信的鸿雁...").then(send);

        // //清空state
        // this.setState({
        //     inputIsVisible: false, //添加邮箱地址按钮 是否可见
        //     emailAddress: '',  //邮箱地址
        //     emailSubject: '',  //邮件主题
        //     emailSendTime: undefined, //邮件定时发送的时间
        //     validationModalIsVisible: false // 滑动拼图验证码的窗口 是否可见
        // })
    }

    /**
     * 设置邮件内容
     * @param {*} data
     */
    setEmailContent(data) {
        this.setState({ emailContent: data });
    }

    /**
     * 显示窗口 滑动拼图校验
     * @param type
     */
    showValidationModal(type) {
        // 当 发邮件给未来的自己时 邮箱校验
        if (type === SEND_TO_MYSELF) {
            if (this.state.emailAddress === null || this.state.emailAddress.trim() === "") {
                message.warning("书信地址不能为空");
                return;
            }
            if (!this.checkEmailAddress(this.state.emailAddress)) {
                message.warning("书信地址不正确");
                return;
            }
        } else if (type === SEND_TO_OTHER) {// 当 发邮件给其他人时 邮箱校验
            if (this.state.emailAddress != null && this.state.emailAddress.trim() !== "") {
                if (!this.checkEmailAddress(this.state.emailAddress)) {
                    message.warning("书信地址不正确");
                    return;
                }
            }
        }
        // 校验邮件发送时间是否为空
        if (this.state.emailSendTime === undefined) {
            message.warning("请指定传送书信日期时间");
            return;
        }
        // 校验邮件内容是否为空
        if (!this.checkEmailContent(this.state.emailContent)) {
            message.warning("书信内容不能为空");
            return;
        } else if (this.checkEmailContent(this.state.emailContent)) { //邮件内容不为空时 校验内容是否含敏感词
            if (this.checkSensitiveWords(this.state.emailContent).length !== 0) {
                let sensitiveWord = this.checkSensitiveWords(this.state.emailContent)[0][1];
                message.warning("书信内容包含敏感词：" + sensitiveWord);
                return;
            };
        }
        //当 发邮件给未来的自己时 是第一个弹窗 否则 是第二个弹窗
        if (type === SEND_TO_MYSELF) {
            this.setState({ validationModalIsVisible: true });
        } else if (type === SEND_TO_OTHER) {
            this.setState({ secondValidationModalIsVisible: true });
        }
    }

    /**
     * 隐藏窗口 滑动拼图校验
     * @param type
     */
    hideValidationModal(type) {
        //当 发邮件给未来的自己时 是第一个弹窗 否则 是第二个弹窗
        if (type === SEND_TO_MYSELF) {
            this.setState({ validationModalIsVisible: false });
        } else if (type === SEND_TO_OTHER) {
            this.setState({ secondValidationModalIsVisible: false });
        }
    }

    /**
     * 禁止选择过去的日期
     *
     * @param {*} currentDate
     */
    disabledDate(currentDate) {
        //小于当前日期（不含当前日期）
        let duration = moment.duration({ 'days': 1 });
        return currentDate < moment().subtract(duration);
    }

    /**
     * 禁止选择过去的时间
     * @param datetime
     */
    disabledDateTime(datetime) {
        let currentDay = moment().date(); //Gets the day of the month.
        let currentHour = moment().hour();
        let currentMinute = moment().minute();
        let currentSecond = moment().second();
        let result = {};

        // 未选择 或 选择天为当天 或 选择天，小时为当天当前小时 或 选择天，小时，分钟为当天当前小时当前分钟
        if (datetime === undefined || datetime.date() === currentDay || (datetime.date() === currentDay && datetime.hour() === currentHour) || (datetime.date() === currentDay && datetime.hour() === currentHour && datetime.minute() === currentMinute)) {
            result = {
                disabledHours: () => this.range(0, 24).filter((currentValue) => { return currentValue < currentHour }),
                disabledMinutes: () => this.range(0, 60).filter((currentValue) => { return currentValue < currentMinute }),
                disabledSeconds: () => this.range(0, 60).filter((currentValue) => { return currentValue < currentSecond })
            };
        }
        if (datetime !== undefined) {
            // 选择天，小时为当天当前小时 且 选择分钟大于当前分钟
            if (datetime.date() === currentDay && datetime.hour() === currentHour && datetime.minute() > currentMinute) {
                result = {
                    disabledHours: () => this.range(0, 24).filter((currentValue) => { return currentValue < currentHour }),
                    disabledMinutes: () => this.range(0, 60).filter((currentValue) => { return currentValue < currentMinute }),
                    disabledSeconds: () => []
                };
            }
            // 选择天为当天 且 选择小时大于当前小时
            if (datetime.date() === currentDay && datetime.hour() > currentHour) {
                result = {
                    disabledHours: () => this.range(0, 24).filter((currentValue) => { return currentValue < currentHour }),
                    disabledMinutes: () => [],
                    disabledSeconds: () => []
                };
            }
            // 选择天大于当天
            if (datetime.date() > currentDay) {
                result = {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => []
                };
            }
        }
        return result;
    }

    /**
     * 获取指定始末位置的数组
     *
     * @param start
     * @param end
     */
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    render() {
        return (
            <div style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', overflow: 'auto', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={5} xs={2} />
                    <Col lg={14} xs={20} style={{ marginTop: '5%', marginBottom: '5%' }}>
                        <Card>
                            <Tabs defaultActiveKey="1" tabBarExtraContent={<Counter />}>
                                <TabPane tab="书信" key="1" >
                                    <Col lg={18} md={18} xs={16}>
                                        <Button type="primary" icon="question" shape="circle" size="small" onClick={() => this.showOrHideInstructionModal("open")} />
                                        <Modal footer={null} title="使用说明" visible={this.state.instructionModalIsVisible} onCancel={() => this.showOrHideInstructionModal("close")}>{Config.USAGE!==""?Config.USAGE:"请自行摸索！自己玩去"}</Modal>
                                    </Col>
                                    <Col lg={6} md={6} xs={8}>
                                        <Button style={{ width: '100%' }} onClick={() => this.showValidationModal(SEND_TO_OTHER)}>鸿雁传书</Button>
                                        {this.state.secondValidationModalIsVisible ? <ValidationModal onHide={() => this.hideValidationModal(SEND_TO_OTHER)} onSucceed={() => this.sendWithSchedule(SEND_TO_OTHER)} /> : ''}
                                    </Col>
                                    <Input addonBefore="书信地址" placeholder="陌上花开 可缓缓归矣" style={{ marginTop: '10px' }} onChange={(evt) => this.onInputChange(evt.target.value, 'address')} />
                                    <Input addonBefore="书信主旨" placeholder="只愿君心似我心 定不负相思意" style={{ marginTop: '10px', marginBottom: '10px' }} onChange={(evt) => this.onInputChange(evt.target.value, 'subject')} />
                                    <SimpleEditor setEmailContent={(data) => this.setEmailContent(data)} />
                                    <Col lg={{ span: 6 }} md={{ span: 6 }} xs={24} style={{ marginTop: '10px' }}>
                                        <DatePicker
                                            showTime
                                            locale={locale}
                                            placeholder="何时"
                                            style={{ width: '100%' }}
                                            disabledDate={(currentDate) => this.disabledDate(currentDate)}
                                            disabledTime={(datetime) => this.disabledDateTime(datetime)}
                                            onChange={(date, dateString) => this.onDatePickerChange(date, dateString)} />
                                    </Col>
                                    <Col lg={{ span: 6, offset: 12 }} md={{ span: 6, offset: 12 }} xs={24} style={{ marginTop: '10px' }}>
                                        <Button type="primary" style={{ width: '100%' }} onClick={() => this.showValidationModal(SEND_TO_MYSELF)}>送给未来的自己</Button>
                                        {this.state.validationModalIsVisible ? <ValidationModal onHide={() => this.hideValidationModal(SEND_TO_MYSELF)} onSucceed={() => this.sendWithSchedule(SEND_TO_MYSELF)} /> : ''}
                                    </Col>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col lg={5} xs={2} />
                </Row>
            </div>

        );
    }
}

export default Main;