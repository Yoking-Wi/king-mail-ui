import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import BackgroundImage from '../../../resource/img/15.jpg';
import './entrance-animation.css'

/**
 * 进入动画 （进入主界面之前的动画）
 * @author yoking-wi
 * @version 2019年3月16日 14:26:51
 */
class EntranceAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <QueueAnim style={{ height: '100%' }} type="alpha" animConfig={[{ opacity: [1, 0] }, { opacity: [1, 0] }]} duration={2500}>
                <div key="zero" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', overflow: 'auto', height: '100%' }}>
                    <QueueAnim type={["top", "alpha"]} delay={750} duration={2000}>
                        <div key="one" className="center-1 font">
                            昔日车邮马慢
              </div>
                    </QueueAnim>
                    <QueueAnim type={["top", "alpha"]} delay={1500} duration={2000}>
                        <div key="two" className="center-2 font">
                            一生唯爱一人
              </div>
                    </QueueAnim>
                    {/* <QueueAnim type={["top", "alpha"]} delay={2500} duration={2000}>
                        <div key="three" className="center-3 font">
                            一生只够爱一人
              </div>
                    </QueueAnim> */}
                </div>
            </QueueAnim>
        );
    }
}

export default EntranceAnimation;