#!/bin/bash
#
# Script to verify new GIT updates
#

# Verifiy if there are new updtes on GIT
pushd .
cd /opt/hyperledger/git/RealHackersCSHackaton

git remote update # Update REFS

if [ "`git status -uno | egrep 'behind'`" != "" ]; then
  logger "GIT Repo require update"
  echo "GIT Repo require update"
else
  echo "GIT Repo DO NOT require update"
fi

popd
