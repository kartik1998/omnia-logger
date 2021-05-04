require = require('esm')(module);
const asyncHooks = require('async_hooks');
const { v4 } = require('uuid');
const store = new Map();

const asyncHook = asyncHooks.createHook({
    init: (asyncId, _, triggerAsyncId) => {
        if (store.has(triggerAsyncId)) {
            store.set(asyncId, store.get(triggerAsyncId))
        }
    },
    destroy: (asyncId) => {
        if (store.has(asyncId)) {
            store.delete(asyncId);
        }
    }
});

asyncHook.enable();

const createRequestContext = (data, requestId = v4()) => {
    const requestInfo = { requestId, data };
    store.set(asyncHooks.executionAsyncId(), requestInfo);
    return requestInfo;
};

const getRequestContext = () => {
    return store.get(asyncHooks.executionAsyncId());
};

module.exports = { createRequestContext, getRequestContext };