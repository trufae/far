all: node_modules

node_modules:
	npm i

install:
	ln -fs ${PWD}/index.js /usr/local/bin/far
