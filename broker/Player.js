const randomColour = require("randomcolor");

class Player {
  constructor(username) {
    this.username = username;

    this.rerollAvatarSeed();
    this.rerollColour();
  }

  rerollAvatarSeed() {
    this.avatarSeed = Math.random().toString(36).substring(2, 7);
  }

  rerollColour() {
    this.colour = randomColour();
  }
}

module.exports = Player;
