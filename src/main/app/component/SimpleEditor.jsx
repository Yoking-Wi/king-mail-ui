import React, { Component } from 'react';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class SimpleEditor extends Component {
    constructor(props) {
        super(props);
        this.state={
            editorState: BraftEditor.createEditorState('玲珑骰子安红豆 入骨相思知不知'), // 设置编辑器初始内容
            outputHTML: ''
        };
    }

    /**
     * 监听编辑器变化
     * @param {*} data
     */
    onEditorChange(data){
        this.setState({
            editorState:data,
            outputHTML:data.toHTML()
        },()=>{
            // 通过父组件传递的方法 设置父组件数据
            this.props.setEmailContent(this.state.outputHTML);
        })
    }

    render() {
        //定义编辑器控件
        const controls = [
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'emoji', 'separator', 'text-align'
        ];
        return (
            <div style={{ border: '0.5px solid rgba(0, 0, 0, 0.1)',borderRadius:'10px' }}>
                <BraftEditor
                    controls={controls}
                    contentStyle={{ height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                    onChange={(data)=>this.onEditorChange(data)}
                    value={this.state.editorState}
                />
            </div>
        );
    }
}

export default SimpleEditor;