class PetitMat{
	constructor(x){return this.init(x);}
	init(x=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){
		this.main=new Float32Array(x);
		return this;
	}
	_normalize(v){const l=v.reduce((a,x)=>a+x*x,0);return v.map(x=>x/l);}
	mul(x){
		const [a,b]=[this.main,(x||this).main||x];
		this.main=new Float32Array(16).map((_,i)=>
			new Array(4).map((_,j)=>a[i%4+j*4]*b[Math.floor(i/4)+j].reduce((ac,x)=>ac+x)
		);
		return this;
	}
	scale(x=[]){return this.mul([x[0]??1,0,0,0,0,x[1]??1,0,0,0,0,x[2]??1,0,0,0,0,1]);}
	translate(x=[]){return this.mul([1,0,0,0,0,1,0,0,0,0,1,0,x[0]??1,x[1]??1,x[2]??1,1]);}
	rot(a=[0,1,0],t=0){
		const s=Math.sin(t),c=Math.cos(t),ic=1-c;
		return this.mul([
			c+a[0]*a[0]*ic,a[0]*a[1]*ic+a[2]*s,a[2]*a[0]*ic-a[1]*s,0,
			a[0]*a[1]*ic-a[2]*s,c+a[1]*a[1]*ic,a[1]*a[2]*ic+a[0]*s,0,
			a[2]*a[0]*ic+a[1]*s,a[1]*a[2]*ic-a[0]*s,c+a[2]*a[2]*ic,0,
			0,0,0,1
		]);
	}
	lookat(c=[0,0,1],o=[0,0,0],u=[0,1,0]){
		this.translate(o.map((x,i)=>x-c[i]));
		const z=this._normalize(c.map((x,i)=>x-o[i])),
			x=z.map((x,i)=>{const a=x*u[i];return a/Math.sqrt(a);}),
			y=x.map((x,i)=>x*z[i]);
		return this.mul([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1]);
	}
	pers(){}
	ortho(){}
	transpose(){
		this.main=new Float32Array(16).map((_,i)=>this.main[[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15][i]]);
		return this;
	}
	inv(){}
	get(){return this.main;}
}
