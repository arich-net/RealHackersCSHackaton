#!/bin/bash
#
# Script to verify new GIT updates
#

# Verifiy if there are new updtes on GIT

# Lock the script to avoid parallel execution
PATH=/opt/hyperledger/.nvm/versions/node/v8.10.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
LOCKDIR=/tmp/gitupdate-lock
PIDFILE=${LOCKDIR}/PID

log_message() {
   MESSAGE=$1
   echo "[`date '+%Y%m%d %X'`] $MESSAGE"
   logger $MESSAGE
}

if mkdir "${LOCKDIR}" &>/dev/null; then
  echo "$$" >"${PIDFILE}"

  pushd . &>/dev/null
  cd /opt/hyperledger/git/RealHackersCSHackaton
  
  git remote update &>/dev/null # Update REFS
  
  if [ "`git status -uno | egrep 'behind'`" != "" ]; then
    log_message "GIT Repo require update"
    # We track the files that were pulled
    GIT_RESULT=$(git pull -v 2>/dev/null)
    if [ "$(echo $GIT_RESULT | egrep 'real-hackers-flow')" != "" ]; then
      log_message "The model have been changed - need to recreate business network model"
      cd real-hackers-flow
      composer archive create --sourceType dir --sourceName . -a real-hackers-flow@0.0.1.bna 2>&1
      composer network update -a real-hackers-flow@0.0.1.bna -c admin@real-hackers-flow 2>&1

      log_message "The model have changed successfully"
    fi
    log_message "GIT Repo updated successfully"
  else
    log_message "GIT Repo DO NOT require update"
  fi
 
  # Remove the LOCK
  rm -rf $LOCKDIR
  popd &>/dev/null

else
  log_message "Avoid having parallel execution"
fi
