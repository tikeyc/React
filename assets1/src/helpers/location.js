import { parse } from 'querystring';

export function deletePropeties(obj, deletedKeys) {
  const newObj = Object.assign({}, obj);

  deletedKeys.forEach(key => {
    delete newObj[key];
  });

  return newObj;
}

export function parsePath(qs) {
  const [pathname, query] = qs.split('?');
  return {
    pathname,
    query: parse(query),
  };
}

/**
 * 转换选车型或型号后要跳转的页面路径
 * 有两种类型：1、pathname/:id       (id为路径参数，如：http://ways.com/123)
 *             2、pathname?idName=id (id为查询字符串参数，如：http://ways.com?id=123)
 * @param  {string} id     车型或型号id
 * @param  {string} page   页面路径
 * @param  {string} idName id名称
 * @return {object}        路由路径对象
 */
export function parseToPage(id, page, idName) {
  const reg = new RegExp(`:${idName}($|\/)`, 'ig');
  const paths = page.split('?');
  const query = parse(paths[1]);
  let pathname = paths[0];

  if (reg.test(pathname)) {
    pathname = pathname.replace(reg, id);
  } else {
    query[idName] = id;
  }
  console.log({ pathname, query });
  return {
    pathname,
    query,
  };
}

export function parseModelToPageL(val, toPage) {
  const pathname = toPage;
  const query = { ...val };
  return {
    pathname,
    query,
  };
}

export function parseModelToPage(id, page) {
  return parseToPage(id, page, 'modelId');
}

export function parseVersionToPage(id, page) {
  return parseToPage(id, page, 'versionId');
}
