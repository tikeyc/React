export default () => {
  const metas = document.getElementsByTagName('meta');
  const viewport = Array.from(metas).filter(meta => meta.name === 'viewport')[0];
  return viewport.content.split(',').find(item => item.split('=')[0] === 'initial-scale').split('=')[1];
};
