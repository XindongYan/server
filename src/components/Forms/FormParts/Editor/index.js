import React, { PureComponent } from 'react';
import {Editor, EditorState, ContentState, SelectionState, RichUtils, convertToRaw, convertFromRaw, AtomicBlockUtils, Entity, Modifier } from 'draft-js';
import { Icon, Divider } from 'antd';
import { connect } from 'dva';
import AlbumModal from '../../../AlbumModal';
import AuctionModal from '../../../AuctionModal';
import BpuModal from '../../../AuctionModal/BpuModal.js';
import styles from './index.less';
import left from './left.png';
import center from './center.png';
import right from './right.png';
import justify from './justify.png';

@connect(() => ({

}))
export default class Editors extends PureComponent {
  state = {
    editor: null,
    editorState: EditorState.createEmpty(),
    contentState: (EditorState.createEmpty()).getCurrentContent(),
    selectionState: (EditorState.createEmpty()).getSelection(),
    inlineStyleList: [],
  }
  componentDidMount() {
    // console.log(this.props.props.value);
    if (this.props.props && this.props.props.value.blocks.length > 0) {
      this.setState({ editorState: EditorState.createWithContent(convertFromRaw(this.props.props.value)) });
    }
  }
  
  handleAddImg = (imgs) => {
    let { editorState } = this.state;
    imgs.forEach((item) => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'SIDEBARIMAGE',
        'MUTABLE',
        {
          url: item.url,
          materialId: item.materialId,
          name: '1',
          type: 'SIDEBARIMAGE',
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      editorState = AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' ',
      );
    });
    this.setState({
      editorState
    });
  }
  handleAddProduct = (auction) => {
    let { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
      'SIDEBARSEARCHITEM',
      'IMMUTABLE',
      {
        name: '',
        coverUrl: auction.coverUrl,
        images: auction.images,
        itemId: auction.item.itemId,
        materialId: auction.materialId,
        price: auction.item.finalPrice,
        resourceUrl: auction.item.itemUrl,
        title: auction.title,
        type: 'SIDEBARSEARCHITEM',
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    editorState = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' ',
    );
    this.setState({
      editorState
    });
  }
  handleAddBpu = (products) => {
    let { editorState } = this.state;
    products.forEach((item) => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'SIDEBARADDSPU',
        'IMMUTABLE',
        {
          coverUrl: item.mainPicUrl,
          features: {},
          name: "",
          spuId: item.finalBpuId,
          title: item.title,
          type: "SIDEBARADDSPU",
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      editorState = AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' ',
      );
    });
    this.setState({
      editorState
    });
  }
  customRender = (props) => {
    const key = props.block.getEntityAt(0);
    const entity = props.contentState.getEntity(key);
    const data = entity.getData();
    const type = entity.getType();
    if (type === 'SIDEBARIMAGE') {
      return (
        <div className={styles.imgBox}>
          <img
            style={{ width: '200px', height: 'auto' }}
            src={data.url}
            alt="图片"
          />
          <span className={styles.closeBox}>
            <Icon type="close-circle" onClick={() => this.removeBlock(props)} />
          </span>
        </div>
      )
    } else if (type === 'SIDEBARSEARCHITEM') {
      return (
        <div className={styles.auctionBox}>
          <div className={styles.auctionImgBox}>
            <img
              src={data.coverUrl}
              alt="封面图"
            />
          </div>
          <div className={styles.auctionMsgBox}>
            <p>{data.title}</p>
            <p>¥ {data.price}</p>
          </div>
          <span className={styles.closeBox}>
            <Icon type="close-circle" onClick={() => this.removeBlock(props)} />
          </span>
        </div>
      )
    } else if (type === 'SIDEBARADDSPU') {
      return (
        <div className={styles.bpuBox}>
          <div className={styles.bpuImgBox}>
            <img
              src={data.coverUrl}
              alt="封面图"
            />
          </div>
          <div className={styles.bpuMsgBox}>
            {data.title}
          </div>
          <span className={styles.closeBox}>
            <Icon type="close-circle" onClick={() => this.removeBlock(props)} />
          </span>
        </div>
      )
    }
  }
  handleChange = (editorState) => {
    this.getInlineStyleList(editorState);
    this.setState({
      editorState,
    });
    if (this.props.onChange) this.props.onChange(convertToRaw(editorState.getCurrentContent()));
  }
  getInlineStyleList = (editorState) => {
    const inlineStyleList = [];
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentBlock = contentState.getBlockForKey(selectionState.focusKey);
    const blockStyle = contentBlock.getType();
    const inlineStyle = contentBlock.getInlineStyleAt(selectionState.anchorOffset);
    const inlineStyleBefor = contentBlock.getInlineStyleAt(selectionState.anchorOffset - 1);
    inlineStyle.forEach(item => inlineStyleList.push(item));
    inlineStyleBefor.forEach(item => inlineStyleList.push(item));
    this.setState({
      contentState,
      selectionState,
      inlineStyleList,
      blockStyle,
    });
  }
  handleTools = (key) => {
    const { inlineStyleList } = this.state;
    const index = inlineStyleList.findIndex(item => item === key);
    let newInlineStyleList = [...inlineStyleList];
    if (index >= 0) {
      newInlineStyleList.splice(index, 1);
    } else {
      newInlineStyleList.push(key);
    }
    if (key === 'UNDO') {
      this.handleChange(EditorState.undo(this.state.editorState));
    } else if (key === 'REDO') {
      this.handleChange(EditorState.redo(this.state.editorState));
    } else if (key === 'BOLD' || key === 'ITALIC' || key === 'UNDERLINE') {
      this.toggleInlineStyle(key);
    } else if (key === 'ALIGNLEFT' || key === 'ALIGNCENTER' || key === 'ALIGNRIGHT' || key === 'ALIGNJUSTIFY') {
      this.toggleBlockType(key);
    }
    this.setState({
      inlineStyleList: newInlineStyleList,
    });
  }
  toggleInlineStyle(inlineStyle) {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  toggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }
  sidebarimage = () => {
    this.props.dispatch({
      type: 'album/show',
      payload: {
        currentKey: 'editor',
      }
    });
  }
  sidebarsearchitem = () => {
    this.props.dispatch({
      type: 'auction/show',
      payload: {
        currentKey: 'editor',
      }
    });
  }
  sidebaraddspu = () => {
    this.props.dispatch({
      type: 'auction/showBbu',
      payload: {
        currentKey: 'editor'
      }
    });
  }
    
  removeBlock = (props) => {
    let nextContentState, nextEditorState;
    const blockKey = props.block.getKey();
    const contentState = this.state.editorState.getCurrentContent();
    nextContentState = Modifier.removeRange(contentState, new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: props.block.getLength(),
    }), 'backward');
    nextContentState = Modifier.setBlockType(nextContentState, nextContentState.getSelectionAfter(), 'unstyled');
    nextEditorState = EditorState.push(this.state.editorState, nextContentState, 'remove-range');
    nextEditorState = EditorState.forceSelection(nextEditorState, nextContentState.getSelectionAfter());
    this.handleChange(nextEditorState);
  }
  myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: this.customRender,  // 指定组件
        editable: false,  // 这里设置自定义的组件可不可以编辑，因为是图片，这里选择不可编辑
      };
    }
  }
  customStyleMap = (block) => {
    const blockKey = block.getKey()
    const a = this.triggerChange(EditorState.forceSelection(this.editorState, new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: block.getLength()
    })));
  }

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'ALIGNLEFT': return styles.ineditorAlignLeft;
      case 'ALIGNCENTER': return styles.ineditorAlignCenter;
      case 'ALIGNRIGHT': return styles.ineditorAlignRight;
      case 'ALIGNJUSTIFY': return styles.ineditorAlignJustify;
      default: return null;
    }
  }
  handleGetEditor = () => {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
  }
  handleFocus = () => {
    this.state.editor.focus();
  }
  preventDefault = (e) => {
    e.preventDefault();
  }
  handleShowInlinStyle = (key) => {
    const { inlineStyleList } = this.state;
    return inlineStyleList.findIndex(item => item === key) >= 0 ? '#6af' : '';
  }
  handleShowBlockStyle = (key) => {
    const { blockStyle } = this.state;
    return blockStyle === key ? '#6af' : '';
  }
  render() {
    setTimeout(() => {
      const placeholderDiv = document.getElementsByClassName('public-DraftEditorPlaceholder-root')[0];
      if (placeholderDiv) {
        placeholderDiv.style.position = 'absolute';
      }
    }, 5);
    const editorProps = {
      blockRendererFn: this.myBlockRenderer,
      blockStyleFn: this.getBlockStyle,
      customStyleMap: this.customStyleMap,
      placeholder: this.props.props.placeholder,
    }
    const toolList = ['UNDO', 'REDO', 'BOLD', 'ITALIC', 'UNDERLINE', 'ALIGNLEFT', 'ALIGNCENTER', 'ALIGNRIGHT', 'ALIGNJUSTIFY', 'a'];
    const menu = ['SIDEBARIMAGE', 'SIDEBARSEARCHITEM', 'SIDEBARADDSPU'];
    const tools = {
      TOOLSPLITLINE: <span key="TOOLSPLITLINE">
                      <Divider type="vertical" />
                    </span>,
      UNDO: <span onClick={() => this.handleTools('UNDO')} key="UNDO">
              <Icon type="arrow-left" />
            </span>,
      REDO: <span onClick={() => this.handleTools('REDO')} key="REDO">
              <Icon type="arrow-right" />
            </span>,
      BOLD: <span onClick={() => this.handleTools('BOLD')} key="BOLD">
              <Icon type="bold" style={{color: this.handleShowInlinStyle('BOLD')}} />
            </span>,
      ITALIC: <span onClick={() => this.handleTools('ITALIC')} key="ITALIC">
              <Icon type="italic" style={{color: this.handleShowInlinStyle('ITALIC')}} />
            </span>,
      UNDERLINE: <span onClick={() => this.handleTools('UNDERLINE')} key="UNDERLINE">
                  <Icon type="underline" style={{color: this.handleShowInlinStyle('UNDERLINE')}} />
                </span>,
      ALIGNLEFT: <span onClick={() => this.handleTools('ALIGNLEFT')} key="ALIGNLEFT">
                    <Icon type="align-left" style={{color: this.handleShowBlockStyle('ALIGNLEFT')}} />
                  </span>,
      ALIGNCENTER: <span onClick={() => this.handleTools('ALIGNCENTER')} key="ALIGNCENTER">
                      <Icon type="align-center" style={{color: this.handleShowBlockStyle('ALIGNCENTER')}} />
                    </span>,
      ALIGNRIGHT: <span onClick={() => this.handleTools('ALIGNRIGHT')} key="ALIGNRIGHT">
                    <Icon type="align-right" style={{color: this.handleShowBlockStyle('ALIGNRIGHT')}} />
                  </span>,
      ALIGNJUSTIFY: <span onClick={() => this.handleTools('ALIGNJUSTIFY')} key="ALIGNJUSTIFY">
                      <Icon type="align-justify" style={{color: this.handleShowBlockStyle('ALIGNJUSTIFY')}} />
                    </span>,
      SIDEBARIMAGE: <span onClick={this.sidebarimage} key="SIDEBARIMAGE">
                      <Icon type="picture" />
                      图片
                    </span>,
      SIDEBARSEARCHITEM: <span key="SIDEBARSEARCHITEM" onClick={this.sidebarsearchitem}>
                          <Icon type="shopping-cart" />
                          商品
                        </span>,
      SIDEBARADDSPU: <span key="SIDEBARADDSPU" onClick={this.sidebaraddspu}>
                      <Icon type="shop" />
                      标准品牌商品
                    </span>,
      a: <span key="a" onClick={this.handleGetEditor}>
          获取
        </span>,
    };
    
    return (
      <div style={{marginBottom: 60}}>
        <div onMouseDown={this.preventDefault} className={styles.editorToolsWrap}>
          <div>{toolList.map(item => tools[item])}</div>
          <div>{menu.map(item => tools[item])}</div>
        </div>
        <div onClick={this.handleFocus} style={{ minHeight: 320, borderBottom: '1px solid #ccc', padding: 10 }}>
          <Editor ref={instance => {this.setState({editor: instance})}} editorState={this.state.editorState} onChange={this.handleChange} {...editorProps} />
        </div>
        <AlbumModal k="editor" onOk={this.handleAddImg} />
        <AuctionModal k="editor" onOk={this.handleAddProduct} product={this.props.product} />
        <BpuModal k="editor" onOk={this.handleAddBpu} />
      </div>
    );
  }
}
