# Veklobot

[![Docker Pulls](https://img.shields.io/docker/pulls/veklohub/veklobot)](https://hub.docker.com/repository/docker/veklohub)
[![Docker Builds](https://img.shields.io/docker/cloud/automated/veklohub/veklobot)](https://hub.docker.com/repository/docker/veklohub/veklobot/builds)
[![Actions Builds](https://img.shields.io/github/workflow/status/veklohub/veklobot/Node.js%20CI/master)](https://github.com/veklohub/veklobot/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/veklohub/veklobot)](https://codecov.io/gh/veklohub/veklobot/branch/master)

To run project:
1. install node >= 12.16.1
2. Create new config file in folder ./config. There is already file `default.json`. The default.json file is designed to contain all configuration parameters from which other files may overwrite. Overwriting is done on a parameter by parameter basis, so subsequent files contain only the parameters unique for that override. You need to create file `{deployment}.json` where you should put only that parameters which you want to override. `{deployment}` is the deployment name, from the `$NODE_ENV` (or if specified, `$NODE_CONFIG_ENV`) environment variable (e.g. `production.json`). Also you can create file `local.json` which with be loaded last. Thus, the order of loading configuration files is as follows (from the first to the last):
    * default.json
    * {deployment}.json
    * local.json
    
    You can override oath to directory with config files by setting the `$NODE_CONFIG_DIR` environment variable to the directory containing your configuration files. It can also be set from node, before loading Node-config:
    
    `process.env["NODE_CONFIG_DIR"] = __dirname + "/configDir/";`
    
    `const config = require("config");`
    
    `$NODE_CONFIG_DIR` can be a full path from your root directory, or a relative path from the process if the value begins with ./ or ../. Multiple directories can be configured as well, splitting it using : (on Linux/Mac) or ; (on Windows), or for cross-platform development with the path delimiter. This results in 
    
    `process.env["NODE_CONFIG_DIR"] = __dirname + "/configDir/" + require('path').delimiter + __dirname + "/configDir2/";`
3. Generate SSL certificate. Example of command for generation of self-signed certificate `openssl req -nodes -new -x509 -keyout server.key -out server.cert`. During generation it's important to set up `Common Name (e.g. server FQDN or YOUR name)` (it could be your domain name) and `Email Address`.
4. Configure path for both, the certificate file and the private key of the certificate. 
5. Generate token for Telegram bot and add it to configuration file
6. Add additional configuration parameters if you want to rewrite some default ones
7. `npm i`
8. `npm start`

## Docker

Build image
```docker build -t veklohub/veklobot .```

Create ```config``` and ```certs``` dirs, where you've placed mentioned above files.

Run docker
```docker run -p host_port:8443 -ti -v `pwd`/certs:/opt/app/certs -v `pwd`/config:/opt/app/config veklohub/veklobot:latest```

## Useful links
[Telegram bot API](https://core.telegram.org/bots)
