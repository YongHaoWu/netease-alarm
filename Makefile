NODE_EXEC_PATH = $(shell which node)

install:

	@#Allowing Accessiblity
	@#sudo ./scripts/tccutil.py -i $(NODE_EXEC_PATH)

	@# Generating plist file
	@node ./scripts/plist

	@# Setting up the clock using launchd
	@node ./scripts/launchctl

test:
	@echo "\n===== Debug Mode is ON =====\n"
	@NODE_ENV=debug make install

.PHONY: all test clean
