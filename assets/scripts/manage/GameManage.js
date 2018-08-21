const global = require("../global");

let res = [
    {url: './config/description_config', type: 'json'},
    {url: './config/level_config', type: 'json'},
    {url: './config/monster_config', type: 'json'},
    {url: './config/reward_config', type: 'json'},
    {url: './config/tower_config', type: 'json'},
];

function load(progress, finished) {
    cc.loader.load(res, progress, finished);
}

module.exports = {
    load: load,
};
