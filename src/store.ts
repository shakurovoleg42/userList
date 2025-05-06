export type Listener = () => void;

export type Reducer<State, Action> = (state: State, action: Action) => State;

export function createStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State
) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = (): State => state;

  const dispatch = (action: Action): void => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  return { getState, dispatch, subscribe };
}
