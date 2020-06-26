import { createStore } from 'redux';
import { reducer } from './goalGameRedux.js';

const store = createStore( reducer );

export default store;