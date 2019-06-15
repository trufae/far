DESTDIR?=
PREFIX?=/usr/local
BINDIR?=
PWD=$(shell pwd)

all: node_modules

node_modules:
	npm i

install:
	ln -fs "$(PWD)/index.js" "$(DESTDIR)$(PREFIX)/bin/far"

uninstall:
	rm -f "$(DESTDIR)$(PREFIX)/bin/far"
