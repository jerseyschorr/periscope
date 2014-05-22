# Periscope

We created Periscope to help us get a dashboard view into all of servers during deployments. At a quick glance, we can monitor the status of our servers in realtime without the need for multiple browser tabs.

## Requirements

 * Your favourite web server. For simplicity we often use python -m SimpleHTTPServer

## Installation

 * Clone me! https://github.com/jerseyschorr/periscope.git
 
## Configuration

 Out of the box Periscope won't work, you will need to set up appconfig.coffee
 We've provide appconfig.coffee.example to get you started.

### Options (opts)

#### Menu Titles (opts.menuTitles)

The menu breaks down your url into its compenents. This allows the user to view different servers based on their menu selections. You should break your url down into logical components to allow for this. Lets use an example host to explain. If we have a top level domain of example.com, an environment of prd, and a location of us, and a host of www01. we would create a menu like this:

```coffeescript
opts.menuTitles:      ['TopLevelDomain', 'Location', 'Env', 'Host'],  
```

#### Servers (opts.servers)
and we would set up the servers like so:

```coffeescript
opts.servers:
    'example.com':
        us:
            prd: [
                'www01'
            ]
```

This is the most basic setup and venture to guess you will want something a bit more complex. So lets try one.

In this exmaple you have 4 servers using 2 data centers with 2 environments each. Your appconifg would look like so:

```coffeescript
opts.servers =
    'example.com':
        us:
            prd: [
                'www01'
            ]
            stg: [
                'www01'
        uk:
            prd: [
                'www01'
            ]
            stg: [
                'www01'
            ]
```
