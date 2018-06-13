#!/bin/bash
#
# Script to verify new GIT updates
#

# Verifiy if there are new updtes on GIT

# Lock the script to avoid parallel execution
PATH=/opt/hyperledger/.nvm/versions/node/v8.11.1/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
LOCKDIR=/tmp/gitupdate-lock
PIDFILE=${LOCKDIR}/PID

log_message() {
   MESSAGE=$1
   USER=$2
   echo "[`date '+%Y%m%d %X'`][pid:`echo $$`][compver:`composer -v`][user:$USER] $MESSAGE"
}

if mkdir "${LOCKDIR}" &>/dev/null; then
  echo "$$" >"${PIDFILE}"
  pushd . &>/dev/null
  cd /opt/hyperledger/git/RealHackersCSHackaton
  
  git remote update &>/dev/null # Update REFS
  
  if [ "`git status -uno | egrep 'behind'`" != "" ]; then
    GIT_USER=$(git log -n 1 | egrep -o '<.*>')
    log_message "GIT Repo require update" "$GIT_USER"
    # We track the files that were pulled
    GIT_RESULT=$(git pull -v 2>/dev/null)
    if [ "$(echo $GIT_RESULT | egrep 'real-hackers-flow')" != "" ]; then
      log_message "The model have been changed - need to recreate business network model" "$GIT_USER"
      cd real-hackers-flow
      log_message "Verify current deployed business network archive" "$GIT_USER"
      TIMESTAMP=$(date +%s)
      composer network download -c admin@real-hackers-flow -a /tmp/tempbusiness_$TIMESTAMP.bna 2>&1
      DEPLOYED_BNA_VERSION=$(unzip -p /tmp/tempbusiness_$TIMESTAMP.bna package.json | jq .version | sed -e 's/\"//g')
      GITHUB_BNA_VERSION=$(jq .version < package.json | sed -e s/\"//g)

      if [ "$DEPLOYED_BNA_VERSION" == "$GITHUB_BNA_VERSION" ]; then
        log_message "Deployed version the same as modified one - Please update package.json version" "$GIT_USER"
      else
        log_message "Create new BNA file definition with version $GITHUB_BNA_VERSION" "$GIT_USER"
        composer archive create --sourceType dir --sourceName .  2>&1
        log_message "Install new BNA file definition with version $GITHUB_BNA_VERSION" "$GIT_USER"
        composer network install -a real-hackers-flow@$GITHUB_BNA_VERSION.bna -c PeerAdmin@real-hackers-network 2>&1
        log_message "Upgrade to new business network version $GITHUB_BNA_VERSION" "$GIT_USER"
        composer network upgrade -c PeerAdmin@real-hackers-network -n real-hackers-flow -V $GITHUB_BNA_VERSION 2>&1
        #composer archive create --sourceType dir --sourceName . -a real-hackers-flow@0.0.1.bna 2>&1
        #composer network update -a real-hackers-flow@0.0.1.bna -c admin@real-hackers-flow 2>&1        
        log_message "Restarting REST server" "$GIT_USER"
        docker stop rest 2>&1
        docker start rest 2>&1
        log_message "The model have changed successfully" "$GIT_USER"
      fi
    fi
    log_message "GIT Repo updated successfully" "$GIT_USER"
  else
    log_message "GIT Repo DO NOT require update"
  fi
 
  # Remove the LOCK
  rm -rf $LOCKDIR
  popd &>/dev/null

else
  log_message "Avoid having parallel execution"
fi
