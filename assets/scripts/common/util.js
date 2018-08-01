module.exports = {
    isEmpty: isEmpty
};

function isEmpty(val) {
    return val === undefined || val === null || val === ''
}