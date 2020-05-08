/*管子类*/
function Pipe(pipe_up, pipe_down, step, x) {
	this.pipe_up = pipe_up;
	this.pipe_down = pipe_down;
	this.up_height = parseInt(Math.random() * 249) + 1; 
	this.down_height = 250 - this.up_height;
	this.step = step;
	this.x = x;
	this.count = 0;
}

// 创建管子实例
Pipe.prototype.createPipe = function(x) {
	return new Pipe(this.pipe_up, this.pipe_down, this.step, x);
}