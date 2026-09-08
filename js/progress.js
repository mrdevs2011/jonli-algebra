(function () {
  const KEY = "korinadigan-algebra-progress";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function write(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  window.KA = {
    readyIds: function () {
      return [];
    },
    isReady: function (id) {
      return this.readyIds().indexOf(Number(id)) !== -1;
    },
    markSeen: function (id) {
      const data = read();
      data[id] = { seen: true, at: Date.now() };
      write(data);
    },
    markDone: function (id) {
      const data = read();
      data[id] = Object.assign({}, data[id], { done: true, at: Date.now() });
      write(data);
    },
    state: function (id) {
      const data = read();
      if (data[id] && data[id].done) return "done";
      if (this.isReady(id)) return "ready";
      return "soon";
    },
    counts: function () {
      const data = read();
      const ready = this.readyIds().length;
      const done = Object.keys(data).filter(function (k) { return data[k].done; }).length;
      return { total: 38, ready: ready, done: done };
    }
  };
})();
