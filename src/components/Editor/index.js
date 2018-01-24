import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AlbumModal from '../AlbumModal';
import AuctionModal from '../AuctionModal';
import styles from './index.less';
@connect(() => ({

}))
export default class Editor extends PureComponent {
  state = {
    ue: null,
  }
  componentDidMount() {
    let script;
    if (!document.getElementById('ueditor-config')) {
      script = document.createElement('script');
      script.id = 'ueditor-config';
      script.src = '/ueditor/ueditor.config.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (!document.getElementById('ueditor')) {
          script = document.createElement('script');
          script.id = 'ueditor';
          script.src = '/ueditor/ueditor.all.js';
          script.async = true;
          document.body.appendChild(script);
          script.onload = () => {
            this.showUeditor();
          };
          script.onreadystatechange = script.onload;
        }
      };
      script.onreadystatechange = script.onload;
    } else {
      this.showUeditor();
    }
  }
  componentWillUnmount() {
    if (this.state.ue) {
      this.state.ue.destroy();
    }
  }
  showUeditor = () => {
    const forecolor = this.props.role === 'approve' ? 'forecolor' : '';
    const backcolor = this.props.role === 'approve' ? 'backcolor' : '';
    const ue = window.UE.getEditor('editor', {
      toolbars: [
        [
          'undo', // 撤销
          'redo', // 重做
          'bold', // 加粗
          'italic', // 斜体
          'underline', // 下划线
          'justifyleft', // 居左对齐
          'justifyright', // 居右对齐
          'justifycenter', // 居中对齐
          'justifyjustify', // 两端对齐
          'picture',
          'taobao',
          'drafts', // 从草稿箱加载
          forecolor,
          backcolor,
        ]
      ],
      autoHeightEnabled: true,
      scaleEnabled: false
    });
    ue.commands.picture = {
      execCommand: () => {
        this.props.dispatch({
          type: 'album/show',
          payload: {
            currentKey: 'editor',
          }
        });
      }
    };
    ue.commands.taobao = {
      execCommand: () => {
        this.props.dispatch({
          type: 'auction/show',
          payload: {
            currentKey: 'editor',
          }
        });
      }
    };
    ue.addListener('contentChange', this.handleChange);
    ue.addListener('ready', () => {
      setTimeout(() => {
        ue.execCommand('inserthtml', this.props.value, true);
      }, 200);
    });
    this.setState({ ue });
  }
  handleAddImg = (imgs) => {
    imgs.forEach((item) => {
      this.state.ue.execCommand('insertimage', {
        src: item.url,
        maxWidth: '60%',
        height: 'auto',
      });
    });
    // this.state.ue.execCommand('inserthtml', html);
  }
  handleAddProduct = (auction, src) => {
    const text = encodeURIComponent(JSON.stringify(auction));
    const html = `<a target="_blank" contenteditable="false" class="editor_auctions" href="${auction.item.itemUrl}" _data="${text}"><img src="${src}" /><i contenteditable="false" class="editor_auctions_details">${auction.title}</i></a>`;
    this.state.ue.execCommand('inserthtml', html, true);
  }
  handleChange = () => {
    if (this.state.ue) {
      const content = this.state.ue.getContent();
      if (this.props.onChange) this.props.onChange(content);
    }
  }
  render() {
    const { style } = this.props;
    return (
      <div style={style}>
        <div id="editor" className={styles.editor} />
        <AlbumModal k="editor" onOk={this.handleAddImg} />
        <AuctionModal k="editor" onOk={this.handleAddProduct} product={this.props.product} />
      </div>
    );
  }
}
