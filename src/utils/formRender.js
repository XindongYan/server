export function async(children, activityId) {
  const coverCount = children.find(item => item.name === 'coverCount');
  const standardCoverUrl = children.find(item => item.name === 'standardCoverUrl');
  const itemSpuOption = children.find(item => item.name === 'itemSpuOption');
  const shopStoryContentType = children.find(item => item.name === 'shopStoryContentType');
  const shopStoryKeeperDescription = children.find(item => item.name === 'shopStoryKeeperDescription');
  const shopStoryKeeperId = children.find(item => item.name === 'shopStoryKeeperId');
  const tempChildren = [...children];
  if (coverCount && standardCoverUrl) {
    const standardCoverUrlIndex = tempChildren.findIndex(item => item.name === standardCoverUrl.name);
    if (Number(coverCount.props.value) === 1) {
      tempChildren[standardCoverUrlIndex] = {
      "component": "CreatorAddImage",
      "label": "",
      "name": "standardCoverUrl",
      "props": {
        "pixFilter": "750x422",
        "min": 1,
        "max": 1,
        "label": "",
        "uploadTips": "上传封面",
        "value": tempChildren[standardCoverUrlIndex].props.value,
        "tips": "请上传尺寸不小于750*422px的封面图，优质清晰的封面有利于推荐，请勿使用gif或带大量文字的图片",
        "ShowPlaceholderTrigger": true
      },
      "rules": [{
        "min": 1,
        "type": "array",
        "message": "至少要有1个"
      }, {
        "max": 1,
        "type": "array",
        "message": "最多允许1个"
      }],
      "tips": "请上传尺寸不小于750*422px的封面图，优质清晰的封面有利于推荐，请勿使用gif或带大量文字的图片"
    };
    } else if (Number(coverCount.props.value) === 3) {
      tempChildren[standardCoverUrlIndex] = {
        "component": "CreatorAddImage",
        "label": "",
        "name": "standardCoverUrl",
        "props": {
          "pixFilter": "750x422",
          "min": 3,
          "max": 3,
          "label": "",
          "uploadTips": "上传封面",
          "value": tempChildren[standardCoverUrlIndex].props.value,
          "tips": "请上传尺寸不小于750*422px的封面图，优质清晰的封面有利于推荐，请勿使用gif或带大量文字的图片",
          "ShowPlaceholderTrigger": true
        },
        "rules": [{
          "min": 3,
          "type": "array",
          "message": "至少要有3个"
        }, {
          "max": 3,
          "type": "array",
          "message": "最多允许3个"
        }],
        "tips": "请上传尺寸不小于750*422px的封面图，优质清晰的封面有利于推荐，请勿使用gif或带大量文字的图片"
      };
    }
  }
  if (itemSpuOption && itemSpuOption.props.value === 'spu') {
    const bodySpuIndex = tempChildren.findIndex(item => item.name === 'bodySpu');
    tempChildren[bodySpuIndex] = {
      "className": "creator-single-item-center creator-no-label",
      "component": "CreatorAddSpu",
      "label": "商品SPU",
      "name": "bodySpu",
      "props": {
        "enableExtraBanner": true,
        "activityId": activityId,
        "min": 1,
        "max": 1,
        "addImageProps": {
          "pixFilter": "500x500"
        },
        "triggerTips": "添加一个产品",
        "className": "creator-single-item-center creator-no-label",
        "label": "商品SPU",
        "value": []
      },
      "rules": [{
        "min": 1,
        "type": "array",
        "message": "或上传1个产品"
      }, {
        "max": 1,
        "type": "array",
        "message": "最多允许1个"
      }],
      "updateOnChange": "true"
    };
  }
  if (shopStoryContentType && (shopStoryContentType.props.value === 'people' || shopStoryContentType.props.value === 'designer')) {
    if (!shopStoryKeeperDescription) {
      tempChildren.push({
        "component": "Input",
        "label": "店主一句话介绍",
        "name": "shopStoryKeeperDescription",
        "props": {
          "label": "店主一句话介绍",
          "placeholder": "请输入9-15字的店主一句话介绍",
          "value": "",
          "tips": "请输入9-15字的店主一句话介绍",
          "cutString": false,
          "maxLength": 15,
          "hasLimitHint": true
        },
        "rules": [{
          "min": 9,
          "type": "string",
          "message": "文字长度太短, 要求长度最少为9"
        }, {
          "max": 15,
          "type": "string",
          "message": "文字长度太长, 要求长度最多为15"
        }],
        "tips": "请输入9-15字的店主一句话介绍"
      });
    }
    if (!shopStoryKeeperId) {
      tempChildren.push({
        "component": "Input",
        "label": "店主身份",
        "name": "shopStoryKeeperId",
        "props": {
          "label": "店主身份",
          "placeholder": "请输入3-12字的店主身份",
          "value": "",
          "tips": "请输入3-12字的店主身份",
          "cutString": false,
          "maxLength": 12,
          "hasLimitHint": true
        },
        "rules": [{
          "min": 3,
          "type": "string",
          "message": "文字长度太短, 要求长度最少为3"
        }, {
          "max": 12,
          "type": "string",
          "message": "文字长度太长, 要求长度最多为12"
        }],
        "tips": "请输入3-12字的店主身份"
      });
    }
  } else if (shopStoryContentType && shopStoryContentType.props.value === 'shop') {
    if (shopStoryKeeperDescription) {
      const shopStoryKeeperDescriptionIndex = tempChildren.findIndex(item => item.name === shopStoryKeeperDescription.name);
      tempChildren.splice(shopStoryKeeperDescriptionIndex, 1);
    }
    if (shopStoryKeeperId) {
      const shopStoryKeeperIdIndex = tempChildren.findIndex(item => item.name === shopStoryKeeperId.name);
      tempChildren.splice(shopStoryKeeperIdIndex, 1);
    }
  }
  return tempChildren;
}
