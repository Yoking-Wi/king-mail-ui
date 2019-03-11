import React, { Component } from 'react';
import { Card, Spin, Modal } from 'antd';
import JigsawCaptcha from './JigsawCaptcha';
//批量引用本地图片
const requireContext = require.context("../../../resource/img/captcha/img", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

/**
 * 验证码窗口
 * @author yoking-wi
 * @version 2019年3月10日 20:39:05
 */
class ValidationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            loading: false //加载图片状态
        };
    }

    componentDidMount() {
        this.setState({ imageUrl: this.getImage() })
    }

    /**
     * 刷新图片
     */
    onReload() {
        this.setState({ loading: true })
        //延时1秒后 加载图片
        setTimeout(() => {
            this.setState({ imageUrl: this.getImage(), loading: false })
        }, 1000);
    }

    /**
     * 随机获取一张图片
     */
    getImage() {
        return images[Math.floor(Math.random() * images.length)];
    }

    /**
     * 验证通过
     */
    onMatch() {
        this.props.sendWithSchedule();
        this.props.hideValidationModal();
    }

    /**
     * 验证失败
     */
    onError() {
        // 重新加载图片
        this.onReload();
    }

    render() {
        return (
            <Modal visible centered footer={null} width="300px" onCancel={() => this.props.hideValidationModal()}>
                <Spin spinning={this.state.loading} tip="loading">
                    <Card>
                        <JigsawCaptcha
                            ref="captcha"
                            imageWidth={200}
                            imageHeight={150}
                            fragmentSize={40}
                            imageUrl={this.state.imageUrl}
                            onReload={() => this.onReload()}
                            onMatch={() => this.onMatch()}
                            onError={() => this.onError()}
                        />
                    </Card>
                </Spin>
            </Modal>
        );
    }
}

export default ValidationModal;