import React, { Component } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client'
// import Config from '../config/global-config'

/**
 * 已发送邮件及待发送邮件的计数器
 * @todo待发邮件数量
 * @author yoking-wi
 * @version 2019年3月10日 20:38:13
 */
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailSentNum: 0,  // 已发送的邮件数量
            emailUnsentNum: 0  // 未发送的邮件数量
        }
    }

    componentDidMount() {
        this.init();
    }

    /**
     * 初始化
     * 获取数据
     * 建立 websocket 连接
     */
    init() {
        // 获取数据
        let headers = new Headers();
        // let url = "http://127.0.0.1:8080/api/email/schedule";
        let url = `/api/email/schedule/completed-job-number`;
        headers.append("Content-Type", "application/json;charset=utf-8");
        fetch(url, {
            method: 'get',
            headers: headers,
            // mode: 'cors',//跨域请求
        }).then(response => {
            return response.json()
        }).then(result => {
            this.setState({ emailSentNum: result.data });
        }).catch(err => {
            console.log(err);
        })

        // 建立 websocket 连接
        let sockjs = new SockJS(`/ws/email`);
        let stomp = Stomp.over(sockjs);
        // 建立 websocket 连接
        stomp.connect({}, () => {
            // 连接成功后 订阅topic
            stomp.subscribe("/topic/completed-job-number", (response) => {
                this.setState({ emailSentNum: response.body });
            });
        });
    }

    render() {
        const emailSentNum = this.state.emailSentNum;
        return (
            <div style={{ color: '#1890ff' }}>
                <span style={{ fontWeight: 'bold' }}>{`${emailSentNum}`}</span>只鸿雁完成了使命
            </div>
        );
    }
}

export default Counter;