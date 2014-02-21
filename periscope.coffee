
class Periscope

    isLoaded: false
    StaticKey: ''
    servers = {}

    upScope: (opts) ->

        @$main = $('#main')
        @servers = opts.servers
        @keys = opts.keys

        # Check url params here
        request = opts.defaults
        urlparams = @parseUrlParams()

        for param, idx in @keys
            if urlparams[param] then request[idx] = urlparams[param]

        @loadServers(request)


    loadServers: (dataArry) ->
            
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

    stripTrailingSlash: (str) ->
        if str?.substr(-1) == '/'
            return str.substr(0, str.length - 1)
        return str

    parseUrlParams: () ->
        # get the current page url
        $url = $.url()

        {
          "DataCenter": @stripTrailingSlash($url.param('dc'))
          "Environment": @stripTrailingSlash($url.param('env'))
          "BoxType": @stripTrailingSlash($url.param('box'))
        }

window.Periscope = new Periscope()

