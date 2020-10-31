export default function reducer(state, action) {
  switch(action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
}
