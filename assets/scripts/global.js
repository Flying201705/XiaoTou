import EventListener from './event-listener'

let _pause = false;
let global = {
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

module.exports = global;