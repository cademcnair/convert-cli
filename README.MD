# convert CLI
```
sudo npm i -g convert-cli
convert -c <freeconvert API key>
```

## syntax

list the files you want to convert<br>
and the output format you want to convert to
```
convert *.png jpeg # converts every png to jpeg in cwd
convert 1.png 2.png jpeg # converts 2 pngs to jpeg
convert 1.png jpeg # converts 1 png to jpeg
```

## freeconvert API

1. create an account at https://www.freeconvert.com/auth/free/signup
2. go to API > API Keys > Create API Key
3. enter a name and click "create"
4. run `convert -c <freeconvert API key>`