#!/bin/sh

FAR="node index.js"

T() {
	printf "Testing $1 ... "
	echo "$2" | ${FAR} "$3" - | grep -q "$4"
	if [ $? = 0 ]; then
		echo "OK"
	else
		echo "FAIL"
	fi
}

T "replace" "hello world\n" '.replace("world","worms").print()' "hello worms"
T "grep" "hello\nworld\n" '.grep("world").print()' "world"
T "igrep" "hello\nworld\n" '.igrep("world").print()' "hello"
T "bounds" "pre\nworld\npost\n" '.after("pre").nextLine().before("post").printBlock()' "world"
