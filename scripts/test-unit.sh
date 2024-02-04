#!/usr/bin/env bash

npx jest "${@}"

# Check the exit status of Jest
if [ $? -eq 0 ]; then
# If tests passed successfully, print the message
echo Tests passed successfully! Coverage report: './coverage/index.html'
else
# If tests failed, print an error message
echo "Tests failed!"
exit 1
fi
