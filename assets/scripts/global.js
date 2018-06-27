import EventListener from './event-listener'

let global = {
    loadRes: false,
    currentLevel: 1,
    userInfo: null,
    event: EventListener({}),
};

window.global = global;

export default global;