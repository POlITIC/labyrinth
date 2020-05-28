const G = require("./Global");

class Player {
	constructor(conf){
		this.init(conf);
		this.savedData = {};
		this.dirtyPos = 0;
	}

	init(conf) {
		this.labyrinth = conf.labyrinth;
		const posArr = conf.pos || this.labyrinth.getFreeStart();

		this.moveCallback = conf.cb;
		this.currentPosition = {left: posArr[0], top: posArr[1]};

		this.direction = G.DIRECTIONS.LEFT;
		this.id = conf.name;

		console.log("PLAYER", this.id, this.currentPosition);
	}

	makeMove (data) {
		let action;

		if (this.moveCallback) {
			action = this.moveCallback.call({}, data, this.savedData);
		}

		return action;
	}

	hit () {
		this.dead = true;
	}

	getSurrounding () {
		const current = this.currentPosition,
			lines = labyrinth.getCurrentConfig(),
			up = Math.abs(lines[current.left] [current.top - 1]),
			down = Math.abs(lines[current.left] [current.top + 1]),
			right = Math.abs(lines[current.left + 1] ? lines[current.left + 1] [current.top] : 1),
			left = Math.abs(lines[current.left - 1] ? lines[current.left - 1] [current.top] : 1),
			result = [up, right, down, left];

		result.forEach(function (el, index, arr) {
			if (el === undefined) {
				arr[index] = 1;
			}
		});

		// todo check with exit point
		if (!lines[current.left + 1]) {
			console.error("Congrats! YOU ARE OUT!!!!!");
		}

		return result;
	}

	positionChanged () {
		this.dirtyPos = 0;
	}

	checkPositionChange () {
		if(this.dirtyPos > 15){
			this.hit();
		}else{
			this.dirtyPos++;
		}
	}

	performAction () {
		const pos = this.currentPosition;

		switch (action) {
			case "up":
				pos.top--;
				this.positionChanged();
				break;
			case "down":
				pos.top++;
				this.positionChanged();
				break;
			case "right":
				pos.left++;
				this.positionChanged();
				break;
			case "left":
				pos.left--;
				this.positionChanged();
				break;
			case "direction_left":
				this.direction = G.DIRECTIONS.LEFT;
				break;
			case "direction_right":
				this.direction = G.DIRECTIONS.RIGHT;
				break;
			case "direction_up":
				this.direction = G.DIRECTIONS.UP;
				break;
			case "direction_down":
				this.direction = G.DIRECTIONS.DOWN;
				break
		}

		this.checkPositionChange();
	}
}
module.exports = Player;


