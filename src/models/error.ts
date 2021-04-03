export type ErrorState = {
  showError: boolean;
  status: number | null;
  statusText: string | null;
  message: string | null;
};

export const error = {
  state: { showError: false, status: null, statusText: null, message: null },
  reducers: {
    setError: (state: ErrorState, payload: any): ErrorState => ({
      ...state,
      showError: true,
      status: payload.status,
      statusText: payload.statusText,
      message: payload.message
    }),
    clearError: (state: ErrorState): ErrorState => ({
      ...state,
      showError: false,
      status: null,
      statusText: null,
      message: null
    })
  },
  effects: () => ({})
};
