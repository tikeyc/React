import createActions from 'createActions';

export const {
  TOGGLE_ASIDE,
  toggleAside,
} = createActions({
  TOGGLE_ASIDE: () => {},
}, 'LAYOUT');
