class PetitM4{
	constructor(x){return this.init(x);}
	init(x=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]){this.main=new Float32Array(x);return this;}
	get(){return this.main;}
	_norm(x){const l=Math.sqrt([...x].reduce((a,y)=>a+y*y,0));return l?x.map(y=>y/l):x;}
	mul(x){
		const a=this.main,b=(x||this).main||x;
		this.main.set(new Array(16).map((_,i)=>
			new Array(4).reduce((ac,x,j)=>ac+a[i%4+j*4]*b[Math.floor(i/4)+j])
		));
		return this;
	}
	transpose(){
		this.main.set(new Array(16).map((_,i)=>this.main[[0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15][i]]));
		return this;
	}
	inv(x){
		const a=x[0]*x[5]-x[1]*x[4],b=x[0]*x[6]-x[2]*x[4],c=x[0]*x[7]-x[3]*x[4],d=x[1]*x[6]-x[2]*x[5],
			e=x[1]*x[7]-x[3]*x[5],f=x[2]*x[7]-x[3]*x[6],g=x[8]*x[13]-x[9]*x[12],h=x[8]*x[14]-x[10]*x[12],
			i=x[8]*x[15]-x[11]*x[12],j=x[9]*x[14]-x[10]*x[13],k=x[9]*x[15]-x[11]*x[13],l=x[10]*x[15]-x[11]*x[14],
			idet=1/(a*l-b*k+c*j+d*i-e*h+f*g);
		this.main.set([
			(x[5]*l-x[6]*k+x[7]*j)*idet,(-x[1]*l+x[2]*k-x[3]*j)*idet,(x[13]*f-x[14]*e+x[15]*d)*idet,(-x[9]*f+x[10]*e-x[11]*d)*idet,
			(-x[4]*l+x[6]*i-x[7]*h)*idet,(x[0]*l-x[2]*i+x[3]*h)*idet,(-x[12]*f+x[14]*c-x[15]*b)*idet,(x[8]*f-x[10]*c+x[11]*b)*idet,
			(x[4]*k-x[5]*i+x[7]*g)*idet,(-x[0]*k+x[1]*i-x[3]*g)*idet,(x[12]*e-x[13]*c+x[15]*a)*idet,(-x[8]*e+x[9]*c-x[11]*a)*idet,
			(-x[4]*j+x[5]*h-x[6]*g)*idet,(x[0]*j-x[1]*h+x[2]*g)*idet,(-x[12]*d+x[13]*b-x[14]*a)*idet,(x[8]*d-x[9]*b+x[10]*a)*idet
		]);
		return this;
	}
	scale(x=[]){return this.mul([x[0]??1,0,0,0 ,0,x[1]??1,0,0, 0,0,x[2]??1,0, 0,0,0,1]);}
	translate(x=[]){return this.mul([1,0,0,0, 0,1,0,0, 0,0,1,0, x[0]??1,x[1]??1,x[2]??1,1]);}
	rot(a=[0,1,0],t=0){
		const s=Math.sin(t),c=Math.cos(t),ic=1-c;a=this._norm(a);
		return this.mul([
			c+a[0]*a[0]*ic,a[0]*a[1]*ic+a[2]*s,a[2]*a[0]*ic-a[1]*s,0,
			a[0]*a[1]*ic-a[2]*s,c+a[1]*a[1]*ic,a[1]*a[2]*ic+a[0]*s,0,
			a[2]*a[0]*ic+a[1]*s,a[1]*a[2]*ic-a[0]*s,c+a[2]*a[2]*ic,0,
			0,0,0,1
		]);
	}
	roteul(t=[0,0,0]){
		t=t.map(x=>[cos(x),sin(x)]);
		return this
			.mul([t[0],t[1],0,0, -t[1],t[0],0,0, 0,0,1,0, 0,0,0,1])
			.mul([t[0],0,t[1],0, 0,1,0,0, -t[1],0,t[0],0, 0,0,0,1])
			.mul([1,0,0,0, 0,t[0],t[1],0, 0,-t[1],t[0],0, 0,0,0,1]);
	}
	lookat(c=[0,0,1],o=[0,0,0],u=[0,1,0]){
		this.translate(o.map((x,i)=>x-c[i]));
		const z=this._norm(c.map((x,i)=>x-o[i])),
			x=z.map((x,i)=>{const a=x*u[i];return a/Math.sqrt(a);}),
			y=x.map((x,i)=>x*z[i]);
		return this.mul([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1]);
	}
	pers(v,r,n,f){
		const t=n*Math.tan(v*Math.PI/360),d=1/(f-n);
		return this.mul([n/(t*r),0,0,0, 0,n/t,0,0, 0,0,-(f+n)*d,-1, 0,0,-f*n*2*d,0]);
	}
	ortho(l,r,t,b,n,f){
		const w=1/(r-l),h=1/(t-b),d=1/(f-n);
		return this.mul([2*w,0,0,0, 0,2*h,0,0, 0,0,-2*d,0, -(l+r)*w,-(t+b)*h,-(f+n)*d,1]);
	}
}

class PetitQ{
	constructor(x){return this.init(x);}
	init(x=[1,0,0,0]){this.main=new Float32Array(x);return this;}
	_norm(x){const l=Math.sqrt([...x].reduce((a,y)=>a+y*y,0));return l?x.map(y=>y/l):x;}
	mul(x){
		const a=this.main,b=(x||this).main||x;
		this.main.set([
			a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3],
			a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2],
			a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1],
			a[0]*b[3]+a[1]*b[2]-a[2]*b[1]-a[3]*b[0]
		]);
		return this;
	}
	norm(){this.main.set(this._norm(this.main));return this;}
	inv(){this.main.set(this.main.map((x,i)=>i?-x:x));return this;}
	rot(a=[1,0,0],t){
		const s=Math.sin(t*.5),c=Math.cos(t*.5);a=this._norm(a);
		return this.mul([c,...a.map(x=>x*s)]);
	}
	roteul(){}
	mix(){}
	vec3(){}
	PetitM4(){}
}
