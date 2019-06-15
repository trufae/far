DESTDIR?=
PREFIX?=/usr/local
BINDIR?=

all: node_modules

node_modules:
	npm i

install:
	ln -fs ${PWD}/index.js $(DESTDIR)$(PREFIX)/bin/far
