export const error = {
  state: { status: null, statusText: null, message: null },
  reducers: {
    clearError: (state, payload) => ({
      ...state,
      status: null,
      statusText: null,
      message: null
    })
  },
  effects: dispatch => ({})
};
