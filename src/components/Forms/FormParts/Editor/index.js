import React, { PureComponent } from 'react';
import {Editor, EditorState, ContentState, SelectionState, RichUtils, convertToRaw, convertFromRaw, AtomicBlockUtils, Entity, Modifier } from 'draft-js';
import { Icon } from 'antd';
import { connect } from 'dva';
import AlbumModal from '../../../AlbumModal';
import AuctionModal from '../../../AuctionModal';
import BpuModal from '../../../AuctionModal/BpuModal.js';
import styles from './index.less';

@connect(() => ({

}))
export default class Editors extends PureComponent {
  state = {
    editorState: EditorState.createEmpty(),
  }
  componentDidMount() {
    console.log(this.props.props.value);
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
      console.log(item);
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
    // console.log(convertToRaw(editorState.getCurrentContent()));
    this.setState({editorState});
    if (this.props.onChange) this.props.onChange(convertToRaw(editorState.getCurrentContent()));
  }
  undo = () => {
    this.handleChange(EditorState.undo(this.state.editorState));
  }
  redo = () => {
    this.handleChange(EditorState.redo(this.state.editorState));
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
  handleGetEditor = () => {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
  }
  render() {
    const { style } = this.props;
    const toolList = ['UNDO', 'REDO', 'SIDEBARIMAGE', 'SIDEBARSEARCHITEM', 'SIDEBARADDSPU', 'a'];
    const tools = {
      UNDO: <span onClick={this.undo} key="UNDO">
              <Icon type="arrow-left" />
            </span>,
      REDO: <span onClick={this.redo} key="REDO">
              <Icon type="arrow-right" />
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
      <div style={style}>
        <div className={styles.editorToolsWrap}>
          {toolList.map(item => tools[item])}
        </div>
        <div style={{ minHeight: 320, borderBottom: '1px solid #ccc', padding: 10 }}>
          <Editor editorState={this.state.editorState} onChange={this.handleChange} blockRendererFn={this.myBlockRenderer} />
        </div>
        <AlbumModal k="editor" onOk={this.handleAddImg} />
        <AuctionModal k="editor" onOk={this.handleAddProduct} product={this.props.product} />
        <BpuModal k="editor" onOk={this.handleAddBpu} />
      </div>
    );
  }
}
