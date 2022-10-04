#!/usr/bin/env bash

pushd backend
#mvn clean package
mvn -Dmaven.test.skip=true clean package
popd