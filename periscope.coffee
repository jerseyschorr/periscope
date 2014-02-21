
class Periscope

    isLoaded: false
    StaticKey: ''
    servers = {}

    upScope: (opts) ->

        @$main = $('#main')
        @servers = opts.servers

        # Check url params here
        @keys = opts.keys

        console.log opts
        @loadServers(opts.defaults)

        # setup


    loadServers: (dataArry) ->
        console.log dataArry
            
        @$main.empty()
        html = ''

        console.log 'LOADING!!'

        currentServers = @servers
        domainstr = false
        while dataArry.length > 1
            h = dataArry.shift()
            console.log h
            if domainstr is false
                domainstr = h
            else
                domainstr = "#{h}.#{domainstr}"  
            currentServers = currentServers[h]


        for host in currentServers
            if host.indexOf(dataArry[0]) != -1
                hostname = "#{host}.#{domainstr}"
                url = 'http://' + hostname
                console.log url
                html += '<div class="servers"><h2>' + hostname + ' <i class="fa fa-refresh"></i></h2>' +
                    '<iframe src="' + url + '" width="320"  height="480" scrolling="no"></iframe></div>'
        @$main.html(html)
        return


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
