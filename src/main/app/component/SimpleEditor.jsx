import React, { Component } from 'react';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class SimpleEditor extends Component {
    constructor(props) {
        super(props);
        this.state={};
    }

    render() {
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
                />
            </div>
        );
    }
}

export default SimpleEditor;