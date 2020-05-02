export type IsPendingState = boolean;

export const isPending = {
  state: false,
  reducers: {
    setIsPending: (state: IsPendingState, payload: boolean): IsPendingState =>
      payload
  },
  effects: () => ({})
};
