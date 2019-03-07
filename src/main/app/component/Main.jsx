import React, { Component } from 'react';
import { Tabs, Input, Row, Col, Card, Button, DatePicker, message ,Tooltip} from 'antd'
import BackgroundImage from '../../resource/pic/15.jpg'
import 'antd/dist/antd.css'
import SimpleEditor from './SimpleEditor';
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputIsVisual: false, //添加邮箱地址按钮 是否显示
            emailAddress: '',  //邮箱地址
            emailSubject: '',  //邮件主题
            emailContent: '',  //邮件内容
            emailSendTime: undefined //邮件定时发送的时间
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
            case 'content':
                this.setState({ emailContent: value });
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
     * 显示邮箱地址输入框
     */
    showEmailAddressInput() {
        //显示输入框 隐藏按钮
        this.setState({ inputIsVisual: true });
    }

    /**
     * TODO 校验邮件地址及敏感字符
     * */
    checkEmail(email) {
        return new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/).test(email);
    }

    /**
     * 定时发送邮件
     */
    sendWithSchedule() {
        //校验邮箱地址
        if(this.state.emailAddress!=null&&this.state.emailAddress.trim()!==""){
        if (!this.checkEmail(this.state.emailAddress)){
            message.error("书信地址不正确");
            return;
        }
    }

        let headers = new Headers();
        let url = "http://127.0.0.1:8080/api/email/schedule";
        headers.append("Content-Type", "application/json;charset=utf-8");
        fetch(url, {
            method: 'post',
            headers: headers,
            mode: 'cors',//跨域请求
            body: JSON.stringify({
                address: this.state.emailAddress,
                subject: this.state.emailSubject,
                content: this.state.emailContent,
                sendTime: this.state.emailSendTime
            })
        }).then(response => response.json())
            .then(data => {
                if (data.code === '200') {
                    message.success("书信将在 " + this.state.emailSendTime + " 传送");
                } else {
                    message.error("书信无法传送")
                }
            }).catch((err) => {
                console.log(err);
            });

    }

    render() {
        return (
            <div style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: '1600px 768px', height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={5} xs={2} />
                    <Col lg={14} xs={20} style={{ marginTop: '6%' }}>
                        <Card>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="书信" key="1" >
                                    <Col span={this.state.inputIsVisual ? 0 : 24}>
                                    <Tooltip title="印下汝之信箱 恭候吾等召唤">
                                    <Button type="primary" icon="plus" shape="circle" onClick={() => this.showEmailAddressInput()} />
                                    </Tooltip>
                                    </Col>
                                    <Col span={this.state.inputIsVisual ? 24 : 0}><Input addonBefore="书信地址" placeholder="陌上花开 可缓缓归矣" onChange={(evt) => this.onInputChange(evt.target.value, 'address')} /></Col>
                                    <Input addonBefore="书信主旨" placeholder="只愿君心似我心 定不负相思意" style={{ marginTop: '10px',marginBottom:'10px' }} onChange={(evt) => this.onInputChange(evt.target.value, 'subject')} />
                                    <TextArea rows="10" placeholder="玲珑骰子安红豆 入骨相思知不知" onChange={(evt) => this.onInputChange(evt.target.value, 'content')} />
                                    {/* <SimpleEditor/> */}
                                    <Row gutter={8}>
                                        <Col lg={6} md={6} xs={12} style={{ marginTop: '10px' }}>
                                            <DatePicker placeholder="何时" showTime style={{ width: '100%' }} onChange={(date, dateString) => this.onDatePickerChange(date, dateString)} />
                                        </Col>
                                        <Col lg={6} md={12} xs={24} style={{ marginTop: '10px' }}>
                                            <Button type="primary" onClick={() => this.sendWithSchedule()}>鸿雁传书</Button>
                                        </Col>
                                    </Row>
                                </TabPane>
                                {/* <TabPane tab="king-mail" key="2" disabled>
                                    <Input />
                                    <TextArea rows="4" />
                                </TabPane> */}
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