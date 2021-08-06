SHELL=/bin/bash

env=prod
debug=false
coin=false

.DEFAULT_GOAL := build

clean::
	find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \; &&\
	sh scripts/clean.sh

#TODO build tsoa server based on env
#TODO build pubkey worker
build::
	yarn && yarn build
#	&&/
#	cd services/pioneer-server &&/
#	yarn && npm run build:all-local

test::
	sh scripts/test.sh $(env) $(debug) $(coin)

publish::
	lerna version patch --yes && lerna publish from-package --no-private --yes

## TODO start application
up::
	echo "todo"
