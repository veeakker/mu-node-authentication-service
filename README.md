<p align="center">
    <img src="https://user-images.githubusercontent.com/52280338/127743566-8a3746ea-8116-40a7-9f8c-51a20259d27f.png" alt="mu-node-authentication" />
</p>
<h1 align="center">mu-node-authentication-service</h1>
<h2 align="center">Authentication service for Semantic.Works</h2>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="license: MIT" />
  </a>
  <a href="https://github.com/aatauil/mu-node-storage-service/actions/workflows/docker-publish.yml">
    <img src="https://github.com/aatauil/mu-node-authentication-service/actions/workflows/docker-publish.yml/badge.svg" alt="docker-publish" />
  </a>
  </a>
</p>

---

## Functionality:

- :writing_hand: Registration
- :red_haired_man: Login 
- :key: Change password

## Core Features:

- :page_with_curl: JSON:API compliant
- :gear: Customizable
- :o: Semantic.works ready
- :computer: Written 100% in Javascript

# :open_book: Documentation

## Description
This service makes it easy to quickly setup an application where users can register and login to their account. It is made with the semantic.works framework in mind. The service is kept simple so you can easily extend it with your own functionality like 2FA. Tutorials on how to add add certain functionality will be made available in this repo's wiki in the near future. 

## Getting Started

### Add to your semantic.works stack
- Add the following service to your docker-compose.yml file: 
```yml
  authentication: 
    image: aatauil/mu-node-authentication-service
    labels:
      - "logging=true"
    restart: always
    logging: *default-logging
```
- Add the following routes to your **config/dispatcher/dispatcher.ex** file: 
```elixir
  post "/accounts/*path" do
    Proxy.forward conn, path, "http://authentication/accounts/" 
  end

  delete "/accounts/current/*path" do
    Proxy.forward conn, path, "http://authentication/accounts/current/" 
  end

  patch "/accounts/current/changePassword/*path" do
    Proxy.forward conn, path, "http://authentication/accounts/current/changePassword/" 
  end

  match "/sessions/*path" do
    Proxy.forward conn, path, "http://authentication/sessions/" 
  end
```
- Create a file called **master-account-domain.lisp** under **config/resources** and paste the following code into the file:
```lisp
    (define-resource account ()
      :class (s-prefix "foaf:OnlineAccount")
      :properties `((:email :string ,(s-prefix "account:email")))
      :resource-base (s-url "http://mu.semte.ch/vocabularies/accounts/")
      :on-path "accounts")
```
- In your **config/resources/repository.lisp** file, add the following prefixes
 ```lisp
    (add-prefix "foaf" "http://xmlns.com/foaf/0.1/")
    (add-prefix "account" "http://mu.semte.ch/vocabularies/account/")
```

- Finally add the following line to your **config/resources/domain.lisp** file
```
    (read-domain-file "master-account-domain.lisp")
```
- When that is done, run `docker-compose up -d`
If you set this up locally then by default your app will be made available on `http://localhost:80`

### Frontend - EmberJS
If you use semantic.works then it does not really matter which frontend framework you use but for this Getting Started we will be using EmberJS as a template has already been build and is ready to be used.

- Clone the following EmberJS frontend https://github.com/aatauil/ember-mu-auth-boilerplate
- Navigate to the newly cloned repository and run `npm i`
- After that is finished, run `ember serve --proxy http://localhost:80`
- After your ember app has been succesfully served, you should be able to access the frontend in your browser at `http://localhost:4200`
More information about the frontend can be found in the [README](https://github.com/aatauil/ember-mu-auth-boilerplate/blob/master/README.md) of the frontend template.

---

<sub>**Note** <br>
The url entered after `--proxy` in the serve step needs to point to your backend in case you did not use the premade backend mentioned above.<sub>
  
---
## Environment variables
| ENV  | Description | default | required |
|---|---|---|---|
| SESSIONS_GRAPH | Graph where session related information will be stored in. | `http://mu.semte.ch/application` |
| ACCOUNTS_GRAPH | Graph where account related information will be stored in.  | `http://mu.semte.ch/application` |   |
| HASH_STRENGTH |  The salt to be used to hash the password. [Learn more](https://github.com/kelektiv/node.bcrypt.js#api) | 12 |  |

## Development
This image uses the [mu-javascript-template](https://github.com/mu-semtech/mu-javascript-template) as base image (see Dockerfile). Therefor all functions and environment variables that the mu-javascript-template provides are also available in this image. Its highly advisable to read through the readme of the mu-javascript-template as it will show you how to setup a development environment where you can take advatage of logging, debugging, live reload and many functions.
<br><br>
Quick example on how your docker-compose.yml file for this service will look like in development mode:
```yml
    authentication:
      image: aatauil/mu-node-authentication-service
      ports:
        - 8888:80
        - 9229:9229
      environment:
        NODE_ENV: "development"
      links:
        - virtuoso:db
      volumes:
        - /path/to/local/cloned/mu-node-authentication-service/folder/:/app/
      labels:
        - "logging=true"
      restart: always
      logging: *default-logging
```

---

<sub>**Note** <br>
When using mu-authorization, you probably will want your requests to go through there first instead of straight to 'virtuoso'. In the yaml file above we see that 'db' is linked directly to 'virtuoso'. Change this to the name of the authorization service (e.g. database) if you need it to go through mu-authorization first.</sub>
```
      links:
        - database:db
``` 
  
---
# :orange_heart: Contributing

Everyone can open an issue or send in a pull request.


# 📝 License

This project is [MIT](LICENSE) licensed.
