import React, { Component } from 'react';
import { Modal } from 'antd';
import JigsawCaptcha from './JigsawCaptcha';
//批量引用本地图片
const requireContext = require.context("../../../resource/img/captcha/img", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

class ValidationModal extends Component {
    constructor(props) {
        super(props);
        this.state={imgeUrl:''};
    }

    componentDidMount() {
        this.setState({ imgeUrl: this.getImage() })
    }

    componentDidUpdate(){

    }

    /**
     * 刷新图片
     */
    onReload(){
        this.setState({ imgeUrl: this.getImage() })
    }

    /**
     * 随机获取一张图片
     */
    getImage(){
        let newImageUrl = images[Math.floor(Math.random()*images.length)];
        if(this.state.imgeUrl !== newImageUrl){
            return newImageUrl;
        }else{
            //若 新获取的图片 与 旧图片 相等 则再随机一次
            return images[Math.floor(Math.random()*images.length)];
        }
    }

    /**
     * 验证通过
     */
    onMatch(){
        this.props.sendWithSchedule();
        this.props.hideValidationModal();
        //调用子组件方法onReload
        this.refs.captcha.onReload();
    }

    render() {
        return (
            <Modal visible={this.props.modalIsVisible} centered footer={null} onCancel={() => this.props.hideValidationModal()}>
                <JigsawCaptcha
                    ref="captcha"
                    // imageWidth="475px"
                    imageUrl={this.state.imgeUrl}
                    onReload={()=>this.onReload()}
                    onMatch={() => this.onMatch()}
                />
            </Modal>
        );
    }
}

export default ValidationModal;