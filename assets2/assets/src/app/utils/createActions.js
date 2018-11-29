/**
 * 动态创建 action 构造器
 * @param  {Object} creators action 构造器配置
 * @param  {String} prefix   action 前缀
 * @return {Object}          action 构造器
 */
export default (creators, prefix) => (
  Object.keys(creators).reduce((object, type) => {
    const aCreators = object;
    let acType = type.split('/');
    const constType = acType[acType.length - 1];

    // 创建动作构造器名称，
    // 通过将下划线式命名转成驼峰式命名来实现
    acType = constType
      .toLowerCase()
      .replace(
        /_([a-z])/ig,
        (match, subMatch) => subMatch.toUpperCase()
      );

    aCreators[acType] = (...args) => {
      const action = creators[type](...args);
      if (typeof action === 'function') {
        return action;
      }

      const nextType = prefix ? `${prefix}/${type}` : type;
      // if (action.type) {
      //   nextType = type;
      //   if (prefix) {
      //     nextType = action.type.map(t => `${prefix}/${t}`);
      //   }
      // }

      return {
        ...action,
        type: nextType,
      };
    };

    aCreators[constType] = prefix ? `${prefix}/${constType}` : constType;

    return aCreators;
  }, {})
);
