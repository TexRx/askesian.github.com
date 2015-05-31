# askesian.net website

This is the repo for my personal website, [askesian.net](http://askesian.net).

The `development` branch is used for, well, development, and a [gulp](http://gulpjs.com) [task](https://github.com/shinnn/gulp-gh-pages) is used to deploy the files to the `master` branch. This keeps the master branch clean, such that it only contains the files that are needed to display the website. All of the files for building, compiling, and optimizing are kept in the `development` branch.

The application makes use of the following high-level technologies and frameworks:

* Ruby
* Jekyll
* Node.js
* Gulp

## Prerequisites
Because of the technologies used in this application, the application has the following prerequisites that must be met before you can install and run the application:

* Ruby
* Node.js
* Bundler (Ruby gem)

## Installation
To install the app, you must have Ruby and Node.js installed. Additionally, you must have the [Bundler](http://bundler.io/) Ruby gem installed.

### Installation Steps
1. Clone this repo to a new folder on your machine:

```shell
> git clone git@github.com:askesian/askesian.github.com.git ~/projects/MyWebApp
```

2. Ensure that you have Ruby and Node.js installed:

```shell
> ruby -v
ruby 1.9.3p551 (2014-11-13 revision 48407) [x86_64-darwin14.3.0]
> node -v
v0.12.2
```

3. Install the `Bundler` Ruby gem. Run the following from the console:

```shell
> gem install bundler
```

4. Now that you have Ruby, Node.js, and the `Bundler` Ruby gem installed, run the following from the console:

```shell
> bundle install
> npm install
```

These commands will install the Ruby gems required by the project, as well as the Node.js [npm](https://www.npmjs.com/) modules.

## Running the Application
The application makes use of several commands that can be run from the console. These commands primarily control the state of the application, as well as the deployment of the application to a [GitHub](https://github.com/) repository of you choice. After all of the installation steps have been completed, you should be able to run one or more of the following commands from the console:

* npm run gulp
* npm run build
* npm run build:production
* npm run deploy

#### npm run gulp
TODO: Explain this command

#### npm run build
TODO: Explain this command

#### npm run build:production
TODO: Explain this command

#### npm run deploy
TODO: Explain this command