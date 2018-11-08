export const withUser = action => (dispatch, getState) => {
  const { user } = getState();
  dispatch(action(user));
};

export const withRole = action => (dispatch, getState) => {
  const { user } = getState();
  dispatch(action(user.userRole));
};
