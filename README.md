# Periscope

A multi site viewer.  Why open a many tabs when one will do?

## Requirements

 * Your favourite web server

## Installation

 * Clone me!
 
## Configuration

 Out of the box Periscope won't work, you will need to set up appconfig.coffee
 We've provide appconfig.coffee.example to get you started.

### Options (opts)

#### Menu Titles (opts.menuTitles)

The menu breaks down your url into its compenents. This allows the user to view different servers based on their menu selections. You should break your url down into logical components to allow for this. Lets use an example host to explain. If we have a top level domain of example.com, an environment of prd, a location of us and host of www01. we would create a menu like this:
  
opts.servers =
    'example.com':
        us:
            prd: [
                'www01'
            ]

This is the most basic of setups and venture to guess you will want something a bit more complex. So lets try one.

In this exmaple you have 4 servers in 2 data centers with 
  
  'TopLevelDomain', 'Location', 'Env', 'Host'
  
  The menu allows you to filter and view each part of your Each Menu Title is simply the full hostname broken its components.  The components will be joined with '.'

#### Servers (opts.servers)

The server configuration is stored in `opt.servers`.  Let's say that you had 4 servers in 2 different subdomains.
  ie. www01.us.prd.example.com, www02.us.prd.example.com, www01.uk.prd.example.com, and www02.uk.prd.example.com
  
opts.servers =
    'example.com':
        us:
            prd: [
                'www01'
                'www02'
            ]
        uk:
            prd: [
                'www01'
                'www02'
            ]

# Conf
- Get the repo
