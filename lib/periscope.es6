/*global $*/

class Periscope {

    constructor() {
        this.isLoaded = false;
        this.StaticKey =  '';
        this.servers = {};
    }

    run() {

        $.getJSON('/appconfig.json', (data) => {
            this.upScope(data);
        });
    }

    upScope(opts) {

        this.$main = $('#main');
        this.servers = this.createServerList(opts.servers);
        this.keys = opts.menuTitles;
        this.regexOverride = opts.listOverride;

        // Check url params here
        const urlparams = this.parseUrlParams(this.keys);
        if (this.parseUrlParams(['link'])) {
            this.link = this.parseUrlParams(['link']).link;
            if (this.link) {
                $('#deeplink').val(this.link);
            }
        }

        $('#home').attr('href', location.href.split('?')[0]);

        $('#home').click( () => {
            location.href = $('#home').attr('href');
        });

        $('#linkcompare').click( (e) => {
            e.preventDefault();
        });

        $('#comparesubmit').click( (e) => {
            e.preventDefault();
            let href = location.href.split('?')[0];
            href = `?comparelink1=${$('#comparelink1').val()}&comparelink2=${$('#comparelink2').val()}`;
            location.href = href;
        });

        $('#linksubmit').click( (e) => {
            e.preventDefault();
            const urlVal = $('#deeplink').val();
            if (urlVal) {
                const deepLink = $.url(urlVal).attr('path');
                const $url = $.url();
                let url = $url.attr('source');
                const attrName = 'link';
                const currentAttr = $url.param(attrName);
                if (url.indexOf(attrName) !== -1) {
                    url = url.replace(`${attrName}=${currentAttr}`, `${attrName}=${deepLink}`);
                }
                else {
                    url += (url.indexOf('?') !== -1) ? '&' : '?';
                }
                url += `${attrName}=${deepLink}`;
                location.href = url;
            }
        });

        const request = opts.defaults;
        for (let idx = 0; idx < this.keys.length; idx += 1) {
          const param = this.keys[idx];
          if (urlparams[param]) {
            request[idx] = urlparams[param];
          }
        }

        this.updateNavBar(request);
        if (this.isCompareMode()) {
            this.compareServers();
            return;
        }
        this.loadServers(request);
    }

    updateNavBar(dataArry) {

        const nb = $('#nav-bar');
        let out = '';
        let currentServers = this.servers;

        for (let idx = 0; idx < this.keys.length; idx += 1) {
            const key = this.keys[idx];
            const ref = this.regexOverride[key];
            let h = this.confirmHost(currentServers, dataArry[idx]);
            if (ref && dataArry[idx] && ref[dataArry[idx]]) {
                h = dataArry[idx];
            }

            out += `<li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">${key}: <b>${h}</b><b class="caret"></b></a>
                <ul class="dropdown-menu">`;

            if (this.regexOverride[this.keys[idx]]) {

                const childKeys = Object.keys(this.regexOverride[key]);
                for (const ref in (childKeys)) {
                    const child = childKeys[ref];
                    if (child !== h) {
                        out += `<li><a href="#" data-env="${key}">${child}</a></li>`;
                    }
                }
            }
            else {
                const serverKeys = Object.keys(currentServers);
                for (const ref in (serverKeys)) {
                    const child = serverKeys[ref];
                    out += `<li><a href="#" data-env="${key}">${child}</a></li>`;
                }
            }
            out += '</ul></li>';

            if (idx < this.keys.length - 1) {
                currentServers = currentServers[h];
            }
        }
        nb.append(out);

        $('a').click( (e) => {
            debugger;
            console.log('click...', e);
            e.preventDefault();
            const attrName = $(e.currentTarget).attr('data-env');
            if (attrName !== null) {
                const attrVal = $(e.currentTarget).html();
                if (this.keys.indexOf(attrName) !== -1) {
                    const $url = $.url();
                    let url = $url.attr('source');
                    const currentAttr = $url.param(attrName);
                    if (url.indexOf(attrName) !== -1) {
                        url = url.replace(`${attrName}=${currentAttr}`, `${attrName}=${attrVal}`);
                    }
                    else {
                        url += (url.indexOf('?') !== -1) ? '&' : '?';
                        url += `${attrName}=${attrVal}`;
                    }
                    location.href = this.removeCompareString(url);
                }
            }
        });
        return;
    }

    removeCompareString(url) {
        const paramsToRemove = ['comparelink1','comparelink2'];

        // Hack for now, find a better way to do this
        if (url.match(paramsToRemove[0])) {
            for (const ref in paramsToRemove) {
                const p = paramsToRemove[ref];
                url = url.replace(`${p}=${$.url().param(p)}`, '');
            }
            url = url.replace('?&&','?');
        }
        return url;
    }

    confirmHost(obj, key) {

        const keys = Object.keys(obj);
        if (keys.indexOf(key) !== -1) {
            return key;
        }
        if (keys.length > 0) {
            return keys[0];
        }
        return false;
    }

