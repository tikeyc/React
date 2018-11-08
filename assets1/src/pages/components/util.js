export const getArticleFilterParams = filters => filters.reduce((values, { key, options }) => {
  values[key] = String(options.filter(({ checked }) => checked).map(({ value }) => value).join(','));
  return values;
}, {});

export const getArticleFilterParams2 = filters => filters.reduce((values, { key, options }) => {
  values[key] = String(options.filter(({ checked }) => checked).map(({ value }) => value).join(','));
  return values;
}, {});
