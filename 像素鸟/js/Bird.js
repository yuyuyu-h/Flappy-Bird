/*鸟类*/
function Bird(imgArr, x, y) {
	this.imgArr = imgArr;
	this.idx = parseInt(Math.random() * imgArr.length);
	this.img = this.imgArr[this.idx];
	this.x = x;
	this.y = y;
	// 定义鸟的状态
	this.state = "D";
	this.speed = 0;
}

// 鸟煽动翅膀
Bird.prototype.fly = function() {
	this.idx++;
	if (this.idx >= this.imgArr.length) {
		this.idx = 0;
	}
	this.img = this.imgArr[this.idx];
}

// 鸟下降方法
Bird.prototype.fallDown = function() {
	if (this.state === "D") {
		this.speed++;
		this.y += Math.sqrt(this.speed);
	} else {
		this.speed--;
		if (this.speed === 0) {
			this.state = "D";
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}

// 鸟上升
Bird.prototype.energy = function() {
	// 改变Y值
	// this.y -= 40; // 这么写， 鸟呈现的是“干嘣”效果
	// 改变鸟的状态
	this.state = "U";
	this.speed = 20;
}