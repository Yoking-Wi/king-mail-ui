import React, { Component } from 'react';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

/**
 * 自定义控件的富文本编辑器
 * @author yoking-wi
 * @version 2019年3月10日 20:37:23
 */
class SimpleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState('玲珑骰子安红豆 入骨相思知不知'), // 编辑器初始内容
            outputHTML: '', // 编辑器内容 HTML格式
            // isMobile: false, // 是否移动端
            editorSize:210, //编辑器大小
            controls: [
                'font-size', 'line-height', 'letter-spacing', 'separator',
                'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                'superscript', 'subscript', 'emoji', 'separator', 'text-align'
            ]
        };
    }

    componentWillMount(){
        if(this.checkMobliePlatform()){
            this.setState({
                // isMobile:true,
                editorSize:117,
                controls:['text-color', 'bold', 'italic', 'underline', 'strike-through','emoji']
            })
        }
    }

    // componentDidMount() {
    //     this.checkMobliePlatform();
    //     if (this.state.isMobile) {
    //         this.setState({
    //             controls: ['emoji']
    //         })
    //     }
    // }

    /**
     * 监听编辑器变化
     * @param {*} data
     */
    onEditorChange(data) {
        this.setState({
            editorState: data,
            outputHTML: data.toHTML()
        }, () => {
            // 通过父组件传递的方法 设置父组件数据
            this.props.setEmailContent(this.state.outputHTML);
        })
    }

    /**
     * 判断平台是否移动端
     */
    checkMobliePlatform() {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) { // /i表示对大小写不敏感
            // this.setState({isMobile:true});
            return true;
        }
        return false;
    }

    render() {
        // //定义编辑器控件
        // const controls = [
        //     'font-size', 'line-height', 'letter-spacing', 'separator',
        //     'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        //     'superscript', 'subscript', 'emoji', 'separator', 'text-align'
        // ];
        return (
            <div style={{ border: '0.5px solid rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
                <BraftEditor
                    controls={this.state.controls}
                    contentStyle={{ height: this.state.editorSize, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                    onChange={(data) => this.onEditorChange(data)}
                    value={this.state.editorState}
                />
            </div>
        );
    }
}

export default SimpleEditor;