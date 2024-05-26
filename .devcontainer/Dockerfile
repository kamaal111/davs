FROM golang:1.22.3-bookworm

RUN apt update && apt install -y zsh curl git vim httpie jq unzip bash

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt update && apt install -y nodejs

# Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting

# Install Rust up for cargo tools
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
