# Douban movie searcher

`Douban movie searcher` is a CLI tool which use douban api to search for movies and then rank by rate. The result will be printed in terminal with detail of each movie(e.t. title, year, link).

# Installation

Intall via npm for only the CLI tool:
```shell
$ npm install dbmovie -g
```

# Example

Use directly with dbmovie command:
```shell
$ dbmovie porn
```

# Semantics

The tool binary is called dbmovie. Running it with no other arguments should give:

```shell
Usage: dbmovie keyword [filter_word]
```
It will search for the keyword and print result.

A filter pattern can be specified as the second argument:

```shell
dbmovie porn pornhub
```