    // compareServers() {
    //     this.$main.empty();
    //     const $url = $.url();
    //     const linksToCompare = ['comparelink1','comparelink2'];
    //     let html = `<div class="alert alert-danger fade in" id="close-compare-mode">
    //                 Compare Mode <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
    //                 </div>`;
    //     for (const l in linksToCompare) {
    //         html += `<div class="servers">
    //                     <h2>${$url.param(l)}
    //                         <i class="fa fa-refresh pointer"></i>
    //                     </h2>
    //                     <iframe src="${$url.param(l)}" width="320"  height="480" class="iframe"></iframe>
    //                 </div>`;
    //     }
    //     this.$main.html(html);
    //     $('#close-compare-mode').bind('closed.bs.alert', () => {
    //          location.href = location.href.split('?')[0];
    //     });

    //     const $refreshButtons = $('.fa-refresh');
    //     for (const button in $refreshButtons) {
    //         $( button ).click( (e) => {
    //             $(e.currentTarget).addClass('fa-spin');
    //             const $iframe = $(e.currentTarget).parent().parent().find('iframe');
    //             $iframe.attr('src', $iframe.attr('src'));
    //             setTimeout(() => { $(e.currentTarget).removeClass('fa-spin'); }, 1000);
    //         });
    //     }
    //     return;
    // }

    loadServers(dataArry) {
        this.$main.empty();
        let html = (this.link) ? `<div class="container">Page: ${this.link}</div>` : '';

        let currentServers = this.servers;
        let domainstr = false;
        let keyIdx = 0;
        console.log(dataArry, currentServers);
        while (dataArry.length) {
            let h = dataArry.shift();
            console.log('h = ', h);
            if (this.regexOverride[this.keys[keyIdx]]) {
                const hostList = [];
                for (const ref in currentServers) {
                    const host = currentServers[ref];
                    console.log('host = ', host, this.regexOverride[this.keys[keyIdx]][h]);
                    if (typeof this.regexOverride[this.keys[keyIdx]][h] !== "undefined") {
                        const re = new RegExp(this.regexOverride[this.keys[keyIdx]][h].value);
                        if (re.test(host)) {
                            console.log('got it!');
                            hostList.push(host);
                        }
                    }
                }
                currentServers = hostList;
            }
            else {
                h = this.confirmHost(currentServers, h);

                if (domainstr === false) {
                    domainstr = h;
                }
                else {
                    domainstr = `${h}.${domainstr}`;
                }

                currentServers = currentServers[h];
            }
            keyIdx += 1;
        }

        console.log('currentServers', currentServers);
        for (const ref in currentServers) {
            const host = currentServers[ref];
            const hostname = `${host}.${domainstr}`;
            let url = `http://${hostname}`;
            url += (this.link) ? this.link : '';
            html += `<div class="servers"><h2 class="servername">${hostname}
                <i class="fa fa-refresh pointer"></i><i class="glyphicon glyphicon-new-window popout pointer"></i></h2>
                <iframe src="${url}" width="320"  height="480" class="iframe"></iframe></div>`;
        }
        this.$main.html(html);
        const $refreshButtons = $('.fa-refresh');
        for (const ref in $refreshButtons) {
            const button = $refreshButtons[ref];
            $( button ).click( (e) => {
                $(e.currentTarget).addClass('fa-spin');
                const $iframe = $(e.currentTarget).parent().parent().find('iframe');
                $iframe.attr('src', $iframe.attr('src'));
                setTimeout( () => { $(e.currentTarget).removeClass('fa-spin'); }, 1000);
            });
        }
        const $popoutButtons = $('.popout');
        for (const ref in $popoutButtons) {
            const button = $refreshButtons[ref];
            const $btn = $( button );
            $btn.click( () => {
                const server = `http://${$btn.parent().text()}`;
                window.open(server, server, 'window settings');
            });
        }

        return;
    }

    stripTrailingSlash(str) {
        if (str && str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }

    isCompareMode() {
        return ($.url().param('comparelink1'));
    }

    parseUrlParams(keys) {

        // get the current page url
        const $url = $.url();

        const obj = {};
        for (const ref in keys) {
            const key = keys[ref];
            if ($url.param(key)) {
                obj[key] = this.stripTrailingSlash($url.param(key));
            }
        }
        return obj;
    }

    createServerList(serverArry) {

        let servers = {};

        for (let idx = 0; idx < serverArry.length; idx += 1) {
            const host = serverArry[idx].split('.');

            servers = this.buildServerObj(servers, host);

        }
        return servers;
    }

    buildServerObj(target, host) {

        const hostLen = host.length;
        const h = host.pop();
        let newtarget = target;

        if (hostLen === 1) {
            newtarget.push(h);
            return newtarget;
        }
        if (newtarget.hasOwnProperty(h) === false) {
            if (hostLen === 2) {
                newtarget[h] = [];
            }
            else {
                newtarget[h] = {};
            }
        }
        newtarget[h] = this.buildServerObj(newtarget[h], host);
        return newtarget
    }

    addServer(host, obj) {

        for (let idx = 0; idx < host.length; idx += 1) {
            const hpart = host.shift();
            if (typeof obj === undefined) {
                obj = hpart;
            }
            else {
                const tmpobj = {};
                tmpobj[hpart] = obj;
                obj = tmpobj;
            }

            if (!obj.hasOwnProperty(hpart)) {
                obj[hpart] = {};
            }
            obj = this.addServer(host, obj);
        }
        return obj;
    }

}

window.Periscope = new Periscope();
window.Periscope.run();

