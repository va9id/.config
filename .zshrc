# terminal prompt
PROMPT="%F{82}%n%F{82}@%m %F{26}%d%F{reset} > "

# ls command
export CLICOLOR=1
alias ls="ls -G"
alias ll="ls -lG"
export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd

# PATH
export PATH="$PATH:/Users/vahid/.local/bin"
export PATH="/usr/local/opt/ffmpeg-full/bin:$PATH"

#chruby
source /usr/local/opt/chruby/share/chruby/chruby.sh
source /usr/local/opt/chruby/share/chruby/auto.sh
chruby ruby-3.1.3 # run chruby to see actual version

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# git
alias gd="git diff"
alias ga="git add"
alias gc="git commit -m"
alias gp="git push"
alias gf="git fetch"
alias gs="git status"
alias gst="git stash"
alias gr="git rebase"
alias gm="git merge"

# yazi
function y() {
        local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
        command yazi "$@" --cwd-file="$tmp"
        IFS= read -r -d '' cwd < "$tmp"
        [ "$cwd" != "$PWD" ] && [ -d "$cwd" ] && builtin cd -- "$cwd"
        command rm -f -- "$tmp"
}
