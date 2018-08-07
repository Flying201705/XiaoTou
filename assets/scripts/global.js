import EventListener from './event-listener'

 /**
  * 暂停优先级，数字越大，优先级越高
  * 当高数值在暂停时，使用低数值恢复无法恢复游戏
  */
const PauseState = {
    NoPause: 0x00,
    DefaultPause: 0x01,
    ButtonPause: 0x02
};

let _pause = PauseState.NoPause;

let global = {
    currentLevel: 1,
    userInfo: null,
    event: EventListener({}),
    pauseState: PauseState,
    pause: (ps) => {
        if (ps) {
            if (ps > _pause) {
                _pause = ps;
            }
        } else if (_pause < PauseState.DefaultPause) {
            _pause = PauseState.DefaultPause;
        }
    },
    resume: (ps) => {
        if (ps) {
            if (ps >= _pause) {
                _pause = PauseState.NoPause;
            }
        } else if (_pause === PauseState.DefaultPause) {
            _pause = PauseState.NoPause;
        }
    },
    isPause: () => {
        return _pause !== PauseState.NoPause;
    },
};

module.exports = global;