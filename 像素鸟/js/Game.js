/**
 * Game 负责整个游戏
 * @ctx 画笔
 * @bird 鸟的实例
 * @pipe 管子的实例
 * @land 地面（属于背景的实例）
 * @ mountain (属于背景的实例) 
 **/

function Game(ctx, bird, pipe, land, mountain) {
	// 赋值
	this.ctx = ctx;
	this.bird = bird;
	this.pipeArr = [pipe];
	this.land = land;
	this.mountain = mountain;
	this.timer = null;
	this.iframe = 0;

	this.init();
}
// 初始化方法
Game.prototype.init = function() {
	this.start();
	this.bindEvent();
}

// 渲染mountain方法
Game.prototype.renderMountain = function() {
	var img = this.mountain.img;
	if (this.mountain.x < - img.width) {
		this.mountain.x = 0;
	}
	this.mountain.x -= this.mountain.step;
	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
}

// 渲染地面方法
Game.prototype.renderLand = function() {
	var img = this.land.img;
	if (this.land.x < - img.width) {
		this.land.x = 0
	}
	this.land.x -= this.land.step;
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
}

// 游戏开始
Game.prototype.start = function() {
	var me = this;
	this.timer = setInterval(function() {
		me.iframe++;
		me.clear();
		me.renderMountain();
		me.renderLand();
		if (!(me.iframe % 65)) {
			me.createPipe();
		}
		me.checkBoom();
		me.movePipe();
		me.renderPipe();
		// 鸟飞翔
		if (!(me.iframe % 10)) {
			me.bird.fly();
		}
		// 渲染鸟的四个点
		me.renderBirdPoints();
		me.renderPipePoints();
		me.removePipe();
		me.bird.fallDown();
		// 渲染鸟
		me.renderBird();
	}, 20)
}

Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}

Game.prototype.renderBird = function() {
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	// 绘制矩形
	// this.ctx.strokeRect(-this.bird.img.width / 2 + 5, - this.bird.img.height / 2 + 10, this.bird.img.width - 12, this.bird.img.height - 20);
	// 判断是上升还是下降
	var deg = this.bird.state === "D" ? this.bird.speed * Math.PI / 180 : -this.bird.speed * Math.PI / 180;
	this.ctx.rotate(deg);
	var img = this.bird.img;
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();
}

// 鸟上升
Game.prototype.bindEvent = function() {
	var me = this;
	this.ctx.canvas.onclick = function() {
		me.bird.energy();
	}
}


// 绘制管子方法
Game.prototype.renderPipe = function() {
	var me = this;
	this.pipeArr.forEach(function(value, index) {
		var up_img = value.pipe_up;
		var img_x = 0;
		var img_y = up_img.height - value.up_height;
		var img_w = up_img.width;
		var img_h = value.up_height;
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		var canvas_y = 0;
		var canvas_w = img_w;
		var canvas_h = img_h;
		me.ctx.drawImage(up_img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);

		var down_img = value.pipe_down;
		var down_img_x = 0;
		var down_img_y = 0;
		var down_img_w = img_w;
		var down_img_h = 250 - img_h;
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		var down_canvas_y = img_h + 150;
		var down_canvas_w = down_img_w;
		var down_canvas_h = down_img_h;
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);
	})
}

// 管子移动的方法
Game.prototype.movePipe = function() {
	// 因为管子是多根， 所以要循环
	this.pipeArr.forEach(function(value) {
		value.count++;
	})
}

Game.prototype.createPipe = function() {
	var pipe = this.pipeArr[0].createPipe(this.ctx.canvas.width);
	this.pipeArr.push(pipe);
}

Game.prototype.removePipe = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i]
		if (pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
			this.pipeArr.splice(i, 1);
			return;
		}
	}
}

// 绘制鸟的在原始坐标系的四个点
Game.prototype.renderBirdPoints = function() {
	var img = this.bird.img;
	// 获取鸟的四个点
	var bird_A = {
		x: -this.bird.img.width / 2 + 5 + this.bird.x,
		y: - this.bird.img.height / 2 + 10 + this.bird.y
	}

	var bird_B = {
		x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12  + this.bird.x,
		y: - this.bird.img.height / 2 + 10  + this.bird.y
	}

	var bird_C = {
		x: -this.bird.img.width / 2 + 5 + this.bird.x,
		y: - this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
	}

	var bird_D = {
		x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
		y: - this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
	}

}

// 绘制管子的8个点
Game.prototype.renderPipePoints = function() {
	// 循环管子数组
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取管子
		var pipe = this.pipeArr[i];

		// 绘制上管子的四个点
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}

		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}

		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}

		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		// 绘制下管子的四个点
		var pipe_down_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe_up_C.y + 150
		}

		var pipe_down_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe_down_A.y
		}

		var pipe_down_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 400
		}

		var pipe_down_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 400
		}

	}
}

// 碰撞检测
Game.prototype.checkBoom = function() {
	for (var i = 0; i < this.pipeArr.length; i++) {
		// 获取管子
		var pipe = this.pipeArr[i];
		var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
		var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
		var pipe_up_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe.up_height
		}
		var pipe_up_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

		var pipe_down_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: pipe_up_C.y + 150
		}
		var pipe_down_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe_down_A.y
		}
		var pipe_down_C = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 400
		}
		var pipe_down_D = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 400
		}


		// 获取鸟的四个点
		// 鸟的A点
		var bird_A = {
			x: -this.bird.img.width / 2 + 5 + this.bird.x,
			y: - this.bird.img.height / 2 + 10 + this.bird.y
		}
		// 鸟的B点
		var bird_B = {
			x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12  + this.bird.x,
			y: - this.bird.img.height / 2 + 10  + this.bird.y
		}
		// 鸟的C点
		var bird_C = {
			x: -this.bird.img.width / 2 + 5 + this.bird.x,
			y: - this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
		}
		// 鸟的D点
		var bird_D = {
			x: -this.bird.img.width / 2 + 5 + this.bird.img.width - 12 + this.bird.x,
			y: - this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
		}


		// 鸟的四个点与上管子的做对比
		if (bird_B.x >= pipe_up_C.x && bird_B.y <= pipe_up_C.y && bird_A.x <= pipe_up_D.x) {
			console.log("撞到上管子了");
			this.over();
		}

		// 鸟的四个点与下管子做对比
		if (bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_C.x <= pipe_down_B.x) {
			console.log("撞到下管子了");
			this.over();
		}
	}
}

// 游戏结束
Game.prototype.over = function() {
	clearInterval(this.timer);
}