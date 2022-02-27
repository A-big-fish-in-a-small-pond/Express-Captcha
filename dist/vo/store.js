function Store() {
    this.store = new Map();
}

Store.prototype.set = function (key, value) {
    this.store.set(key, value);
};

Store.prototype.get = function (key) {
    return this.store.get(key);
};

Store.prototype.has = function (key) {
    return this.store.has(key);
};

Store.prototype.delete = function (key) {
    return this.store.delete(key);
};

module.exports.DefaultStore = Store;
