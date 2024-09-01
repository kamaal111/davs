export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="robbyrussell"

plugins=(
    git
    zsh-autosuggestions
    zsh-syntax-highlighting
)

. $ZSH/oh-my-zsh.sh
. "$HOME/.atuin/bin/env"
. "$HOME/.cargo/env"

eval "$(atuin init zsh)"

# pnpm
export PNPM_HOME="/root/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

alias pn=pnpm
alias pnx=pnpm exec
