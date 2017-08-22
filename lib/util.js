const tools = {
  transferToUrl  : (camelName) => {
    let newName = "";
    for (let ch of camelName) {
      if (ch.charCodeAt(0) >= 65 && ch.charCodeAt(0) <= 90) {
        newName += "-" + ch.toLowerCase();
      } else {
        newName += ch;
      }
    }
    if (newName.startsWith('-')) {
      newName = newName.substr(1);
    }
    if (newName.startsWith('/-')) {
      newName = "/" + newName.substr(2);
    }
    return newName;
  },
  parseMethodName: method => {
    const verb_rules = {
      '$$'  : 'put'
      , '$' : 'post'
      , '__': 'patch'
      , '_' : 'delete'
    };

    let regx = /([\w,|]*)\s(.+)|(__|_|\$\$|\$)(.*)/ig;

    let rtn = {};
    let regxRes = regx.test(method);

    if (regxRes) {
      let method = RegExp.$1 || RegExp.$3;
      if (verb_rules.hasOwnProperty(method)) {
        rtn.method = verb_rules[method];
      } else {
        rtn.method = method;
      }
      let url = RegExp.$2.trim();
      if (!url && RegExp.$4) {
        url = tools.transferToUrl(RegExp.$4)
      }
      rtn.url = url;
    } else {
      rtn.method = "get";
      rtn.url = tools.transferToUrl(method);
    }

    if (rtn.url.indexOf(' ') > 0) {
      let nUrl = rtn.url.split(' ');
      rtn.url = nUrl[nUrl.length - 1];
      rtn.middlewares = nUrl.slice(0, -1);
    }
    rtn.method = rtn.method.toLowerCase();
    rtn.middlewares = rtn.middlewares || [];
    return rtn;
  }
};

module.exports = tools;