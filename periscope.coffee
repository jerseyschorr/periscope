
class Periscope

    isLoaded: false
    StaticKey: ''
    servers = {}

    upScope: (opts) ->

        @$main = $('#main')
        @servers = opts.servers
        @keys = opts.keys
        @regexOverride = opts.listOverride

        # Check url params here
        request = opts.defaults
        urlparams = @parseUrlParams(opts.keys)
        @link = @parseUrlParams(['link'])?.link 
        if @link then $('#deeplink').val(@link)

        $('#home').attr("href", location.href.split("?")[0])

        $('#home').click (e) =>
            location.href = $('#home').attr("href")

        $('#linkcompare').click (e) =>
            e.preventDefault()

        $('#comparesubmit').click (e) =>
            e.preventDefault()
            location.href = location.href.split("?")[0] + "?comparelink1=" + $("#comparelink1").val() + "&comparelink2=" + $("#comparelink2").val()

        $('#linksubmit').click (e) =>
            e.preventDefault()
            urlVal = $('#deeplink').val()
            if urlVal
                deepLink = $.url(urlVal).attr('path')
                $url = $.url()
                url = $url.attr('source')
                attrName = 'link'
                currentAttr = $url.param(attrName)
                if url.indexOf(attrName) != -1
                    url = url.replace("#{attrName}=#{currentAttr}", "#{attrName}=#{deepLink}")
                else
                    if url.indexOf('?') != -1 then url += "&" else url += '?'
                    url += "#{attrName}=#{deepLink}"
                location.href = url


        for param, idx in @keys
            if urlparams[param] then request[idx] = urlparams[param]

        @updateNavBar(request)
        if @isCompareMode()
            @compareServers()
        else
            @loadServers(request)

    updateNavBar: (dataArry) ->

        nb = $('#nav-bar')
        out = []
        currentServers = @servers

        for key, idx in @keys
            h = @confirmHost(currentServers, dataArry[idx])
            if @regexOverride[key]?[dataArry[idx]]
                h = dataArry[idx]

            out.push '<li class="dropdown">',
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown">', key , ': <b>', h, '</b><b class="caret"></b></a>',
                '<ul class="dropdown-menu">'

            if @regexOverride[@keys[idx]]
                for cidx, child of Object.keys(@regexOverride[key])
                    if child != h then out.push '<li><a href="#" data-env="', key, '">', child, '</a></li>'
            else
                for child of currentServers
                    out.push '<li><a href="#" data-env="', key, '">', child, '</a></li>'
            out.push '</ul></li>'
            if idx < @keys.length - 1
                currentServers = currentServers[h]
        nb.append(out.join(''))

        $( "a" ).click (e) =>
            e.preventDefault()
            attrName = $(e.currentTarget).attr('data-env')
            if attrName?
                attrVal  = $(e.currentTarget).html()
                if @keys.indexOf(attrName) != -1
                    $url = $.url()
                    url = $url.attr('source')
                    currentAttr = $url.param(attrName)
                    if url.indexOf(attrName) != -1
                        url = url.replace("#{attrName}=#{currentAttr}", "#{attrName}=#{attrVal}")
                    else
                        if url.indexOf('?') != -1 then url += "&" else url += '?'
                        url += "#{attrName}=#{attrVal}"
                    location.href = @removeCompareString(url)

        return

    removeCompareString: (url) ->
        paramsToRemove = ['comparelink1','comparelink2']
        
        # Hack for now, find a better way to do this
        if url.match(paramsToRemove[0])
            for p in paramsToRemove
                url = url.replace(p+"="+$.url().param(p),'')
            url = url.replace("?&&","?")
        else
          return url
        return url
            
    confirmHost: (obj, key) ->

        keys = Object.keys(obj)
        return key if keys.indexOf(key) != -1
        return keys[0] if keys.length > 0
        return false

    compareServers: () ->
        @$main.empty()
        $url = $.url()
        linksToCompare = ['comparelink1','comparelink2']
        html = '<div class="alert alert-danger fade in" id="close-compare-mode">Compare Mode <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
</div>'
        for l in linksToCompare
            html += '<div class="servers"><h2>' + $.url().param(l)
            html += ' <i class="fa fa-refresh pointer"></i></h2>' +
                '<iframe src="' + $.url().param(l) + '" width="320"  height="480" class="iframe"></iframe></div>'
        @$main.html(html)
        $('#close-compare-mode').bind 'closed.bs.alert', () ->
             location.href = location.href.split("?")[0]

        $refreshButtons = $('.fa-refresh')
        for button in $refreshButtons
            $( button ).click (e) =>
                $(e.currentTarget).addClass('fa-spin')
                $iframe = $(e.currentTarget).parent().parent().find('iframe')
                $iframe.attr('src', $iframe.attr('src'))
                setTimeout () ->
                    $(e.currentTarget).removeClass('fa-spin')
                ,1000
        return        
        
    loadServers: (dataArry) ->
        @$main.empty()
        html = if @link then '<div class="container">Page: ' + @link + '</div>' else ''

        currentServers = @servers
        domainstr = false
        keyIdx = 0
        while dataArry.length
            h = dataArry.shift()
            if @regexOverride[@keys[keyIdx]]
                hostList = []
                for host in currentServers
                    hostList.push(host) if @regexOverride[@keys[keyIdx]][h].exec(host)
                currentServers = hostList
            else
                h = @confirmHost(currentServers, h)

                if domainstr is false
                    domainstr = h
                else
                    domainstr = h + '.' + domainstr

                currentServers = currentServers[h]
            keyIdx++

        for host in currentServers
            hostname = "#{host}.#{domainstr}"
            url = 'http://' + hostname
            if @link then url = url + @link
            html += '<div class="servers"><h2>' + hostname
            html += ' <i class="fa fa-refresh pointer"></i></h2>' +
                '<iframe src="' + url + '" width="320"  height="480" class="iframe"></iframe></div>'
        @$main.html(html)
        $refreshButtons = $('.fa-refresh')
        for button in $refreshButtons
            $( button ).click (e) =>
                $(e.currentTarget).addClass('fa-spin')
                $iframe = $(e.currentTarget).parent().parent().find('iframe')
                $iframe.attr('src', $iframe.attr('src'))
                setTimeout () ->
                    $(e.currentTarget).removeClass('fa-spin')
                ,1000
        return

    stripTrailingSlash: (str) ->
        if str?.substr(-1) == '/'
            return str.substr(0, str.length - 1)
        return str

    isCompareMode: () ->
        if $.url().param('comparelink1')
            return true
    parseUrlParams: (keys) ->
        # get the current page url
        $url = $.url()

        obj = {}
        for key in keys
            if $url.param(key)
                obj[key] = @stripTrailingSlash($url.param(key))
        return obj

window.Periscope = new Periscope()

