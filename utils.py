import os
def make_if_not_exist(directory):
    if "." in directory:
        directory = os.path.dirname(directory)
    if not os.path.exists(directory):
        os.makedirs(directory)

