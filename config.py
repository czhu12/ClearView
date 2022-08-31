import json

class ConfigManager:
    def __init__(self):
        with open('./config.json') as f:
            self.data = json.load(f)
