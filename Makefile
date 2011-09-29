BUILD_NUMBER  = BUILD
BUILD_VERSION = VERSION
BUILD_VER     = $(shell cat $(BUILD_VERSION))
BUILD_TIME    = $(shell date '+%Y-%m-%d %H:%m:%S')
BUILD_NUM     = $(shell cat $(BUILD_NUMBER))
BUILD_BY      = $(shell whoami)

JS_TARGETS = $(shell cat MANIFEST)
CLEANUP = SimpleClass-concat.min.js SimpleClass-debug-concat.js SimpleClass-debug.js SimpleClass.min.js

.DEFAULT_GOAL := all

all: $(BUILD_NUM) js SimpleClass.min.js SimpleClass-debug.js cleanup

CLOSURE = java -jar ./bin/compiler.jar
CLOSURE_FLAGS =

M4 = ./bin/m4
M4_FLAGS += -Q -P -DBUILD_VER='$(BUILD_VER)' -DBUILD_TIME='$(BUILD_TIME)' -DBUILD_NUM='$(BUILD_NUM)' -DBUILD_BY='$(BUILD_BY)'

.PHONY: js

$(BUILD_NUM): $(JS_TARGETS)
	@echo Incrementing build number
	@echo $$(($$(cat $(BUILD_NUMBER)) + 1)) > $(BUILD_NUMBER)

build: $(JS_TARGETS)
	$(expr $(cat $BUILD_NUMBER_FILE) + 1)

%.gz: %
	gzip -9 <$< >$@

cleanup:
	rm -rf SimpleClass-concat.min.js SimpleClass-debug-concat.js

JS_MINIFIED = $(JS_TARGETS:.js=.min.js)
JS_GZIP = $(JS_TARGETS:.js=.js.gz)
JS_MIN_GZIP = $(JS_TARGETS:.js=.min.js.gz)

js: $(JS_TARGETS) $(JS_MINIFIED) $(JS_GZIP) $(JS_MIN_GZIP)

SimpleClass-concat.min.js: $(JS_TARGETS)
	$(CLOSURE) $(CLOSURE_FLAGS) $(addprefix --js=,$^) >$@

SimpleClass.min.js: SimpleClass-concat.min.js
	$(M4) $(M4_FLAGS) $^ >$@

SimpleClass.min.js.gz: SimpleClass.min.js
	gzip -9 <$< >$@

SimpleClass-debug.js: SimpleClass-debug-concat.js
	$(M4) $(M4_FLAGS) $^ >$@

SimpleClass-debug-concat.js: $(JS_TARGETS)
	cat $^ >$@

%.min.js: %.js
	$(M4) $(M4_FLAGS) $< | $(CLOSURE) $(CLOSURE_FLAGS) >$@

clean:
	rm -f $(JS_GZIP) $(JS_MINIFIED) $(JS_MIN_GZIP) $(CLEANUP)
