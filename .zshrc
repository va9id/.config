export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_comple    tion

PROMPT="%F{82}%n%F{82}@%m %F{26}%d%F{reset} > "
export CLICOLOR=1
alias ls="ls -G"
alias ll="ls -lG"
export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd
source /usr/local/opt/chruby/share/chruby/chruby.sh
source /usr/local/opt/chruby/share/chruby/auto.sh
chruby ruby-3.1.3 # run chruby to see actual version

# export PATH="$PATH:/Users/<YOUR_USER>/.local/bin"

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
