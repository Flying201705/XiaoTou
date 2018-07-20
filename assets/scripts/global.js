import EventListener from './event-listener'

var _pause = false;
let global = {
    loadRes: false,
    currentLevel: 1,
    userInfo: null,
    event: EventListener({}),
    pause: () => {
        _pause = true;
    },
    resume: () => {
        _pause = false;
    },
    isPause: () => {
        return _pause;
    },

};

export default global;