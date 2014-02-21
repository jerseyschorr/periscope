
class Periscope

    isLoaded: false
    StaticKey: ''

    upScope: (opts) ->

        console.log 'upScope'
        for hosts in opts.servers
            console.log 'host?', hosts
#        @servers = serverObj
#        @$main = $('#main')

    loadServers: () ->
        console.log @isLoaded
        if @isLoaded
            
            $main.empty()
            html = ''

            console.log 'LOADING!!'
            currentServers = @servers.hosts[@DataCenter][@Environment]

            for host in currentServers
                if obj.BoxType == 'all' or host.indexOf(obj.BoxType) != -1
                    hostname = "#{host}.#{obj.Environment}.#{obj.DataCenter}.nytimes.com"
                    url = 'http://' + hostname + '?' + Math.floor(Math.random()* 10000)
                    console.log url
                    html += '<div class="servers"><h2>' + hostname + ' <i class="fa fa-refresh"></i></h2>' +
                        '<iframe src="' + url + '" width="320"  height="480" scrolling="no"></iframe></div>'
            $main.html(html)
        return

    parseUrlParams: () ->
        console.log location.href

window.Periscope = new Periscope()
###

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
###
