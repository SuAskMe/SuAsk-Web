import os
import re

path = os.path.join(os.getcwd(), 'src', 'assets', 'icons')
files = os.listdir(path)
for file in files:
    if file.endswith('.svg'):
        with open (os.path.join(path, file), 'r') as f:
            content = f.read()
            pattern = r'fill="[^"]+"'
            content = re.sub(pattern, '', content)
        with open (os.path.join(path, file), 'w') as f:
            f.write(content)

os.system('svgo -f {path}'.format(path=path))
            

print('Done!')



