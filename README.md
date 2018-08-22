# extract-goodies
a global package to extract files

`npm install -g extract-goodies`

run `extract-goodies -h` or `extract-goodies --help` to see a list of commands
for any command you can run `-h` or `--help` to see a list of it's options.

example: `extract-goodies imgs -h` will output its options

## imgs
To extract images run `extract-goodies imgs [options] <input> <output>` this will walk though all
subdirectories and extract the images from them.

Options: 
* -o, --overwrite: overwrite duplicates
* -k, --keep: keeps duplicates

### why
I wanted to back up all my photos from all my cloud based accounts downloading all the files was a task.
When it came to Google I had a lot of stuff in there so I used Takeout to dump everything from my account.
This was a shiz load of data and the files it output were not pretty. I built this little tool to do the hard work for me.


