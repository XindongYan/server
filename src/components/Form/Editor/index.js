import React, { PureComponent } from 'react';
import {Editor, EditorState, ContentState, SelectionState, RichUtils, convertToRaw, convertFromRaw, AtomicBlockUtils, Entity, Modifier } from 'draft-js';
import { Icon, Divider, message, Affix } from 'antd';
import { connect } from 'dva';
import $ from 'jquery';
import AlbumModal from '../../AlbumModal';
import AuctionModal from '../../AuctionModal';
import SpuModal from '../../AuctionModal/SpuModal';
import BpuModal from '../../AuctionModal/BpuModal';
import ShopListModal from '../../AuctionModal/ShopListModal';
import styles from './index.less';

@connect(() => ({

}))
export default class Editors extends PureComponent {
  state = {
    editor: null,
    editorState: EditorState.createEmpty(),
    contentState: (EditorState.createEmpty()).getCurrentContent(),
    selectionState: (EditorState.createEmpty()).getSelection(),
    inlineStyleList: [],
    affix: true,
  }
  componentDidMount() {
    if (this.props.props && this.props.props.value.blocks.length > 0) {
      this.setState({ editorState: EditorState.createWithContent(convertFromRaw({entityMap: {}, ...this.props.props.value})) });
    }
    window.onscroll = () => {
      const editorOffset = $(this.refs.editorBox) ? $(this.refs.editorBox).offset().top + $(this.refs.editorBox).innerHeight() : 0;
      const offsetTop = window.pageYOffset;
      if (offsetTop > editorOffset) {
        if (this.state.affix) this.setState({ affix: false });
      } else if (offsetTop <= editorOffset) {
        if (!this.state.affix) this.setState({ affix: true });
      }
    }

  }
  componentWillReceiveProps(nextProps) {
    if (this.props.props && this.props.props.value.blocks.length > 0 && nextProps.props && (nextProps.props.value.blocks[0] !== this.props.props.value.blocks[0])) {
      this.setState({ editorState: EditorState.createWithContent(convertFromRaw({entityMap: {}, ...nextProps.props.value})) });
    }
  }
  componentWillUnmount() {
    window.onscroll = null;
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
          features: "{}",
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
  handleAddSpu = async (products) => {
    let { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'SIDEBARADDSPU',
      'IMMUTABLE',
      {
        materialId: products.materialId,
        resourceType: "Product",
        coverUrl: products.coverUrl,
        images: products.images,
        spuId: products.spuId,
        price: products.spuInfoDTO.price,
        resourceUrl: products.spuInfoDTO.spuUrl,
        rawTitle: products.title,
        title: products.title,
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
  handleAddShop = (shops) => {
    let { editorState } = this.state;
    shops.forEach((item) => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'SIDEBARADDSHOP',
        'MUTABLE',
        {
          coverUrl: 'https://gw.alicdn.com/bao/uploaded/TB1RIsiPpXXXXXpXVXXXXXXXXXX-300-300.jpg',
          id: item.shopId,
          name: "",
          reason: '',
          score: '',
          title: item.shopName ? item.shopName.split(' ')[0] : item.shopName,
          type: 'SIDEBARADDSHOP',
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
    if (key === null) return <span />;
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
          <div className={styles.zzBox}></div>
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
          <div className={styles.zzBox}></div>
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
    } else if (type === 'SIDEBARADDSHOP') {
      return (
        <div className={styles.shopBox}>
          <div className={styles.shopImgBox}>
            <img
              src={data.coverUrl}
              alt="封面图"
            />
          </div>
          <div className={styles.shopMsgBox}>
            <Icon type="shop" style={{ fontSize: 18 }}/> {data.title}
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
    } else if (key === 'alignleft' || key === 'alignCenter' || key === 'alignRight' || key === 'alignJustify') {
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
    let type = blockType;
    if (blockType === 'alignleft') {
      type = 'unstyled';
    }
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        type
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
  sidebaraddspu = (props) => {
    if (props.type === 'product') {
      this.props.dispatch({
        type: 'album/showSpu',
        payload: {
          currentKey: 'editor'
        }
      });
    } else {
      this.props.dispatch({
        type: 'auction/showBbu',
        payload: {
          currentKey: 'editor'
        }
      });
    }
  }
  sidebaraddshop = () => {
    this.props.dispatch({
      type: 'auction/showShopList',
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
        editable: false,  // 不可编辑
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
      case 'alignleft': return styles.ineditorAlignLeft;
      case 'alignCenter': return styles.ineditorAlignCenter;
      case 'alignRight': return styles.ineditorAlignRight;
      case 'alignJustify': return styles.ineditorAlignJustify;
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
  renderStyleTools = (item, index) => {
    switch (item) {
      case 'TOOLSPLITLINE': return <span key={index}>
                                    <Divider type="vertical" style={{height: 26, width: 1, margin: 0}} />
                                  </span>;
      case 'UNDO': return <span onClick={() => this.handleTools('UNDO')} key={index}>
                            <Icon type="arrow-left" />
                          </span>;
      case 'REDO': return <span onClick={() => this.handleTools('REDO')} key={index}>
                            <Icon type="arrow-right" />
                          </span>;
      case 'BOLD': return <span onClick={() => this.handleTools('BOLD')} key={index}>
                            <Icon type="bold" style={{color: this.handleShowInlinStyle('BOLD')}} />
                          </span>;
      case 'ITALIC': return <span onClick={() => this.handleTools('ITALIC')} key={index}>
                              <Icon type="italic" style={{color: this.handleShowInlinStyle('ITALIC')}} />
                            </span>;
      case 'UNDERLINE': return <span onClick={() => this.handleTools('UNDERLINE')} key={index}>
                                <Icon type="underline" style={{color: this.handleShowInlinStyle('UNDERLINE')}} />
                              </span>;
      case 'ALIGNLEFT': return <span onClick={() => this.handleTools('alignleft')} key={index}>
                                  <Icon type="align-left" style={{color: this.handleShowBlockStyle('unstyled')}} />
                                </span>;
      case 'ALIGNCENTER': return <span onClick={() => this.handleTools('alignCenter')} key={index}>
                                  <Icon type="align-center" style={{color: this.handleShowBlockStyle('alignCenter')}} />
                                </span>;
      case 'ALIGNRIGHT': return <span onClick={() => this.handleTools('alignRight')} key={index}>
                                  <Icon type="align-right" style={{color: this.handleShowBlockStyle('alignRight')}} />
                                </span>;
      case 'ALIGNJUSTIFY': return <span onClick={() => this.handleTools('alignJustify')} key={index}>
                                    <Icon type="align-justify" style={{color: this.handleShowBlockStyle('alignJustify')}} />
                                  </span>;
      default: return '';
    }
  }
  renderTools = (item, index) => {
    if (item.name) {
      switch (item.name) {
        case 'SIDEBARIMAGE': return <span onClick={this.sidebarimage} key={index}>
                                      <Icon type="picture" />
                                      图片
                                    </span>;
        case 'SIDEBARSEARCHITEM': return <span key={index} onClick={this.sidebarsearchitem}>
                                          <Icon type="shopping-cart" />
                                          宝贝
                                        </span>;
        case 'SIDEBARADDSPU': return <span key={index} onClick={() => this.sidebaraddspu(item.props)}>
                                        <Icon type="shop" />
                                        {item.props.type === 'product' ? '产品' : '标准品牌商品'}
                                      </span>;
        case 'SIDEBARADDSHOP': return <span key={index} onClick={this.sidebaraddshop}>
                                        <Icon type="shop" />
                                        店铺
                                      </span>;
        default: return '';
      }
    } else {
      switch (item) {
        case 'EXTRATOOLSPLITLINE': return <span key={index}>
                                            <Divider type="vertical" style={{height: 26, width: 1, margin: 0}} />
                                          </span>;
        default: return '';
      }
    }
  }
  render() {
    const { props } = this.props;
    const box = document.getElementsByClassName('DraftEditor-editorContainer')[0];
    if (box) {
      box.style.position = 'relative';
    }
    const editorProps = {
      blockRendererFn: this.myBlockRenderer,
      blockStyleFn: this.getBlockStyle,
      customStyleMap: this.customStyleMap,
      placeholder: this.props.props.placeholder,
    }
    const editorToolsWrap = <div ref="editorToolsWrap" onMouseDown={this.preventDefault} className={styles.editorToolsWrap}>
            <div>{props.plugins.map((item, index) => this.renderStyleTools(item, index))}</div>
            <div className={styles.toolsLine}>{props.plugins.map((item, index) => this.renderTools(item, index))}</div>
          </div>;
    return (
      <div style={{padding: '10px 20px', marginBottom: 60}}>
        { this.state.affix ?
          <Affix style={{zIndex: 1}}>
            {editorToolsWrap}
          </Affix> :
          editorToolsWrap
        }
        <div ref="editorBox" className={styles.editorBox} onClick={this.handleFocus} style={{ minHeight: 320, borderBottom: '1px solid #ccc', padding: 10 }}>
          <Editor ref={instance => {this.setState({editor: instance})}} editorState={this.state.editorState} onChange={this.handleChange} {...editorProps} />
        </div>
        <AlbumModal k="editor" onOk={this.handleAddImg} />
        <AuctionModal k="editor" onOk={this.handleAddProduct} activityId={this.props.activityId} />
        <BpuModal k="editor" onOk={this.handleAddBpu} />
        <SpuModal k="editor" onOk={this.handleAddSpu} activityId={this.props.activityId} />
        <ShopListModal k="editor" onOk={this.handleAddShop} />
      </div>
    );
  }
}
