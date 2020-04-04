# veklobot

To run project:
1. install node >= 12.16.1
2. Create new config file in folder ./config. There is already file `default.json`. The default.json file is designed to contain all configuration parameters from which other files may overwrite. Overwriting is done on a parameter by parameter basis, so subsequent files contain only the parameters unique for that override. You need to create file `{deployment}.json` where you should put only that parameters which you want to override. `{deployment}` is the deployment name, from the `$NODE_ENV` (or if specified, `$NODE_CONFIG_ENV`) environment variable (e.g. `production.json`). Also you can create file `local.json` which with be loaded last. Thus, the order of loading configuration files is as follows (from the first to the last):
    * default.json
    * {deployment}.json
    * local.json
3. Generate SSL certificate. Example of command for generation of self-signed certificate `openssl req -nodes -new -x509 -keyout server.key -out server.cert`. During generation it's important to set up `Common Name (e.g. server FQDN or YOUR name)` (it could be your domain name) and `Email Address`.
4. Configure path for both, the certificate file and the private key of the certificate. 
5. Generate token for Telegram bot and add it to configuration file
6. Add additional configuration parameters if you want to rewrite some default ones
7. `npm i`
8. `npm start`
