const getStoreToBeSaved = (store, doNotSave = []) => {
    const storeToBeSaved = { ...store };
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(store)) {
      if (doNotSave.includes(key)) {
        storeToBeSaved[key] = undefined;
      }
    }
  
    return storeToBeSaved;
  };
  
 const configurePersist = ({
    namespace = '_store_state_',
    doNotSave = [],
  } = {}) => ({
    save: (store) => (next) => (action) => {
      const result = next(action);
      const storeToBeSaved = getStoreToBeSaved(store.getState(), doNotSave);
      if (typeof localStorage === 'undefined') return result;
      localStorage.setItem(namespace, JSON.stringify(storeToBeSaved));
      return result;
    },
    load: (initialState) => ({
      ...initialState,
      ...(typeof localStorage !== 'undefined' &&
        JSON.parse(localStorage.getItem(namespace))),
    }),
  });
  export default configurePersist