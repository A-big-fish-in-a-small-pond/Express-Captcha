function Session() {
    this.store = null;
}

Session.prototype.setStore = function (store) {
    this.store = store;
};

Session.prototype.setSession = function (key, value) {
    this.store.set(key, value);
};

Session.prototype.getSession = function (key) {
    return this.store.get(key);
};

Session.prototype.exsistsSession = function (key) {
    return this.store.has(key);
};

Session.prototype.deleteSession = function (key) {
    return this.store.delete(key);
};

module.exports.Session = Session;
