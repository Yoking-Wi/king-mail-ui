import React, { Component } from 'react';
import ReactMarkdown  from 'react-markdown'

/**
 * 公告
 * @author yoking-wi
 * @version 2019年3月16日 14:29:29
 */
class Notice extends Component {
    render() {
        const input = '# King Mail\n小时候看一个电视剧时，剧里有个小店提供一种**往未来寄信**的服务，你可以**给某个人写信**，**指定未来的某个时间点**，然后这个小店就会在指定时间点帮你送到指定的人那里，那时候我就在想要是有这种小店就好了。\n\n也许是我孤陋寡闻，至今没发现这种小店，不过没关系，没有的话就自己创造，这个平台就相当于那个小店的网店\n\n**别问我为什么不用现成的电子邮箱，没劲**'
        return (
            <ReactMarkdown source={input}/>
        );
    }
}

export default Notice;