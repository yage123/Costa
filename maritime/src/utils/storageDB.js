let storage = {
  getItem(key) {
    if (window.localStorage) {
      let data = window.localStorage.getItem("ISHOP_" + key);
      try {
        if (data) {
          data = JSON.parse(data);
        }
      } catch (e) {
        data = null;
      }
      return data;
    }
  },
  setItem(key, value) {
    if (typeof value == "object") value = JSON.stringify(value);

    if (window.localStorage) {
      window.localStorage.setItem("ISHOP_" + key, value);
    }
  },
  removeItem(key) {
    if (window.localStorage) {
      window.localStorage.removeItem("ISHOP_" + key);
    }
  }
};

export default storage;
