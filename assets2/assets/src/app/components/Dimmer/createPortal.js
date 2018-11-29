import ReactDOM from 'react-dom';

export default (reactElm, container) => {
  ReactDOM.unmountComponentAtNode(container);
  ReactDOM.render(reactElm, container);
};
