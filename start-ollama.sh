#!/bin/sh
ollama serve &
sleep 5
ollama create trading-assistant -f /root/.ollama/Modelfile
ollama run trading-assistant
wait