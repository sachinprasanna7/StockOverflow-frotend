#!/bin/sh
ollama serve &
sleep 5
ollama run trading-assistant
wait