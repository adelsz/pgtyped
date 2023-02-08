#!/bin/sh

# When running in CI, run git diff to catch any unexpected code changes

if test -n "$CI"; then
	echo "CI run detected."
	echo $CI
else
	echo "CI run not detected. Skipping git diff check."
	exit 0
fi

if test -z "$(git status --porcelain)"; then
	echo "No changes detected."
else
	echo "Found uncommitted codebase changes."
	echo "This should never happen on a CI run."
	echo "If the changes are expected please commit them first."
	git status
	exit 1
fi
