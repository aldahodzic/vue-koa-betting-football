# Fakebet v2.0
> Site with fake bets on football

Demo: [link](https://fakebet.herokuapp.com)  
Description: [link](https://fakebet.herokuapp.com/about)

## Using
**Front:** Vue: vuex, router, test, i18n, axios  
**Back:** Node, Koa  
**Database:** MongoDB

## Commands

### Development

##### Front-end

```sh
# for vue, need @vue/cli and @vue/cli-service-global -g
$ cd front && npm install
$ npm run vue
```

##### Back-end

```sh
# for node, need nodemon -g
$ cd server && npm install
$ npm run node
```

### Production

```sh
# need @vue/cli and @vue/cli-service-global -g
$ cd front && npm install
$ cd server && npm install
$ npm run vue-production
$ npm run node-production
```

### Test

```sh
# need jest
$ npm run test # watch files,
$ npm run test-a # all tests once
```

## License
This software is free to use under the MIT license.
