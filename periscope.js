var Periscope = {
  isLoaded: false,
  StaticKey: '',
  upScope: function(opts) {

    var hosts, _i, _len, _results;
    _ref = opts;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hosts = _ref[_i];
      _results.push(console.log(hosts));
    }
    return _results;
  },
  
  loadServers: function() {
    var currentServers, host, hostname, html, url, _i, _len;
    console.log(this.isLoaded);
    if (this.isLoaded) {
      $main.empty();
      html = '';
      console.log('LOADING!!');
      currentServers = this.servers.hosts[this.DataCenter][this.Environment];
      for (_i = 0, _len = currentServers.length; _i < _len; _i++) {
        host = currentServers[_i];
        if (obj.BoxType === 'all' || host.indexOf(obj.BoxType) !== -1) {
          hostname = "" + host + "." + obj.Environment + "." + obj.DataCenter + ".nytimes.com";
          url = 'http://' + hostname + '?' + Math.floor(Math.random() * 10000);
          console.log(url);
          html += '<div class="servers"><h2>' + hostname + ' <i class="fa fa-refresh"></i></h2>' + '<iframe src="' + url + '" width="320"  height="480" scrolling="yes" style=" overflow-x:hidden; overflow-y:scroll;"></iframe></div>';
        }
      }
      $main.html(html);
    }
  }
};

console.log('>>>>', Periscope);

/*

periscope = new Periscope(servers)
gui = new dat.GUI()

for x, y of servers.keys
    gui.add periscope, x, y


dcController = gui.add periscope, 'Data Center', ['ewr1', 'sea1']
bxController = gui.add periscope, 'Box Type', ['fe', 'varnish', 'all']
#staticKeyCtrl = gui.add text, 'StaticKey'

envController.onChange () ->
    loadServers(periscope)

dcController.onChange () ->
    loadServers(text)

bxController.onChange () ->
    loadServers(text)

#staticKeyCtrl.onFinalChange () ->
#    loadServers(text)


text.isLoaded = true
loadServers(text)
*/
