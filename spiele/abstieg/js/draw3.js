/* Der Abstieg – 3D-Darstellung. Erzeugt aus src3d/draw3.js mit three.js (node build3d.js), nicht von Hand ändern.
 * three.js: https://threejs.org
 * The MIT License
 * 
 * Copyright © 2010-2025 three.js authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(()=>{var Kl=0,No=1,Ql=2;var Os=1,Zr=2,Yi=3,En=0,Oe=1,Ie=2,gn=0,ri=1,Ke=2,Fo=3,Oo=4,jl=5,kn=100,tc=101,ec=102,nc=103,ic=104,sc=200,rc=201,ac=202,oc=203,Mr=204,br=205,lc=206,cc=207,hc=208,uc=209,fc=210,dc=211,pc=212,mc=213,gc=214,Jr=0,$r=1,Kr=2,ai=3,Qr=4,jr=5,ta=6,ea=7,na=0,xc=1,_c=2,on=0,Bo=1,zo=2,ko=3,Bs=4,Vo=5,Go=6,Ho=7;var Wo=300,Zn=301,ci=302,ia=303,sa=304,zs=306,Oi=1e3,un=1001,Sr=1002,fe=1003,vc=1004;var ks=1005;var Ae=1006,ra=1007;var Jn=1008;var Ge=1009,Xo=1010,qo=1011,Zi=1012,aa=1013,ln=1014,Qe=1015,xn=1016,oa=1017,la=1018,Ji=1020,Yo=35902,Zo=35899,Jo=1021,$o=1022,je=1023,fn=1026,$n=1027,ca=1028,ha=1029,hi=1030,ua=1031;var fa=1033,Vs=33776,Gs=33777,Hs=33778,Ws=33779,da=35840,pa=35841,ma=35842,ga=35843,xa=36196,_a=37492,va=37496,ya=37488,Ma=37489,ba=37490,Sa=37491,wa=37808,Aa=37809,Ta=37810,Ea=37811,Ca=37812,Ra=37813,Ia=37814,Pa=37815,Da=37816,La=37817,Ua=37818,Na=37819,Fa=37820,Oa=37821,Ba=36492,za=36494,ka=36495,Va=36283,Ga=36284,Ha=36285,Wa=36286;var cs=2300,wr=2301,yr=2302,Eo=2400,Co=2401,Ro=2402;var yc=3200;var Ko=0,Mc=1,Dn="",Re="srgb",oi="srgb-linear",hs="linear",ee="srgb";var si=7680;var Io=519,bc=512,Sc=513,wc=514,Xa=515,Ac=516,Tc=517,qa=518,Ec=519,Ar=35044,ui=35048;var Qo="300 es",sn=2e3,us=2001;function jo(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ph(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Cc(){let i=fs("canvas");return i.style.display="block",i}var Tl={},Bi=null;function ds(...i){let t="THREE."+i.shift();Bi?Bi("log",t,...i):console.log(t,...i)}function Gt(...i){let t="THREE."+i.shift();Bi?Bi("warn",t,...i):console.warn(t,...i)}function zt(...i){let t="THREE."+i.shift();Bi?Bi("error",t,...i):console.error(t,...i)}function zi(...i){let t=i.join(" ");t in Tl||(Tl[t]=!0,Gt(...i))}function Rc(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Cn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Ee=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var eo=Math.PI/180,Tr=180/Math.PI;function zn(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ee[i&255]+Ee[i>>8&255]+Ee[i>>16&255]+Ee[i>>24&255]+"-"+Ee[t&255]+Ee[t>>8&255]+"-"+Ee[t>>16&15|64]+Ee[t>>24&255]+"-"+Ee[e&63|128]+Ee[e>>8&255]+"-"+Ee[e>>16&255]+Ee[e>>24&255]+Ee[n&255]+Ee[n>>8&255]+Ee[n>>16&255]+Ee[n>>24&255]).toLowerCase()}function Qt(i,t,e){return Math.max(t,Math.min(e,i))}function mh(i,t){return(i%t+t)%t}function no(i,t,e){return(1-e)*i+e*t}function hn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function se(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Xt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Rn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3],d=r[a+0],p=r[a+1],y=r[a+2],w=r[a+3];if(o<=0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(o>=1){t[e+0]=d,t[e+1]=p,t[e+2]=y,t[e+3]=w;return}if(h!==w||c!==d||l!==p||u!==y){let m=c*d+l*p+u*y+h*w;m<0&&(d=-d,p=-p,y=-y,w=-w,m=-m);let f=1-o;if(m<.9995){let P=Math.acos(m),g=Math.sin(P);f=Math.sin(f*P)/g,o=Math.sin(o*P)/g,c=c*f+d*o,l=l*f+p*o,u=u*f+y*o,h=h*f+w*o}else{c=c*f+d*o,l=l*f+p*o,u=u*f+y*o,h=h*f+w*o;let P=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=P,l*=P,u*=P,h*=P}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[a],d=r[a+1],p=r[a+2],y=r[a+3];return t[e]=o*y+u*h+c*p-l*d,t[e+1]=c*y+u*d+l*h-o*p,t[e+2]=l*y+u*p+o*d-c*h,t[e+3]=u*y-o*h-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(s/2),h=o(r/2),d=c(n/2),p=c(s/2),y=c(r/2);switch(a){case"XYZ":this._x=d*u*h+l*p*y,this._y=l*p*h-d*u*y,this._z=l*u*y+d*p*h,this._w=l*u*h-d*p*y;break;case"YXZ":this._x=d*u*h+l*p*y,this._y=l*p*h-d*u*y,this._z=l*u*y-d*p*h,this._w=l*u*h+d*p*y;break;case"ZXY":this._x=d*u*h-l*p*y,this._y=l*p*h+d*u*y,this._z=l*u*y+d*p*h,this._w=l*u*h-d*p*y;break;case"ZYX":this._x=d*u*h-l*p*y,this._y=l*p*h+d*u*y,this._z=l*u*y-d*p*h,this._w=l*u*h+d*p*y;break;case"YZX":this._x=d*u*h+l*p*y,this._y=l*p*h+d*u*y,this._z=l*u*y-d*p*h,this._w=l*u*h-d*p*y;break;case"XZY":this._x=d*u*h-l*p*y,this._y=l*p*h-d*u*y,this._z=l*u*y+d*p*h,this._w=l*u*h+d*p*y;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=n+o+h;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>h){let p=2*Math.sqrt(1+n-o-h);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>h){let p=2*Math.sqrt(1+o-n-h);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+h-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-n*l,this._z=r*u+a*l+n*c-s*o,this._w=a*u-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){let l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,e=Math.sin(e*l)/u,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(El.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(El.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),u=2*(o*e-r*s),h=2*(r*n-a*e);return this.x=e+c*l+a*h-o*u,this.y=n+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return io.copy(this).projectOnVector(t),this.sub(io)}reflect(t){return this.sub(io.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},io=new V,El=new Rn,qt=class i{constructor(t,e,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],p=n[5],y=n[8],w=s[0],m=s[3],f=s[6],P=s[1],g=s[4],I=s[7],L=s[2],U=s[5],F=s[8];return r[0]=a*w+o*P+c*L,r[3]=a*m+o*g+c*U,r[6]=a*f+o*I+c*F,r[1]=l*w+u*P+h*L,r[4]=l*m+u*g+h*U,r[7]=l*f+u*I+h*F,r[2]=d*w+p*P+y*L,r[5]=d*m+p*g+y*U,r[8]=d*f+p*I+y*F,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-n*r*u+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=u*a-o*l,d=o*c-u*r,p=l*r-a*c,y=e*h+n*d+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let w=1/y;return t[0]=h*w,t[1]=(s*l-u*n)*w,t[2]=(o*n-s*a)*w,t[3]=d*w,t[4]=(u*e-s*c)*w,t[5]=(s*r-o*e)*w,t[6]=p*w,t[7]=(n*c-l*e)*w,t[8]=(a*e-n*r)*w,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(so.makeScale(t,e)),this}rotate(t){return this.premultiply(so.makeRotation(-t)),this}translate(t,e){return this.premultiply(so.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},so=new qt,Cl=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rl=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gh(){let i={enabled:!0,workingColorSpace:oi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(s.r=Tn(s.r),s.g=Tn(s.g),s.b=Tn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(s.r=Fi(s.r),s.g=Fi(s.g),s.b=Fi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Dn?hs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[oi]:{primaries:t,whitePoint:n,transfer:hs,toXYZ:Cl,fromXYZ:Rl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:n,transfer:ee,toXYZ:Cl,fromXYZ:Rl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),i}var jt=gh();function Tn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var vi,Er=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vi===void 0&&(vi=fs("canvas")),vi.width=t.width,vi.height=t.height;let s=vi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=vi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){let e=fs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Tn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Tn(e[n]/255)*255):e[n]=Tn(e[n]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},xh=0,ki=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xh++}),this.uuid=zn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement!="undefined"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame!="undefined"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ro(s[a].image)):r.push(ro(s[a]))}else r=ro(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ro(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Er.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}var _h=0,ao=new V,Ne=class i extends Cn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=un,s=un,r=Ae,a=Jn,o=je,c=Ge,l=i.DEFAULT_ANISOTROPY,u=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_h++}),this.uuid=zn(),this.name="",this.source=new ki(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ao).x}get height(){return this.source.getSize(ao).y}get depth(){return this.source.getSize(ao).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Wo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Oi:t.x=t.x-Math.floor(t.x);break;case un:t.x=t.x<0?0:1;break;case Sr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Oi:t.y=t.y-Math.floor(t.y);break;case un:t.y=t.y<0?0:1;break;case Sr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=Wo;Ne.DEFAULT_ANISOTROPY=1;var de=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],p=c[5],y=c[9],w=c[2],m=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-w)<.01&&Math.abs(y-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+w)<.1&&Math.abs(y+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let g=(l+1)/2,I=(p+1)/2,L=(f+1)/2,U=(u+d)/4,F=(h+w)/4,H=(y+m)/4;return g>I&&g>L?g<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(g),s=U/n,r=F/n):I>L?I<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(I),n=U/s,r=H/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=F/r,s=H/r),this.set(n,s,r,e),this}let P=Math.sqrt((m-y)*(m-y)+(h-w)*(h-w)+(d-u)*(d-u));return Math.abs(P)<.001&&(P=1),this.x=(m-y)/P,this.y=(h-w)/P,this.z=(d-u)/P,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Cr=class extends Cn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ae,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new Ne(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Ae,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ki(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ye=class extends Cr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},ps=class extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fe,this.minFilter=fe,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Rr=class extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fe,this.minFilter=fe,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var dn=class{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,tn):tn.fromBufferAttribute(r,a),tn.applyMatrix4(t.matrixWorld),this.expandByPoint(tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(t.matrixWorld),this.union($s)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,tn),tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ts),Ks.subVectors(this.max,ts),yi.subVectors(t.a,ts),Mi.subVectors(t.b,ts),bi.subVectors(t.c,ts),Ln.subVectors(Mi,yi),Un.subVectors(bi,Mi),ti.subVectors(yi,bi);let e=[0,-Ln.z,Ln.y,0,-Un.z,Un.y,0,-ti.z,ti.y,Ln.z,0,-Ln.x,Un.z,0,-Un.x,ti.z,0,-ti.x,-Ln.y,Ln.x,0,-Un.y,Un.x,0,-ti.y,ti.x,0];return!oo(e,yi,Mi,bi,Ks)||(e=[1,0,0,0,1,0,0,0,1],!oo(e,yi,Mi,bi,Ks))?!1:(Qs.crossVectors(Ln,Un),e=[Qs.x,Qs.y,Qs.z],oo(e,yi,Mi,bi,Ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},yn=[new V,new V,new V,new V,new V,new V,new V,new V],tn=new V,$s=new dn,yi=new V,Mi=new V,bi=new V,Ln=new V,Un=new V,ti=new V,ts=new V,Ks=new V,Qs=new V,ei=new V;function oo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ei.fromArray(i,r);let o=s.x*Math.abs(ei.x)+s.y*Math.abs(ei.y)+s.z*Math.abs(ei.z),c=t.dot(ei),l=e.dot(ei),u=n.dot(ei);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var vh=new dn,es=new V,lo=new V,In=class{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):vh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;es.subVectors(t,this.center);let e=es.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(lo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(es.copy(t.center).add(lo)),this.expandByPoint(es.copy(t.center).sub(lo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Mn=new V,co=new V,js=new V,Nn=new V,ho=new V,tr=new V,uo=new V,ms=class{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Mn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mn.copy(this.origin).addScaledVector(this.direction,e),Mn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){co.copy(t).add(e).multiplyScalar(.5),js.copy(e).sub(t).normalize(),Nn.copy(this.origin).sub(co);let r=t.distanceTo(e)*.5,a=-this.direction.dot(js),o=Nn.dot(this.direction),c=-Nn.dot(js),l=Nn.lengthSq(),u=Math.abs(1-a*a),h,d,p,y;if(u>0)if(h=a*c-o,d=a*o-c,y=r*u,h>=0)if(d>=-y)if(d<=y){let w=1/u;h*=w,d*=w,p=h*(h+a*d+2*o)+d*(a*h+d+2*c)+l}else d=r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*c)+l;else d<=-y?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-c),r),p=-h*h+d*(d+2*c)+l):d<=y?(h=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-c),r),p=-h*h+d*(d+2*c)+l);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(co).addScaledVector(js,d),p}intersectSphere(t,e){Mn.subVectors(t.center,this.origin);let n=Mn.dot(this.direction),s=Mn.dot(Mn)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),u>=0?(r=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mn)!==null}intersectTriangle(t,e,n,s,r){ho.subVectors(e,t),tr.subVectors(n,t),uo.crossVectors(ho,tr);let a=this.direction.dot(uo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Nn.subVectors(this.origin,t);let c=o*this.direction.dot(tr.crossVectors(Nn,tr));if(c<0)return null;let l=o*this.direction.dot(ho.cross(Nn));if(l<0||c+l>a)return null;let u=-o*Nn.dot(uo);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},oe=class i{constructor(t,e,n,s,r,a,o,c,l,u,h,d,p,y,w,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,u,h,d,p,y,w,m)}set(t,e,n,s,r,a,o,c,l,u,h,d,p,y,w,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=y,f[11]=w,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Si.setFromMatrixColumn(t,0).length(),r=1/Si.setFromMatrixColumn(t,1).length(),a=1/Si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let d=a*u,p=a*h,y=o*u,w=o*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=p+y*l,e[5]=d-w*l,e[9]=-o*c,e[2]=w-d*l,e[6]=y+p*l,e[10]=a*c}else if(t.order==="YXZ"){let d=c*u,p=c*h,y=l*u,w=l*h;e[0]=d+w*o,e[4]=y*o-p,e[8]=a*l,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=p*o-y,e[6]=w+d*o,e[10]=a*c}else if(t.order==="ZXY"){let d=c*u,p=c*h,y=l*u,w=l*h;e[0]=d-w*o,e[4]=-a*h,e[8]=y+p*o,e[1]=p+y*o,e[5]=a*u,e[9]=w-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let d=a*u,p=a*h,y=o*u,w=o*h;e[0]=c*u,e[4]=y*l-p,e[8]=d*l+w,e[1]=c*h,e[5]=w*l+d,e[9]=p*l-y,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let d=a*c,p=a*l,y=o*c,w=o*l;e[0]=c*u,e[4]=w-d*h,e[8]=y*h+p,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=p*h+y,e[10]=d-w*h}else if(t.order==="XZY"){let d=a*c,p=a*l,y=o*c,w=o*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+w,e[5]=a*u,e[9]=p*h-y,e[2]=y*h-p,e[6]=o*u,e[10]=w*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(yh,t,Mh)}lookAt(t,e,n){let s=this.elements;return Xe.subVectors(t,e),Xe.lengthSq()===0&&(Xe.z=1),Xe.normalize(),Fn.crossVectors(n,Xe),Fn.lengthSq()===0&&(Math.abs(n.z)===1?Xe.x+=1e-4:Xe.z+=1e-4,Xe.normalize(),Fn.crossVectors(n,Xe)),Fn.normalize(),er.crossVectors(Xe,Fn),s[0]=Fn.x,s[4]=er.x,s[8]=Xe.x,s[1]=Fn.y,s[5]=er.y,s[9]=Xe.y,s[2]=Fn.z,s[6]=er.z,s[10]=Xe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],p=n[13],y=n[2],w=n[6],m=n[10],f=n[14],P=n[3],g=n[7],I=n[11],L=n[15],U=s[0],F=s[4],H=s[8],S=s[12],T=s[1],B=s[5],W=s[9],X=s[13],tt=s[2],ot=s[6],Q=s[10],nt=s[14],dt=s[3],Et=s[7],Mt=s[11],Rt=s[15];return r[0]=a*U+o*T+c*tt+l*dt,r[4]=a*F+o*B+c*ot+l*Et,r[8]=a*H+o*W+c*Q+l*Mt,r[12]=a*S+o*X+c*nt+l*Rt,r[1]=u*U+h*T+d*tt+p*dt,r[5]=u*F+h*B+d*ot+p*Et,r[9]=u*H+h*W+d*Q+p*Mt,r[13]=u*S+h*X+d*nt+p*Rt,r[2]=y*U+w*T+m*tt+f*dt,r[6]=y*F+w*B+m*ot+f*Et,r[10]=y*H+w*W+m*Q+f*Mt,r[14]=y*S+w*X+m*nt+f*Rt,r[3]=P*U+g*T+I*tt+L*dt,r[7]=P*F+g*B+I*ot+L*Et,r[11]=P*H+g*W+I*Q+L*Mt,r[15]=P*S+g*X+I*nt+L*Rt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],p=t[14],y=t[3],w=t[7],m=t[11],f=t[15],P=c*p-l*d,g=o*p-l*h,I=o*d-c*h,L=a*p-l*u,U=a*d-c*u,F=a*h-o*u;return e*(w*P-m*g+f*I)-n*(y*P-m*L+f*U)+s*(y*g-w*L+f*F)-r*(y*I-w*U+m*F)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],p=t[11],y=t[12],w=t[13],m=t[14],f=t[15],P=h*m*l-w*d*l+w*c*p-o*m*p-h*c*f+o*d*f,g=y*d*l-u*m*l-y*c*p+a*m*p+u*c*f-a*d*f,I=u*w*l-y*h*l+y*o*p-a*w*p-u*o*f+a*h*f,L=y*h*c-u*w*c-y*o*d+a*w*d+u*o*m-a*h*m,U=e*P+n*g+s*I+r*L;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/U;return t[0]=P*F,t[1]=(w*d*r-h*m*r-w*s*p+n*m*p+h*s*f-n*d*f)*F,t[2]=(o*m*r-w*c*r+w*s*l-n*m*l-o*s*f+n*c*f)*F,t[3]=(h*c*r-o*d*r-h*s*l+n*d*l+o*s*p-n*c*p)*F,t[4]=g*F,t[5]=(u*m*r-y*d*r+y*s*p-e*m*p-u*s*f+e*d*f)*F,t[6]=(y*c*r-a*m*r-y*s*l+e*m*l+a*s*f-e*c*f)*F,t[7]=(a*d*r-u*c*r+u*s*l-e*d*l-a*s*p+e*c*p)*F,t[8]=I*F,t[9]=(y*h*r-u*w*r-y*n*p+e*w*p+u*n*f-e*h*f)*F,t[10]=(a*w*r-y*o*r+y*n*l-e*w*l-a*n*f+e*o*f)*F,t[11]=(u*o*r-a*h*r-u*n*l+e*h*l+a*n*p-e*o*p)*F,t[12]=L*F,t[13]=(u*w*s-y*h*s+y*n*d-e*w*d-u*n*m+e*h*m)*F,t[14]=(y*o*s-a*w*s-y*n*c+e*w*c+a*n*m-e*o*m)*F,t[15]=(a*h*s-u*o*s+u*n*c-e*h*c-a*n*d+e*o*d)*F,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,u=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+n,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,u=a+a,h=o+o,d=r*l,p=r*u,y=r*h,w=a*u,m=a*h,f=o*h,P=c*l,g=c*u,I=c*h,L=n.x,U=n.y,F=n.z;return s[0]=(1-(w+f))*L,s[1]=(p+I)*L,s[2]=(y-g)*L,s[3]=0,s[4]=(p-I)*U,s[5]=(1-(d+f))*U,s[6]=(m+P)*U,s[7]=0,s[8]=(y+g)*F,s[9]=(m-P)*F,s[10]=(1-(d+w))*F,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return n.set(1,1,1),e.identity(),this;let r=Si.set(s[0],s[1],s[2]).length(),a=Si.set(s[4],s[5],s[6]).length(),o=Si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),en.copy(this);let l=1/r,u=1/a,h=1/o;return en.elements[0]*=l,en.elements[1]*=l,en.elements[2]*=l,en.elements[4]*=u,en.elements[5]*=u,en.elements[6]*=u,en.elements[8]*=h,en.elements[9]*=h,en.elements[10]*=h,e.setFromRotationMatrix(en),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=sn,c=!1){let l=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s),y,w;if(c)y=r/(a-r),w=a*r/(a-r);else if(o===sn)y=-(a+r)/(a-r),w=-2*a*r/(a-r);else if(o===us)y=-a/(a-r),w=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=y,l[14]=w,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=sn,c=!1){let l=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),p=-(n+s)/(n-s),y,w;if(c)y=1/(a-r),w=a/(a-r);else if(o===sn)y=-2/(a-r),w=-(a+r)/(a-r);else if(o===us)y=-1/(a-r),w=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=y,l[14]=w,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Si=new V,en=new oe,yh=new V(0,0,0),Mh=new V(1,1,1),Fn=new V,er=new V,Xe=new V,Il=new oe,Pl=new Rn,rn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Il.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Il,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Pl.setFromEuler(this),this.setFromQuaternion(Pl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};rn.DEFAULT_ORDER="XYZ";var gs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},bh=0,Dl=new V,wi=new Rn,bn=new oe,nr=new V,ns=new V,Sh=new V,wh=new Rn,Ll=new V(1,0,0),Ul=new V(0,1,0),Nl=new V(0,0,1),Fl={type:"added"},Ah={type:"removed"},Ai={type:"childadded",child:null},fo={type:"childremoved",child:null},ve=class i extends Cn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bh++}),this.uuid=zn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new V,e=new rn,n=new Rn,s=new V(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new qt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.multiply(wi),this}rotateOnWorldAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.premultiply(wi),this}rotateX(t){return this.rotateOnAxis(Ll,t)}rotateY(t){return this.rotateOnAxis(Ul,t)}rotateZ(t){return this.rotateOnAxis(Nl,t)}translateOnAxis(t,e){return Dl.copy(t).applyQuaternion(this.quaternion),this.position.add(Dl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ll,t)}translateY(t){return this.translateOnAxis(Ul,t)}translateZ(t){return this.translateOnAxis(Nl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?nr.copy(t):nr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(ns,nr,this.up):bn.lookAt(nr,ns,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),wi.setFromRotationMatrix(bn),this.quaternion.premultiply(wi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(zt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Fl),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):zt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ah),fo.child=t,this.dispatchEvent(fo),fo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Fl),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,t,Sh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,wh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let h=c[l];r(t.shapes,h)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),p=a(t.animations),y=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ve.DEFAULT_UP=new V(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var nn=new V,Sn=new V,po=new V,wn=new V,Ti=new V,Ei=new V,Ol=new V,mo=new V,go=new V,xo=new V,_o=new de,vo=new de,yo=new de,An=class i{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),nn.subVectors(t,e),s.cross(nn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){nn.subVectors(s,e),Sn.subVectors(n,e),po.subVectors(t,e);let a=nn.dot(nn),o=nn.dot(Sn),c=nn.dot(po),l=Sn.dot(Sn),u=Sn.dot(po),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;let d=1/h,p=(l*c-o*u)*d,y=(a*u-o*c)*d;return r.set(1-p-y,y,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,wn.x),c.addScaledVector(a,wn.y),c.addScaledVector(o,wn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return _o.setScalar(0),vo.setScalar(0),yo.setScalar(0),_o.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,n),yo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(_o,r.x),a.addScaledVector(vo,r.y),a.addScaledVector(yo,r.z),a}static isFrontFacing(t,e,n,s){return nn.subVectors(n,e),Sn.subVectors(t,e),nn.cross(Sn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return nn.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),nn.cross(Sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;Ti.subVectors(s,n),Ei.subVectors(r,n),mo.subVectors(t,n);let c=Ti.dot(mo),l=Ei.dot(mo);if(c<=0&&l<=0)return e.copy(n);go.subVectors(t,s);let u=Ti.dot(go),h=Ei.dot(go);if(u>=0&&h<=u)return e.copy(s);let d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector(Ti,a);xo.subVectors(t,r);let p=Ti.dot(xo),y=Ei.dot(xo);if(y>=0&&p<=y)return e.copy(r);let w=p*l-c*y;if(w<=0&&l>=0&&y<=0)return o=l/(l-y),e.copy(n).addScaledVector(Ei,o);let m=u*y-p*h;if(m<=0&&h-u>=0&&p-y>=0)return Ol.subVectors(r,s),o=(h-u)/(h-u+(p-y)),e.copy(s).addScaledVector(Ol,o);let f=1/(m+w+d);return a=w*f,o=d*f,e.copy(n).addScaledVector(Ti,a).addScaledVector(Ei,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ic={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},On={h:0,s:0,l:0},ir={h:0,s:0,l:0};function Mo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ht=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Re){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,jt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=jt.workingColorSpace){if(t=mh(t,1),e=Qt(e,0,1),n=Qt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Mo(a,r,t+1/3),this.g=Mo(a,r,t),this.b=Mo(a,r,t-1/3)}return jt.colorSpaceToWorking(this,s),this}setStyle(t,e=Re){function n(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Re){let n=Ic[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Tn(t.r),this.g=Tn(t.g),this.b=Tn(t.b),this}copyLinearToSRGB(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Re){return jt.workingToColorSpace(Ce.copy(this),t),Math.round(Qt(Ce.r*255,0,255))*65536+Math.round(Qt(Ce.g*255,0,255))*256+Math.round(Qt(Ce.b*255,0,255))}getHexString(t=Re){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.workingToColorSpace(Ce.copy(this),e);let n=Ce.r,s=Ce.g,r=Ce.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=jt.workingColorSpace){return jt.workingToColorSpace(Ce.copy(this),e),t.r=Ce.r,t.g=Ce.g,t.b=Ce.b,t}getStyle(t=Re){jt.workingToColorSpace(Ce.copy(this),t);let e=Ce.r,n=Ce.g,s=Ce.b;return t!==Re?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(On),this.setHSL(On.h+t,On.s+e,On.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(On),t.getHSL(ir);let n=no(On.h,ir.h,e),s=no(On.s,ir.s,e),r=no(On.l,ir.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ce=new Ht;Ht.NAMES=Ic;var Th=0,pn=class extends Cn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Th++}),this.uuid=zn(),this.name="",this.type="Material",this.blending=ri,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mr,this.blendDst=br,this.blendEquation=kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=ai,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Io,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=si,this.stencilZFail=si,this.stencilZPass=si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ri&&(n.blending=this.blending),this.side!==En&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Mr&&(n.blendSrc=this.blendSrc),this.blendDst!==br&&(n.blendDst=this.blendDst),this.blendEquation!==kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ai&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Io&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==si&&(n.stencilFail=this.stencilFail),this.stencilZFail!==si&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==si&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},mn=class extends pn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=na,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var xe=new V,sr=new Xt,Eh=0,_e=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Eh++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ar,this.updateRanges=[],this.gpuType=Qe,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)sr.fromBufferAttribute(this,e),sr.applyMatrix3(t),this.setXY(e,sr.x,sr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hn(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hn(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hn(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),r=se(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ar&&(t.usage=this.usage),t}};var xs=class extends _e{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var _s=class extends _e{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var le=class extends _e{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ch=0,$e=new oe,bo=new ve,Ci=new V,qe=new dn,is=new dn,Se=new V,ye=class i extends Cn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=zn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jo(t)?_s:xs)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return bo.lookAt(t),bo.updateMatrix(),this.applyMatrix4(bo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ci).negate(),this.translate(Ci.x,Ci.y,Ci.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new le(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){zt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&zt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new In);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){zt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){let n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];is.setFromBufferAttribute(o),this.morphTargetsRelative?(Se.addVectors(qe.min,is.min),qe.expandByPoint(Se),Se.addVectors(qe.max,is.max),qe.expandByPoint(Se)):(qe.expandByPoint(is.min),qe.expandByPoint(is.max))}qe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Se.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Se));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Se.fromBufferAttribute(o,l),c&&(Ci.fromBufferAttribute(t,l),Se.add(Ci)),s=Math.max(s,n.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&zt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){zt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _e(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let H=0;H<n.count;H++)o[H]=new V,c[H]=new V;let l=new V,u=new V,h=new V,d=new Xt,p=new Xt,y=new Xt,w=new V,m=new V;function f(H,S,T){l.fromBufferAttribute(n,H),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,T),d.fromBufferAttribute(r,H),p.fromBufferAttribute(r,S),y.fromBufferAttribute(r,T),u.sub(l),h.sub(l),p.sub(d),y.sub(d);let B=1/(p.x*y.y-y.x*p.y);isFinite(B)&&(w.copy(u).multiplyScalar(y.y).addScaledVector(h,-p.y).multiplyScalar(B),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(B),o[H].add(w),o[S].add(w),o[T].add(w),c[H].add(m),c[S].add(m),c[T].add(m))}let P=this.groups;P.length===0&&(P=[{start:0,count:t.count}]);for(let H=0,S=P.length;H<S;++H){let T=P[H],B=T.start,W=T.count;for(let X=B,tt=B+W;X<tt;X+=3)f(t.getX(X+0),t.getX(X+1),t.getX(X+2))}let g=new V,I=new V,L=new V,U=new V;function F(H){L.fromBufferAttribute(s,H),U.copy(L);let S=o[H];g.copy(S),g.sub(L.multiplyScalar(L.dot(S))).normalize(),I.crossVectors(U,S);let B=I.dot(c[H])<0?-1:1;a.setXYZW(H,g.x,g.y,g.z,B)}for(let H=0,S=P.length;H<S;++H){let T=P[H],B=T.start,W=T.count;for(let X=B,tt=B+W;X<tt;X+=3)F(t.getX(X+0)),F(t.getX(X+1)),F(t.getX(X+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _e(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new V,r=new V,a=new V,o=new V,c=new V,l=new V,u=new V,h=new V;if(t)for(let d=0,p=t.count;d<p;d+=3){let y=t.getX(d+0),w=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,y),r.fromBufferAttribute(e,w),a.fromBufferAttribute(e,m),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,y),c.fromBufferAttribute(n,w),l.fromBufferAttribute(n,m),o.add(u),c.add(u),l.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(w,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(o,c){let l=o.array,u=o.itemSize,h=o.normalized,d=new l.constructor(c.length*u),p=0,y=0;for(let w=0,m=c.length;w<m;w++){o.isInterleavedBufferAttribute?p=c[w]*o.data.stride+o.offset:p=c[w]*u;for(let f=0;f<u;f++)d[y++]=l[p++]}return new _e(d,u,h)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){let d=l[u],p=t(d,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){let p=l[h];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(e))}let r=t.morphAttributes;for(let l in r){let u=[],h=r[l];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,u=a.length;l<u;l++){let h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bl=new oe,ni=new ms,rr=new In,zl=new V,ar=new V,or=new V,lr=new V,So=new V,cr=new V,kl=new V,hr=new V,ge=class extends ve{constructor(t=new ye,e=new mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){cr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],h=r[c];u!==0&&(So.fromBufferAttribute(h,t),a?cr.addScaledVector(So,u):cr.addScaledVector(So.sub(e),u))}e.add(cr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(r),ni.copy(t.ray).recast(t.near),!(rr.containsPoint(ni.origin)===!1&&(ni.intersectSphere(rr,zl)===null||ni.origin.distanceToSquared(zl)>(t.far-t.near)**2))&&(Bl.copy(r).invert(),ni.copy(t.ray).applyMatrix4(Bl),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ni)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,w=d.length;y<w;y++){let m=d[y],f=a[m.materialIndex],P=Math.max(m.start,p.start),g=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let I=P,L=g;I<L;I+=3){let U=o.getX(I),F=o.getX(I+1),H=o.getX(I+2);s=ur(this,f,t,n,l,u,h,U,F,H),s&&(s.faceIndex=Math.floor(I/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let y=Math.max(0,p.start),w=Math.min(o.count,p.start+p.count);for(let m=y,f=w;m<f;m+=3){let P=o.getX(m),g=o.getX(m+1),I=o.getX(m+2);s=ur(this,a,t,n,l,u,h,P,g,I),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let y=0,w=d.length;y<w;y++){let m=d[y],f=a[m.materialIndex],P=Math.max(m.start,p.start),g=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let I=P,L=g;I<L;I+=3){let U=I,F=I+1,H=I+2;s=ur(this,f,t,n,l,u,h,U,F,H),s&&(s.faceIndex=Math.floor(I/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let y=Math.max(0,p.start),w=Math.min(c.count,p.start+p.count);for(let m=y,f=w;m<f;m+=3){let P=m,g=m+1,I=m+2;s=ur(this,a,t,n,l,u,h,P,g,I),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Rh(i,t,e,n,s,r,a,o){let c;if(t.side===Oe?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===En,o),c===null)return null;hr.copy(o),hr.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(hr);return l<e.near||l>e.far?null:{distance:l,point:hr.clone(),object:i}}function ur(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,ar),i.getVertexPosition(c,or),i.getVertexPosition(l,lr);let u=Rh(i,t,e,n,ar,or,lr,kl);if(u){let h=new V;An.getBarycoord(kl,ar,or,lr,h),s&&(u.uv=An.getInterpolatedAttribute(s,o,c,l,h,new Xt)),r&&(u.uv1=An.getInterpolatedAttribute(r,o,c,l,h,new Xt)),a&&(u.normal=An.getInterpolatedAttribute(a,o,c,l,h,new V),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:c,c:l,normal:new V,materialIndex:0};An.getNormal(ar,or,lr,d.normal),u.face=d,u.barycoord=h}return u}var an=class i extends ye{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],h=[],d=0,p=0;y("z","y","x",-1,-1,n,e,t,a,r,0),y("z","y","x",1,-1,n,e,-t,a,r,1),y("x","z","y",1,1,t,n,e,s,a,2),y("x","z","y",1,-1,t,n,-e,s,a,3),y("x","y","z",1,-1,t,e,n,s,r,4),y("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(u,3)),this.setAttribute("uv",new le(h,2));function y(w,m,f,P,g,I,L,U,F,H,S){let T=I/F,B=L/H,W=I/2,X=L/2,tt=U/2,ot=F+1,Q=H+1,nt=0,dt=0,Et=new V;for(let Mt=0;Mt<Q;Mt++){let Rt=Mt*B-X;for(let Yt=0;Yt<ot;Yt++){let Vt=Yt*T-W;Et[w]=Vt*P,Et[m]=Rt*g,Et[f]=tt,l.push(Et.x,Et.y,Et.z),Et[w]=0,Et[m]=0,Et[f]=U>0?1:-1,u.push(Et.x,Et.y,Et.z),h.push(Yt/F),h.push(1-Mt/H),nt+=1}}for(let Mt=0;Mt<H;Mt++)for(let Rt=0;Rt<F;Rt++){let Yt=d+Rt+ot*Mt,Vt=d+Rt+ot*(Mt+1),ce=d+(Rt+1)+ot*(Mt+1),re=d+(Rt+1)+ot*Mt;c.push(Yt,Vt,re),c.push(Vt,ce,re),dt+=6}o.addGroup(p,dt,S),p+=dt,d+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function fi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Pe(i){let t={};for(let e=0;e<i.length;e++){let n=fi(i[e]);for(let s in n)t[s]=n[s]}return t}function Ih(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function tl(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}var Pc={clone:fi,merge:Pe},Ph=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fe=class extends pn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ph,this.fragmentShader=Dh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fi(t.uniforms),this.uniformsGroups=Ih(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},vs=class extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Bn=new V,Vl=new Xt,Gl=new Xt,we=class extends vs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Tr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(eo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Tr*2*Math.atan(Math.tan(eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,Vl,Gl),e.subVectors(Gl,Vl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(eo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ri=-90,Ii=1,Ir=class extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new we(Ri,Ii,t,e);s.layers=this.layers,this.add(s);let r=new we(Ri,Ii,t,e);r.layers=this.layers,this.add(r);let a=new we(Ri,Ii,t,e);a.layers=this.layers,this.add(a);let o=new we(Ri,Ii,t,e);o.layers=this.layers,this.add(o);let c=new we(Ri,Ii,t,e);c.layers=this.layers,this.add(c);let l=new we(Ri,Ii,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;let w=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=w,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},ys=class extends Ne{constructor(t=[],e=Zn,n,s,r,a,o,c,l,u){super(t,e,n,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ms=class extends Ye{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ys(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new an(5,5,5),r=new Fe({name:"CubemapFromEquirect",uniforms:fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:gn});r.uniforms.tEquirect.value=e;let a=new ge(s,r),o=e.minFilter;return e.minFilter===Jn&&(e.minFilter=Ae),new Ir(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},ke=class extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}},Lh={type:"move"},Vi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let w of t.hand.values()){let m=e.getJointPose(w,n),f=this._getHandJoint(l,w);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,y=.005;l.inputState.pinching&&d>p+y?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-y&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Lh)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ke;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},bs=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ht(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Ss=class extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Pr=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ar,this.updateRanges=[],this.version=0,this.uuid=zn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ue=new V,ws=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=hn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=hn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=hn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=hn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),r=se(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){ds("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new _e(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){ds("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Pn=class extends pn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Pi,ss=new V,Di=new V,Li=new V,Ui=new Xt,rs=new Xt,Dc=new oe,fr=new V,as=new V,dr=new V,Hl=new Xt,wo=new Xt,Wl=new Xt,Vn=class extends ve{constructor(t=new Pn){if(super(),this.isSprite=!0,this.type="Sprite",Pi===void 0){Pi=new ye;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Pr(e,5);Pi.setIndex([0,1,2,0,2,3]),Pi.setAttribute("position",new ws(n,3,0,!1)),Pi.setAttribute("uv",new ws(n,2,3,!1))}this.geometry=Pi,this.material=t,this.center=new Xt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&zt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Di.setFromMatrixScale(this.matrixWorld),Dc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Li.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Di.multiplyScalar(-Li.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;pr(fr.set(-.5,-.5,0),Li,a,Di,s,r),pr(as.set(.5,-.5,0),Li,a,Di,s,r),pr(dr.set(.5,.5,0),Li,a,Di,s,r),Hl.set(0,0),wo.set(1,0),Wl.set(1,1);let o=t.ray.intersectTriangle(fr,as,dr,!1,ss);if(o===null&&(pr(as.set(-.5,.5,0),Li,a,Di,s,r),wo.set(0,1),o=t.ray.intersectTriangle(fr,dr,as,!1,ss),o===null))return;let c=t.ray.origin.distanceTo(ss);c<t.near||c>t.far||e.push({distance:c,point:ss.clone(),uv:An.getInterpolation(ss,fr,as,dr,Hl,wo,Wl,new Xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function pr(i,t,e,n,s,r){Ui.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(rs.x=r*Ui.x-s*Ui.y,rs.y=s*Ui.x+r*Ui.y):rs.copy(Ui),i.copy(t),i.x+=rs.x,i.y+=rs.y,i.applyMatrix4(Dc)}var As=class extends Ne{constructor(t=null,e=1,n=1,s,r,a,o,c,l=fe,u=fe,h,d){super(null,a,o,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ts=class extends _e{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ni=new oe,Xl=new oe,mr=[],ql=new dn,Uh=new oe,os=new ge,ls=new In,Gn=class extends ge{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ts(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Uh)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ni),ql.copy(t.boundingBox).applyMatrix4(Ni),this.boundingBox.union(ql)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new In),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ni),ls.copy(t.boundingSphere).applyMatrix4(Ni),this.boundingSphere.union(ls)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(os.geometry=this.geometry,os.material=this.material,os.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ls.copy(this.boundingSphere),ls.applyMatrix4(n),t.ray.intersectsSphere(ls)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ni),Xl.multiplyMatrices(n,Ni),os.matrixWorld=Xl,os.raycast(t,mr);for(let a=0,o=mr.length;a<o;a++){let c=mr[a];c.instanceId=r,c.object=this,e.push(c)}mr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ts(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new As(new Float32Array(s*this.count),s,this.count,ca,Qe));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ao=new V,Nh=new V,Fh=new qt,cn=class{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Ao.subVectors(n,e).cross(Nh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Ao),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Fh.getNormalMatrix(t),s=this.coplanarPoint(Ao).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ii=new In,Oh=new Xt(.5,.5),gr=new V,Gi=class{constructor(t=new cn,e=new cn,n=new cn,s=new cn,r=new cn,a=new cn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=sn,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],h=r[5],d=r[6],p=r[7],y=r[8],w=r[9],m=r[10],f=r[11],P=r[12],g=r[13],I=r[14],L=r[15];if(s[0].setComponents(l-a,p-u,f-y,L-P).normalize(),s[1].setComponents(l+a,p+u,f+y,L+P).normalize(),s[2].setComponents(l+o,p+h,f+w,L+g).normalize(),s[3].setComponents(l-o,p-h,f-w,L-g).normalize(),n)s[4].setComponents(c,d,m,I).normalize(),s[5].setComponents(l-c,p-d,f-m,L-I).normalize();else if(s[4].setComponents(l-c,p-d,f-m,L-I).normalize(),e===sn)s[5].setComponents(l+c,p+d,f+m,L+I).normalize();else if(e===us)s[5].setComponents(c,d,m,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){ii.center.set(0,0,0);let e=Oh.distanceTo(t.center);return ii.radius=.7071067811865476+e,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(gr.x=s.normal.x>0?t.max.x:t.min.x,gr.y=s.normal.y>0?t.max.y:t.min.y,gr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(gr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Dr=class extends pn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Yl=new oe,Po=new ms,xr=new In,_r=new V,Es=class extends ve{constructor(t=new ye,e=new Dr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xr.copy(n.boundingSphere),xr.applyMatrix4(s),xr.radius+=r,t.ray.intersectsSphere(xr)===!1)return;Yl.copy(s).invert(),Po.copy(t.ray).applyMatrix4(Yl);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,h=n.attributes.position;if(l!==null){let d=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let y=d,w=p;y<w;y++){let m=l.getX(y);_r.fromBufferAttribute(h,m),Zl(_r,m,c,s,t,e,this)}}else{let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let y=d,w=p;y<w;y++)_r.fromBufferAttribute(h,y),Zl(_r,y,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Zl(i,t,e,n,s,r,a){let o=Po.distanceSqToPoint(i);if(o<e){let c=new V;Po.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var Hi=class extends Ne{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Hn=class extends Ne{constructor(t,e,n=ln,s,r,a,o=fe,c=fe,l,u=fn,h=1){if(u!==fn&&u!==$n)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:h};super(d,s,r,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ki(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Lr=class extends Hn{constructor(t,e=ln,n=Zn,s,r,a=fe,o=fe,c,l=fn){let u={width:t,height:t,depth:1},h=[u,u,u,u,u,u];super(t,t,e,n,s,r,a,o,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Cs=class extends Ne{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}};var Rs=class i extends ye{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],c=[],l=new V,u=new Xt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){let p=n+h/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(o,3)),this.setAttribute("uv",new le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Wn=class i extends ye{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],p=[],y=0,w=[],m=n/2,f=0;P(),a===!1&&(t>0&&g(!0),e>0&&g(!1)),this.setIndex(u),this.setAttribute("position",new le(h,3)),this.setAttribute("normal",new le(d,3)),this.setAttribute("uv",new le(p,2));function P(){let I=new V,L=new V,U=0,F=(e-t)/n;for(let H=0;H<=r;H++){let S=[],T=H/r,B=T*(e-t)+t;for(let W=0;W<=s;W++){let X=W/s,tt=X*c+o,ot=Math.sin(tt),Q=Math.cos(tt);L.x=B*ot,L.y=-T*n+m,L.z=B*Q,h.push(L.x,L.y,L.z),I.set(ot,F,Q).normalize(),d.push(I.x,I.y,I.z),p.push(X,1-T),S.push(y++)}w.push(S)}for(let H=0;H<s;H++)for(let S=0;S<r;S++){let T=w[S][H],B=w[S+1][H],W=w[S+1][H+1],X=w[S][H+1];(t>0||S!==0)&&(u.push(T,B,X),U+=3),(e>0||S!==r-1)&&(u.push(B,W,X),U+=3)}l.addGroup(f,U,0),f+=U}function g(I){let L=y,U=new Xt,F=new V,H=0,S=I===!0?t:e,T=I===!0?1:-1;for(let W=1;W<=s;W++)h.push(0,m*T,0),d.push(0,T,0),p.push(.5,.5),y++;let B=y;for(let W=0;W<=s;W++){let tt=W/s*c+o,ot=Math.cos(tt),Q=Math.sin(tt);F.x=S*Q,F.y=m*T,F.z=S*ot,h.push(F.x,F.y,F.z),d.push(0,T,0),U.x=ot*.5+.5,U.y=Q*.5*T+.5,p.push(U.x,U.y),y++}for(let W=0;W<s;W++){let X=L+W,tt=B+W;I===!0?u.push(tt,tt+1,X):u.push(tt+1,tt,X),H+=3}l.addGroup(f,H,I===!0?1:2),f+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Is=class i extends Wn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Xn=class i extends ye{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,u=c+1,h=t/o,d=e/c,p=[],y=[],w=[],m=[];for(let f=0;f<u;f++){let P=f*d-a;for(let g=0;g<l;g++){let I=g*h-r;y.push(I,-P,0),w.push(0,0,1),m.push(g/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let P=0;P<o;P++){let g=P+l*f,I=P+l*(f+1),L=P+1+l*(f+1),U=P+1+l*f;p.push(g,I,U),p.push(I,L,U)}this.setIndex(p),this.setAttribute("position",new le(y,3)),this.setAttribute("normal",new le(w,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Wi=class i extends ye{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],u=[],h=t,d=(e-t)/s,p=new V,y=new Xt;for(let w=0;w<=s;w++){for(let m=0;m<=n;m++){let f=r+m/n*a;p.x=h*Math.cos(f),p.y=h*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),y.x=(p.x/e+1)/2,y.y=(p.y/e+1)/2,u.push(y.x,y.y)}h+=d}for(let w=0;w<s;w++){let m=w*(n+1);for(let f=0;f<n;f++){let P=f+m,g=P,I=P+n+1,L=P+n+2,U=P+1;o.push(g,I,U),o.push(I,L,U)}}this.setIndex(o),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(l,3)),this.setAttribute("uv",new le(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Ps=class i extends ye{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,u=[],h=new V,d=new V,p=[],y=[],w=[],m=[];for(let f=0;f<=n;f++){let P=[],g=f/n,I=0;f===0&&a===0?I=.5/e:f===n&&c===Math.PI&&(I=-.5/e);for(let L=0;L<=e;L++){let U=L/e;h.x=-t*Math.cos(s+U*r)*Math.sin(a+g*o),h.y=t*Math.cos(a+g*o),h.z=t*Math.sin(s+U*r)*Math.sin(a+g*o),y.push(h.x,h.y,h.z),d.copy(h).normalize(),w.push(d.x,d.y,d.z),m.push(U+I,1-g),P.push(l++)}u.push(P)}for(let f=0;f<n;f++)for(let P=0;P<e;P++){let g=u[f][P+1],I=u[f][P],L=u[f+1][P],U=u[f+1][P+1];(f!==0||a>0)&&p.push(g,I,U),(f!==n-1||c<Math.PI)&&p.push(I,L,U)}this.setIndex(p),this.setAttribute("position",new le(y,3)),this.setAttribute("normal",new le(w,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Ds=class i extends ye{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],u=new V,h=new V,d=new V;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){let w=y/s*r,m=p/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(w),h.y=(t+e*Math.cos(m))*Math.sin(w),h.z=e*Math.sin(m),o.push(h.x,h.y,h.z),u.x=t*Math.cos(w),u.y=t*Math.sin(w),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(y/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){let w=(s+1)*p+y-1,m=(s+1)*(p-1)+y-1,f=(s+1)*(p-1)+y,P=(s+1)*p+y;a.push(w,m,P),a.push(m,f,P)}this.setIndex(a),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ur=class extends Fe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Ve=class extends pn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ko,this.normalScale=new Xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=na,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Nr=class extends pn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Fr=class extends pn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function vr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var li=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Or=class extends li{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Eo,endingEnd:Eo}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Co:r=t,o=2*e-n;break;case Ro:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Co:a=t,c=2*n-e;break;case Ro:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,u=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,p=this._weightNext,y=(n-e)/(s-e),w=y*y,m=w*y,f=-d*m+2*d*w-d*y,P=(1+d)*m+(-1.5-2*d)*w+(-.5+d)*y+1,g=(-1-p)*m+(1.5+p)*w+.5*y,I=p*m-p*w;for(let L=0;L!==o;++L)r[L]=f*a[u+L]+P*a[l+L]+g*a[c+L]+I*a[h+L];return r}},Br=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,u=(n-e)/(s-e),h=1-u;for(let d=0;d!==o;++d)r[d]=a[l+d]*h+a[c+d]*u;return r}},zr=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Ze=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=vr(e,this.TimeBufferType),this.values=vr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:vr(t.times,Array),values:vr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new zr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Br(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Or(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case cs:e=this.InterpolantFactoryMethodDiscrete;break;case wr:e=this.InterpolantFactoryMethodLinear;break;case yr:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Gt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return cs;case this.InterpolantFactoryMethodLinear:return wr;case this.InterpolantFactoryMethodSmooth:return yr}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(zt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(zt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){zt("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){zt("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&ph(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){zt("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===yr,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],u=t[o+1];if(l!==u&&(o!==1||l!==t[0]))if(s)c=!0;else{let h=o*n,d=h-n,p=h+n;for(let y=0;y!==n;++y){let w=e[h+y];if(w!==e[d+y]||w!==e[p+y]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let h=o*n,d=a*n;for(let p=0;p!==n;++p)e[d+p]=e[h+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Ze.prototype.ValueTypeName="";Ze.prototype.TimeBufferType=Float32Array;Ze.prototype.ValueBufferType=Float32Array;Ze.prototype.DefaultInterpolation=wr;var qn=class extends Ze{constructor(t,e,n){super(t,e,n)}};qn.prototype.ValueTypeName="bool";qn.prototype.ValueBufferType=Array;qn.prototype.DefaultInterpolation=cs;qn.prototype.InterpolantFactoryMethodLinear=void 0;qn.prototype.InterpolantFactoryMethodSmooth=void 0;var kr=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};kr.prototype.ValueTypeName="color";var Vr=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};Vr.prototype.ValueTypeName="number";var Gr=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let u=l+o;l!==u;l+=4)Rn.slerpFlat(r,0,a,l-o,a,l,c);return r}},Ls=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Gr(this.times,this.values,this.getValueSize(),t)}};Ls.prototype.ValueTypeName="quaternion";Ls.prototype.InterpolantFactoryMethodSmooth=void 0;var Yn=class extends Ze{constructor(t,e,n){super(t,e,n)}};Yn.prototype.ValueTypeName="string";Yn.prototype.ValueBufferType=Array;Yn.prototype.DefaultInterpolation=cs;Yn.prototype.InterpolantFactoryMethodLinear=void 0;Yn.prototype.InterpolantFactoryMethodSmooth=void 0;var Hr=class extends Ze{constructor(t,e,n,s){super(t,e,n,s)}};Hr.prototype.ValueTypeName="vector";var Wr=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=l.length;h<d;h+=2){let p=l[h],y=l[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return y}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Lc=new Wr,Xr=class{constructor(t){this.manager=t!==void 0?t:Lc,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Xr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Xi=class extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Us=class extends Xi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},To=new oe,Jl=new V,$l=new V,qr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xt(512,512),this.mapType=Ge,this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gi,this._frameExtents=new Xt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Jl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jl),$l.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($l),e.updateMatrixWorld(),To.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(To,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(To)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Do=class extends qr{constructor(){super(new we(90,1,.5,500)),this.isPointLightShadow=!0}},Ns=class extends Xi{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Do}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},qi=class extends vs{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Lo=class extends qr{constructor(){super(new qi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Fs=class extends Xi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new Lo}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Yr=class extends we{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var el="\\[\\]\\.:\\/",Bh=new RegExp("["+el+"]","g"),nl="[^"+el+"]",zh="[^"+el.replace("\\.","")+"]",kh=/((?:WC+[\/:])*)/.source.replace("WC",nl),Vh=/(WCOD+)?/.source.replace("WCOD",zh),Gh=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nl),Hh=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nl),Wh=new RegExp("^"+kh+Vh+Gh+Hh+"$"),Xh=["material","materials","bones","map"],Uo=class{constructor(t,e,n){let s=n||ue.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ue=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Bh,"")}static parseTrackName(t){let e=Wh.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Xh.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){zt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){zt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===l){l=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){zt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){zt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){zt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){zt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;zt("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){zt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ue.Composite=Uo;ue.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ue.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ue.prototype.GetterByBindingType=[ue.prototype._getValue_direct,ue.prototype._getValue_array,ue.prototype._getValue_arrayElement,ue.prototype._getValue_toArray];ue.prototype.SetterByBindingTypeAndVersioning=[[ue.prototype._setValue_direct,ue.prototype._setValue_direct_setNeedsUpdate,ue.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_array,ue.prototype._setValue_array_setNeedsUpdate,ue.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_arrayElement,ue.prototype._setValue_arrayElement_setNeedsUpdate,ue.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_fromArray,ue.prototype._setValue_fromArray_setNeedsUpdate,ue.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Fm=new Float32Array(1);function il(i,t,e,n){let s=qh(n);switch(e){case Jo:return i*t;case ca:return i*t/s.components*s.byteLength;case ha:return i*t/s.components*s.byteLength;case hi:return i*t*2/s.components*s.byteLength;case ua:return i*t*2/s.components*s.byteLength;case $o:return i*t*3/s.components*s.byteLength;case je:return i*t*4/s.components*s.byteLength;case fa:return i*t*4/s.components*s.byteLength;case Vs:case Gs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hs:case Ws:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case pa:case ga:return Math.max(i,16)*Math.max(t,8)/4;case da:case ma:return Math.max(i,8)*Math.max(t,8)/2;case xa:case _a:case ya:case Ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case va:case ba:case Sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ca:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ra:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ia:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Da:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case La:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Na:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Fa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Oa:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ba:case za:case ka:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Va:case Ga:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ha:case Wa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function qh(i){switch(i){case Ge:case Xo:return{byteLength:1,components:1};case Zi:case qo:case xn:return{byteLength:2,components:1};case oa:case la:return{byteLength:2,components:4};case ln:case aa:case Qe:return{byteLength:4,components:1};case Yo:case Zo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"182"}}));typeof window!="undefined"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="182");function nh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Zh(i){let t=new WeakMap;function e(o,c){let l=o.array,u=o.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array!="undefined"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){let u=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,u);else{h.sort((p,y)=>p.start-y.start);let d=0;for(let p=1;p<h.length;p++){let y=h[d],w=h[p];w.start<=y.start+y.count+1?y.count=Math.max(y.count,w.start+w.count-y.start):(++d,h[d]=w)}h.length=d+1;for(let p=0,y=h.length;p<y;p++){let w=h[p];i.bufferSubData(l,w.start*u.BYTES_PER_ELEMENT,u,w.start,w.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Jh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$h=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Kh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,tu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,eu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,nu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,iu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,su=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ru=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,au=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ou=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,lu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,uu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,du=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,gu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,xu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_u=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,yu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Mu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,bu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Su=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Au="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Eu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Cu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ru=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Iu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Du=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Uu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Nu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ou=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ku=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Gu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Wu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Yu=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Zu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ju=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$u=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ku=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Qu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ju=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ef=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,rf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,af=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,of=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,uf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ff=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,df=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,pf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,mf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_f=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,yf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Af=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ef=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,If=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Df=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Uf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ff=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Of=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Bf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Wf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Xf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Jf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$f=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,td=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ed=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,nd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,id=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,rd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ad=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,od=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ld=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,cd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,hd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ud=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,pd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,md=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,gd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,xd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_d=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,yd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Md=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ad=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Td=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ed=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jt={alphahash_fragment:Jh,alphahash_pars_fragment:$h,alphamap_fragment:Kh,alphamap_pars_fragment:Qh,alphatest_fragment:jh,alphatest_pars_fragment:tu,aomap_fragment:eu,aomap_pars_fragment:nu,batching_pars_vertex:iu,batching_vertex:su,begin_vertex:ru,beginnormal_vertex:au,bsdfs:ou,iridescence_fragment:lu,bumpmap_pars_fragment:cu,clipping_planes_fragment:hu,clipping_planes_pars_fragment:uu,clipping_planes_pars_vertex:fu,clipping_planes_vertex:du,color_fragment:pu,color_pars_fragment:mu,color_pars_vertex:gu,color_vertex:xu,common:_u,cube_uv_reflection_fragment:vu,defaultnormal_vertex:yu,displacementmap_pars_vertex:Mu,displacementmap_vertex:bu,emissivemap_fragment:Su,emissivemap_pars_fragment:wu,colorspace_fragment:Au,colorspace_pars_fragment:Tu,envmap_fragment:Eu,envmap_common_pars_fragment:Cu,envmap_pars_fragment:Ru,envmap_pars_vertex:Iu,envmap_physical_pars_fragment:Vu,envmap_vertex:Pu,fog_vertex:Du,fog_pars_vertex:Lu,fog_fragment:Uu,fog_pars_fragment:Nu,gradientmap_pars_fragment:Fu,lightmap_pars_fragment:Ou,lights_lambert_fragment:Bu,lights_lambert_pars_fragment:zu,lights_pars_begin:ku,lights_toon_fragment:Gu,lights_toon_pars_fragment:Hu,lights_phong_fragment:Wu,lights_phong_pars_fragment:Xu,lights_physical_fragment:qu,lights_physical_pars_fragment:Yu,lights_fragment_begin:Zu,lights_fragment_maps:Ju,lights_fragment_end:$u,logdepthbuf_fragment:Ku,logdepthbuf_pars_fragment:Qu,logdepthbuf_pars_vertex:ju,logdepthbuf_vertex:tf,map_fragment:ef,map_pars_fragment:nf,map_particle_fragment:sf,map_particle_pars_fragment:rf,metalnessmap_fragment:af,metalnessmap_pars_fragment:of,morphinstance_vertex:lf,morphcolor_vertex:cf,morphnormal_vertex:hf,morphtarget_pars_vertex:uf,morphtarget_vertex:ff,normal_fragment_begin:df,normal_fragment_maps:pf,normal_pars_fragment:mf,normal_pars_vertex:gf,normal_vertex:xf,normalmap_pars_fragment:_f,clearcoat_normal_fragment_begin:vf,clearcoat_normal_fragment_maps:yf,clearcoat_pars_fragment:Mf,iridescence_pars_fragment:bf,opaque_fragment:Sf,packing:wf,premultiplied_alpha_fragment:Af,project_vertex:Tf,dithering_fragment:Ef,dithering_pars_fragment:Cf,roughnessmap_fragment:Rf,roughnessmap_pars_fragment:If,shadowmap_pars_fragment:Pf,shadowmap_pars_vertex:Df,shadowmap_vertex:Lf,shadowmask_pars_fragment:Uf,skinbase_vertex:Nf,skinning_pars_vertex:Ff,skinning_vertex:Of,skinnormal_vertex:Bf,specularmap_fragment:zf,specularmap_pars_fragment:kf,tonemapping_fragment:Vf,tonemapping_pars_fragment:Gf,transmission_fragment:Hf,transmission_pars_fragment:Wf,uv_pars_fragment:Xf,uv_pars_vertex:qf,uv_vertex:Yf,worldpos_vertex:Zf,background_vert:Jf,background_frag:$f,backgroundCube_vert:Kf,backgroundCube_frag:Qf,cube_vert:jf,cube_frag:td,depth_vert:ed,depth_frag:nd,distance_vert:id,distance_frag:sd,equirect_vert:rd,equirect_frag:ad,linedashed_vert:od,linedashed_frag:ld,meshbasic_vert:cd,meshbasic_frag:hd,meshlambert_vert:ud,meshlambert_frag:fd,meshmatcap_vert:dd,meshmatcap_frag:pd,meshnormal_vert:md,meshnormal_frag:gd,meshphong_vert:xd,meshphong_frag:_d,meshphysical_vert:vd,meshphysical_frag:yd,meshtoon_vert:Md,meshtoon_frag:bd,points_vert:Sd,points_frag:wd,shadow_vert:Ad,shadow_frag:Td,sprite_vert:Ed,sprite_frag:Cd},St={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},vn={basic:{uniforms:Pe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Pe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Pe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Pe([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Pe([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Pe([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Pe([St.points,St.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Pe([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Pe([St.common,St.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Pe([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Pe([St.sprite,St.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distance:{uniforms:Pe([St.common,St.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distance_vert,fragmentShader:Jt.distance_frag},shadow:{uniforms:Pe([St.lights,St.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};vn.physical={uniforms:Pe([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};var Ya={r:0,b:0,g:0},di=new rn,Rd=new oe;function Id(i,t,e,n,s,r,a){let o=new Ht(0),c=r===!0?0:1,l,u,h=null,d=0,p=null;function y(g){let I=g.isScene===!0?g.background:null;return I&&I.isTexture&&(I=(g.backgroundBlurriness>0?e:t).get(I)),I}function w(g){let I=!1,L=y(g);L===null?f(o,c):L&&L.isColor&&(f(L,1),I=!0);let U=i.xr.getEnvironmentBlendMode();U==="additive"?n.buffers.color.setClear(0,0,0,1,a):U==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||I)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(g,I){let L=y(I);L&&(L.isCubeTexture||L.mapping===zs)?(u===void 0&&(u=new ge(new an(1,1,1),new Fe({name:"BackgroundCubeMaterial",uniforms:fi(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(U,F,H){this.matrixWorld.copyPosition(H.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),di.copy(I.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),u.material.uniforms.envMap.value=L,u.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Rd.makeRotationFromEuler(di)),u.material.toneMapped=jt.getTransfer(L.colorSpace)!==ee,(h!==L||d!==L.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=L,d=L.version,p=i.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):L&&L.isTexture&&(l===void 0&&(l=new ge(new Xn(2,2),new Fe({name:"BackgroundMaterial",uniforms:fi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=L,l.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,l.material.toneMapped=jt.getTransfer(L.colorSpace)!==ee,L.matrixAutoUpdate===!0&&L.updateMatrix(),l.material.uniforms.uvTransform.value.copy(L.matrix),(h!==L||d!==L.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,h=L,d=L.version,p=i.toneMapping),l.layers.enableAll(),g.unshift(l,l.geometry,l.material,0,0,null))}function f(g,I){g.getRGB(Ya,tl(i)),n.buffers.color.setClear(Ya.r,Ya.g,Ya.b,I,a)}function P(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(g,I=1){o.set(g),c=I,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(g){c=g,f(o,c)},render:w,addToRenderList:m,dispose:P}}function Pd(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(T,B,W,X,tt){let ot=!1,Q=h(X,W,B);r!==Q&&(r=Q,l(r.object)),ot=p(T,X,W,tt),ot&&y(T,X,W,tt),tt!==null&&t.update(tt,i.ELEMENT_ARRAY_BUFFER),(ot||a)&&(a=!1,I(T,B,W,X),tt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(tt).buffer))}function c(){return i.createVertexArray()}function l(T){return i.bindVertexArray(T)}function u(T){return i.deleteVertexArray(T)}function h(T,B,W){let X=W.wireframe===!0,tt=n[T.id];tt===void 0&&(tt={},n[T.id]=tt);let ot=tt[B.id];ot===void 0&&(ot={},tt[B.id]=ot);let Q=ot[X];return Q===void 0&&(Q=d(c()),ot[X]=Q),Q}function d(T){let B=[],W=[],X=[];for(let tt=0;tt<e;tt++)B[tt]=0,W[tt]=0,X[tt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:W,attributeDivisors:X,object:T,attributes:{},index:null}}function p(T,B,W,X){let tt=r.attributes,ot=B.attributes,Q=0,nt=W.getAttributes();for(let dt in nt)if(nt[dt].location>=0){let Mt=tt[dt],Rt=ot[dt];if(Rt===void 0&&(dt==="instanceMatrix"&&T.instanceMatrix&&(Rt=T.instanceMatrix),dt==="instanceColor"&&T.instanceColor&&(Rt=T.instanceColor)),Mt===void 0||Mt.attribute!==Rt||Rt&&Mt.data!==Rt.data)return!0;Q++}return r.attributesNum!==Q||r.index!==X}function y(T,B,W,X){let tt={},ot=B.attributes,Q=0,nt=W.getAttributes();for(let dt in nt)if(nt[dt].location>=0){let Mt=ot[dt];Mt===void 0&&(dt==="instanceMatrix"&&T.instanceMatrix&&(Mt=T.instanceMatrix),dt==="instanceColor"&&T.instanceColor&&(Mt=T.instanceColor));let Rt={};Rt.attribute=Mt,Mt&&Mt.data&&(Rt.data=Mt.data),tt[dt]=Rt,Q++}r.attributes=tt,r.attributesNum=Q,r.index=X}function w(){let T=r.newAttributes;for(let B=0,W=T.length;B<W;B++)T[B]=0}function m(T){f(T,0)}function f(T,B){let W=r.newAttributes,X=r.enabledAttributes,tt=r.attributeDivisors;W[T]=1,X[T]===0&&(i.enableVertexAttribArray(T),X[T]=1),tt[T]!==B&&(i.vertexAttribDivisor(T,B),tt[T]=B)}function P(){let T=r.newAttributes,B=r.enabledAttributes;for(let W=0,X=B.length;W<X;W++)B[W]!==T[W]&&(i.disableVertexAttribArray(W),B[W]=0)}function g(T,B,W,X,tt,ot,Q){Q===!0?i.vertexAttribIPointer(T,B,W,tt,ot):i.vertexAttribPointer(T,B,W,X,tt,ot)}function I(T,B,W,X){w();let tt=X.attributes,ot=W.getAttributes(),Q=B.defaultAttributeValues;for(let nt in ot){let dt=ot[nt];if(dt.location>=0){let Et=tt[nt];if(Et===void 0&&(nt==="instanceMatrix"&&T.instanceMatrix&&(Et=T.instanceMatrix),nt==="instanceColor"&&T.instanceColor&&(Et=T.instanceColor)),Et!==void 0){let Mt=Et.normalized,Rt=Et.itemSize,Yt=t.get(Et);if(Yt===void 0)continue;let Vt=Yt.buffer,ce=Yt.type,re=Yt.bytesPerElement,x=ce===i.INT||ce===i.UNSIGNED_INT||Et.gpuType===aa;if(Et.isInterleavedBufferAttribute){let v=Et.data,b=v.stride,M=Et.offset;if(v.isInstancedInterleavedBuffer){for(let C=0;C<dt.locationSize;C++)f(dt.location+C,v.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=v.meshPerAttribute*v.count)}else for(let C=0;C<dt.locationSize;C++)m(dt.location+C);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let C=0;C<dt.locationSize;C++)g(dt.location+C,Rt/dt.locationSize,ce,Mt,b*re,(M+Rt/dt.locationSize*C)*re,x)}else{if(Et.isInstancedBufferAttribute){for(let v=0;v<dt.locationSize;v++)f(dt.location+v,Et.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=Et.meshPerAttribute*Et.count)}else for(let v=0;v<dt.locationSize;v++)m(dt.location+v);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let v=0;v<dt.locationSize;v++)g(dt.location+v,Rt/dt.locationSize,ce,Mt,Rt*re,Rt/dt.locationSize*v*re,x)}}else if(Q!==void 0){let Mt=Q[nt];if(Mt!==void 0)switch(Mt.length){case 2:i.vertexAttrib2fv(dt.location,Mt);break;case 3:i.vertexAttrib3fv(dt.location,Mt);break;case 4:i.vertexAttrib4fv(dt.location,Mt);break;default:i.vertexAttrib1fv(dt.location,Mt)}}}}P()}function L(){H();for(let T in n){let B=n[T];for(let W in B){let X=B[W];for(let tt in X)u(X[tt].object),delete X[tt];delete B[W]}delete n[T]}}function U(T){if(n[T.id]===void 0)return;let B=n[T.id];for(let W in B){let X=B[W];for(let tt in X)u(X[tt].object),delete X[tt];delete B[W]}delete n[T.id]}function F(T){for(let B in n){let W=n[B];if(W[T.id]===void 0)continue;let X=W[T.id];for(let tt in X)u(X[tt].object),delete X[tt];delete W[T.id]}}function H(){S(),a=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:H,resetDefaultState:S,dispose:L,releaseStatesOfGeometry:U,releaseStatesOfProgram:F,initAttributes:w,enableAttribute:m,disableUnusedAttributes:P}}function Dd(i,t,e){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function a(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),e.update(u,n,h))}function o(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let p=0;for(let y=0;y<h;y++)p+=u[y];e.update(p,n,1)}function c(l,u,h,d){if(h===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<l.length;y++)a(l[y],u[y],d[y]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let y=0;for(let w=0;w<h;w++)y+=u[w]*d[w];e.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Ld(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let F=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(F){return!(F!==je&&n.convert(F)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(F){let H=F===xn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(F!==Ge&&n.convert(F)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==Qe&&!H)}function c(F){if(F==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",u=c(l);u!==l&&(Gt("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),P=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),g=i.getParameter(i.MAX_VARYING_VECTORS),I=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=i.getParameter(i.MAX_SAMPLES),U=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:y,maxTextureSize:w,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:P,maxVaryings:g,maxFragmentUniforms:I,maxSamples:L,samples:U}}function Ud(i){let t=this,e=null,n=0,s=!1,r=!1,a=new cn,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let p=h.length!==0||d||n!==0||s;return s=d,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){let y=h.clippingPlanes,w=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||y===null||y.length===0||r&&!m)r?u(null):l();else{let P=r?0:n,g=P*4,I=f.clippingState||null;c.value=I,I=u(y,d,g,p);for(let L=0;L!==g;++L)I[L]=e[L];f.clippingState=I,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=P}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,p,y){let w=h!==null?h.length:0,m=null;if(w!==0){if(m=c.value,y!==!0||m===null){let f=p+w*4,P=d.matrixWorldInverse;o.getNormalMatrix(P),(m===null||m.length<f)&&(m=new Float32Array(f));for(let g=0,I=p;g!==w;++g,I+=4)a.copy(h[g]).applyMatrix4(P,o),a.normal.toArray(m,I),m[I+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=w,t.numIntersection=0,m}}function Nd(i){let t=new WeakMap;function e(a,o){return o===ia?a.mapping=Zn:o===sa&&(a.mapping=ci),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===ia||o===sa)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Ms(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Kn=4,Uc=[.125,.215,.35,.446,.526,.582],mi=20,Fd=256,Xs=new qi,Nc=new Ht,sl=null,rl=0,al=0,ol=!1,Od=new V,Ja=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=Od}=r;sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),al=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(sl,rl,al),this._renderer.xr.enabled=ol,t.scissorTest=!1,$i(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zn||t.mapping===ci?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),sl=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),al=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ae,minFilter:Ae,generateMipmaps:!1,type:xn,format:je,colorSpace:oi,depthBuffer:!1},s=Fc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fc(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Bd(r)),this._blurMaterial=kd(r,t,e),this._ggxMaterial=zd(r,t,e)}return s}_compileMaterial(t){let e=new ge(new ye,t);this._renderer.compile(e,Xs)}_sceneToCubeUV(t,e,n,s,r){let c=new we(90,1,e,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(Nc),h.toneMapping=on,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ge(new an,new mn({name:"PMREM.Background",side:Oe,depthWrite:!1,depthTest:!1})));let w=this._backgroundBox,m=w.material,f=!1,P=t.background;P?P.isColor&&(m.color.copy(P),t.background=null,f=!0):(m.color.copy(Nc),f=!0);for(let g=0;g<6;g++){let I=g%3;I===0?(c.up.set(0,l[g],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[g],r.y,r.z)):I===1?(c.up.set(0,0,l[g]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[g],r.z)):(c.up.set(0,l[g],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[g]));let L=this._cubeSize;$i(s,I*L,g>2?L:0,L,L),h.setRenderTarget(s),f&&h.render(w,c),h.render(t,c)}h.toneMapping=p,h.autoClear=d,t.background=P}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Zn||t.mapping===ci;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oc());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;$i(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Xs)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),u=e/(this._lodMeshes.length-1),h=Math.sqrt(l*l-u*u),d=0+l*1.25,p=h*d,{_lodMax:y}=this,w=this._sizeLods[n],m=3*w*(n>y-Kn?n-y+Kn:0),f=4*(this._cubeSize-w);c.envMap.value=t.texture,c.roughness.value=p,c.mipInt.value=y-e,$i(r,m,f,3*w,2*w),s.setRenderTarget(r),s.render(o,Xs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=y-n,$i(t,m,f,3*w,2*w),s.setRenderTarget(t),s.render(o,Xs)}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&zt("blur direction must be either latitudinal or longitudinal!");let u=3,h=this._lodMeshes[s];h.material=l;let d=l.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*mi-1),w=r/y,m=isFinite(r)?1+Math.floor(u*w):mi;m>mi&&Gt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);let f=[],P=0;for(let F=0;F<mi;++F){let H=F/w,S=Math.exp(-H*H/2);f.push(S),F===0?P+=S:F<m&&(P+=2*S)}for(let F=0;F<f.length;F++)f[F]=f[F]/P;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:g}=this;d.dTheta.value=y,d.mipInt.value=g-n;let I=this._sizeLods[s],L=3*I*(s>g-Kn?s-g+Kn:0),U=4*(this._cubeSize-I);$i(e,L,U,3*I,2*I),c.setRenderTarget(e),c.render(h,Xs)}};function Bd(i){let t=[],e=[],n=[],s=i,r=i-Kn+1+Uc.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Kn?c=Uc[a-i+Kn-1]:a===0&&(c=0),e.push(c);let l=1/(o-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,y=6,w=3,m=2,f=1,P=new Float32Array(w*y*p),g=new Float32Array(m*y*p),I=new Float32Array(f*y*p);for(let U=0;U<p;U++){let F=U%3*2/3-1,H=U>2?0:-1,S=[F,H,0,F+2/3,H,0,F+2/3,H+1,0,F,H,0,F+2/3,H+1,0,F,H+1,0];P.set(S,w*y*U),g.set(d,m*y*U);let T=[U,U,U,U,U,U];I.set(T,f*y*U)}let L=new ye;L.setAttribute("position",new _e(P,w)),L.setAttribute("uv",new _e(g,m)),L.setAttribute("faceIndex",new _e(I,f)),n.push(new ge(L,null)),s>Kn&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Fc(i,t,e){let n=new Ye(i,t,e);return n.texture.mapping=zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $i(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function zd(i,t,e){return new Fe({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Fd,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ka(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function kd(i,t,e){let n=new Float32Array(mi),s=new V(0,1,0);return new Fe({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ka(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Oc(){return new Fe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ka(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Bc(){return new Fe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ka(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Ka(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Vd(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===ia||c===sa,u=c===Zn||c===ci;if(l||u){let h=t.get(o),d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Ja(i)),h=l?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{let p=o.image;return l&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new Ja(i)),h=l?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0,l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Gd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&zi("WebGLRenderer: "+n+" extension not supported."),s}}}function Hd(i,t,e,n){let s={},r=new WeakMap;function a(h){let d=h.target;d.index!==null&&t.remove(d.index);for(let y in d.attributes)t.remove(d.attributes[y]);d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(h){let d=h.attributes;for(let p in d)t.update(d[p],i.ARRAY_BUFFER)}function l(h){let d=[],p=h.index,y=h.attributes.position,w=0;if(p!==null){let P=p.array;w=p.version;for(let g=0,I=P.length;g<I;g+=3){let L=P[g+0],U=P[g+1],F=P[g+2];d.push(L,U,U,F,F,L)}}else if(y!==void 0){let P=y.array;w=y.version;for(let g=0,I=P.length/3-1;g<I;g+=3){let L=g+0,U=g+1,F=g+2;d.push(L,U,U,F,F,L)}}else return;let m=new(jo(d)?_s:xs)(d,1);m.version=w;let f=r.get(h);f&&t.remove(f),r.set(h,m)}function u(h){let d=r.get(h);if(d){let p=h.index;p!==null&&d.version<p.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function Wd(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,p){i.drawElements(n,p,r,d*a),e.update(p,n,1)}function l(d,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,d*a,y),e.update(p,n,y))}function u(d,p,y){if(y===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,y);let m=0;for(let f=0;f<y;f++)m+=p[f];e.update(m,n,1)}function h(d,p,y,w){if(y===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/a,p[f],w[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,w,0,y);let f=0;for(let P=0;P<y;P++)f+=p[P]*w[P];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Xd(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:zt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function qd(i,t,e){let n=new WeakMap,s=new de;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(o);if(d===void 0||d.count!==h){let S=function(){F.dispose(),n.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,w=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],P=o.morphAttributes.color||[],g=0;p===!0&&(g=1),y===!0&&(g=2),w===!0&&(g=3);let I=o.attributes.position.count*g,L=1;I>t.maxTextureSize&&(L=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);let U=new Float32Array(I*L*4*h),F=new ps(U,I,L,h);F.type=Qe,F.needsUpdate=!0;let H=g*4;for(let T=0;T<h;T++){let B=m[T],W=f[T],X=P[T],tt=I*L*4*T;for(let ot=0;ot<B.count;ot++){let Q=ot*H;p===!0&&(s.fromBufferAttribute(B,ot),U[tt+Q+0]=s.x,U[tt+Q+1]=s.y,U[tt+Q+2]=s.z,U[tt+Q+3]=0),y===!0&&(s.fromBufferAttribute(W,ot),U[tt+Q+4]=s.x,U[tt+Q+5]=s.y,U[tt+Q+6]=s.z,U[tt+Q+7]=0),w===!0&&(s.fromBufferAttribute(X,ot),U[tt+Q+8]=s.x,U[tt+Q+9]=s.y,U[tt+Q+10]=s.z,U[tt+Q+11]=X.itemSize===4?s.w:1)}}d={count:h,texture:F,size:new Xt(I,L)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let p=0;for(let w=0;w<l.length;w++)p+=l[w];let y=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Yd(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==l&&(t.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var Zd={[Bo]:"LINEAR_TONE_MAPPING",[zo]:"REINHARD_TONE_MAPPING",[ko]:"CINEON_TONE_MAPPING",[Bs]:"ACES_FILMIC_TONE_MAPPING",[Go]:"AGX_TONE_MAPPING",[Ho]:"NEUTRAL_TONE_MAPPING",[Vo]:"CUSTOM_TONE_MAPPING"};function Jd(i,t,e,n,s){let r=new Ye(t,e,{type:i,depthBuffer:n,stencilBuffer:s}),a=new Ye(t,e,{type:xn,depthBuffer:!1,stencilBuffer:!1}),o=new ye;o.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new le([0,2,0,0,2,0],2));let c=new Ur({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new ge(o,c),u=new qi(-1,1,1,-1,0,1),h=null,d=null,p=!1,y,w=null,m=[],f=!1;this.setSize=function(P,g){r.setSize(P,g),a.setSize(P,g);for(let I=0;I<m.length;I++){let L=m[I];L.setSize&&L.setSize(P,g)}},this.setEffects=function(P){m=P,f=m.length>0&&m[0].isRenderPass===!0;let g=r.width,I=r.height;for(let L=0;L<m.length;L++){let U=m[L];U.setSize&&U.setSize(g,I)}},this.begin=function(P,g){if(p||P.toneMapping===on&&m.length===0)return!1;if(w=g,g!==null){let I=g.width,L=g.height;(r.width!==I||r.height!==L)&&this.setSize(I,L)}return f===!1&&P.setRenderTarget(r),y=P.toneMapping,P.toneMapping=on,!0},this.hasRenderPass=function(){return f},this.end=function(P,g){P.toneMapping=y,p=!0;let I=r,L=a;for(let U=0;U<m.length;U++){let F=m[U];if(F.enabled!==!1&&(F.render(P,L,I,g),F.needsSwap!==!1)){let H=I;I=L,L=H}}if(h!==P.outputColorSpace||d!==P.toneMapping){h=P.outputColorSpace,d=P.toneMapping,c.defines={},jt.getTransfer(h)===ee&&(c.defines.SRGB_TRANSFER="");let U=Zd[d];U&&(c.defines[U]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=I.texture,P.setRenderTarget(w),P.render(l,u),w=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),c.dispose()}}var ih=new Ne,hl=new Hn(1,1),sh=new ps,rh=new Rr,ah=new ys,zc=[],kc=[],Vc=new Float32Array(16),Gc=new Float32Array(9),Hc=new Float32Array(4);function Qi(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=zc[s];if(r===void 0&&(r=new Float32Array(s),zc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Qa(i,t){let e=kc[t];e===void 0&&(e=new Int32Array(t),kc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function $d(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Kd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function Qd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Me(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function jd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function tp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;Hc.set(n),i.uniformMatrix2fv(this.addr,!1,Hc),be(e,n)}}function ep(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;Gc.set(n),i.uniformMatrix3fv(this.addr,!1,Gc),be(e,n)}}function np(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;Vc.set(n),i.uniformMatrix4fv(this.addr,!1,Vc),be(e,n)}}function ip(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function sp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function rp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function ap(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function op(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function lp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function cp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function hp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function up(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(hl.compareFunction=e.isReversedDepthBuffer()?qa:Xa,r=hl):r=ih,e.setTexture2D(t||r,s)}function fp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||rh,s)}function dp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ah,s)}function pp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||sh,s)}function mp(i){switch(i){case 5126:return $d;case 35664:return Kd;case 35665:return Qd;case 35666:return jd;case 35674:return tp;case 35675:return ep;case 35676:return np;case 5124:case 35670:return ip;case 35667:case 35671:return sp;case 35668:case 35672:return rp;case 35669:case 35673:return ap;case 5125:return op;case 36294:return lp;case 36295:return cp;case 36296:return hp;case 35678:case 36198:case 36298:case 36306:case 35682:return up;case 35679:case 36299:case 36307:return fp;case 35680:case 36300:case 36308:case 36293:return dp;case 36289:case 36303:case 36311:case 36292:return pp}}function gp(i,t){i.uniform1fv(this.addr,t)}function xp(i,t){let e=Qi(t,this.size,2);i.uniform2fv(this.addr,e)}function _p(i,t){let e=Qi(t,this.size,3);i.uniform3fv(this.addr,e)}function vp(i,t){let e=Qi(t,this.size,4);i.uniform4fv(this.addr,e)}function yp(i,t){let e=Qi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Mp(i,t){let e=Qi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bp(i,t){let e=Qi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Sp(i,t){i.uniform1iv(this.addr,t)}function wp(i,t){i.uniform2iv(this.addr,t)}function Ap(i,t){i.uniform3iv(this.addr,t)}function Tp(i,t){i.uniform4iv(this.addr,t)}function Ep(i,t){i.uniform1uiv(this.addr,t)}function Cp(i,t){i.uniform2uiv(this.addr,t)}function Rp(i,t){i.uniform3uiv(this.addr,t)}function Ip(i,t){i.uniform4uiv(this.addr,t)}function Pp(i,t,e){let n=this.cache,s=t.length,r=Qa(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=hl:a=ih;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function Dp(i,t,e){let n=this.cache,s=t.length,r=Qa(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||rh,r[a])}function Lp(i,t,e){let n=this.cache,s=t.length,r=Qa(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ah,r[a])}function Up(i,t,e){let n=this.cache,s=t.length,r=Qa(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||sh,r[a])}function Np(i){switch(i){case 5126:return gp;case 35664:return xp;case 35665:return _p;case 35666:return vp;case 35674:return yp;case 35675:return Mp;case 35676:return bp;case 5124:case 35670:return Sp;case 35667:case 35671:return wp;case 35668:case 35672:return Ap;case 35669:case 35673:return Tp;case 5125:return Ep;case 36294:return Cp;case 36295:return Rp;case 36296:return Ip;case 35678:case 36198:case 36298:case 36306:case 35682:return Pp;case 35679:case 36299:case 36307:return Dp;case 35680:case 36300:case 36308:case 36293:return Lp;case 36289:case 36303:case 36311:case 36292:return Up}}var ul=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=mp(e.type)}},fl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Np(e.type)}},dl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},ll=/(\w+)(\])?(\[|\.)?/g;function Wc(i,t){i.seq.push(t),i.map[t.id]=t}function Fp(i,t,e){let n=i.name,s=n.length;for(ll.lastIndex=0;;){let r=ll.exec(n),a=ll.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Wc(e,l===void 0?new ul(o,i,t):new fl(o,i,t));break}else{let h=e.map[o];h===void 0&&(h=new dl(o),Wc(e,h)),e=h}}}var Ki=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);Fp(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Xc(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Op=37297,Bp=0;function zp(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var qc=new qt;function kp(i){jt._getMatrix(qc,jt.workingColorSpace,i);let t=`mat3( ${qc.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(i)){case hs:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Yc(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+zp(i.getShaderSource(t),o)}else return r}function Vp(i,t){let e=kp(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Gp={[Bo]:"Linear",[zo]:"Reinhard",[ko]:"Cineon",[Bs]:"ACESFilmic",[Go]:"AgX",[Ho]:"Neutral",[Vo]:"Custom"};function Hp(i,t){let e=Gp[t];return e===void 0?(Gt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Za=new V;function Wp(){jt.getLuminanceCoefficients(Za);let i=Za.x.toFixed(4),t=Za.y.toFixed(4),e=Za.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ys).join(`
`)}function qp(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Yp(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ys(i){return i!==""}function Zc(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Zp=/^[ \t]*#include +<([\w\d./]+)>/gm;function pl(i){return i.replace(Zp,$p)}var Jp=new Map;function $p(i,t){let e=Jt[t];if(e===void 0){let n=Jp.get(t);if(n!==void 0)e=Jt[n],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return pl(e)}var Kp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $c(i){return i.replace(Kp,Qp)}function Qp(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var jp={[Os]:"SHADOWMAP_TYPE_PCF",[Yi]:"SHADOWMAP_TYPE_VSM"};function tm(i){return jp[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var em={[Zn]:"ENVMAP_TYPE_CUBE",[ci]:"ENVMAP_TYPE_CUBE",[zs]:"ENVMAP_TYPE_CUBE_UV"};function nm(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":em[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var im={[ci]:"ENVMAP_MODE_REFRACTION"};function sm(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":im[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var rm={[na]:"ENVMAP_BLENDING_MULTIPLY",[xc]:"ENVMAP_BLENDING_MIX",[_c]:"ENVMAP_BLENDING_ADD"};function am(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":rm[i.combine]||"ENVMAP_BLENDING_NONE"}function om(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function lm(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=tm(e),l=nm(e),u=sm(e),h=am(e),d=om(e),p=Xp(e),y=qp(r),w=s.createProgram(),m,f,P=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Ys).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y].filter(Ys).join(`
`),f.length>0&&(f+=`
`)):(m=[Kc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),f=[Kc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,y,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==on?"#define TONE_MAPPING":"",e.toneMapping!==on?Jt.tonemapping_pars_fragment:"",e.toneMapping!==on?Hp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,Vp("linearToOutputTexel",e.outputColorSpace),Wp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ys).join(`
`)),a=pl(a),a=Zc(a,e),a=Jc(a,e),o=pl(o),o=Zc(o,e),o=Jc(o,e),a=$c(a),o=$c(o),e.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Qo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Qo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let g=P+m+a,I=P+f+o,L=Xc(s,s.VERTEX_SHADER,g),U=Xc(s,s.FRAGMENT_SHADER,I);s.attachShader(w,L),s.attachShader(w,U),e.index0AttributeName!==void 0?s.bindAttribLocation(w,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(w,0,"position"),s.linkProgram(w);function F(B){if(i.debug.checkShaderErrors){let W=s.getProgramInfoLog(w)||"",X=s.getShaderInfoLog(L)||"",tt=s.getShaderInfoLog(U)||"",ot=W.trim(),Q=X.trim(),nt=tt.trim(),dt=!0,Et=!0;if(s.getProgramParameter(w,s.LINK_STATUS)===!1)if(dt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,w,L,U);else{let Mt=Yc(s,L,"vertex"),Rt=Yc(s,U,"fragment");zt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(w,s.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ot+`
`+Mt+`
`+Rt)}else ot!==""?Gt("WebGLProgram: Program Info Log:",ot):(Q===""||nt==="")&&(Et=!1);Et&&(B.diagnostics={runnable:dt,programLog:ot,vertexShader:{log:Q,prefix:m},fragmentShader:{log:nt,prefix:f}})}s.deleteShader(L),s.deleteShader(U),H=new Ki(s,w),S=Yp(s,w)}let H;this.getUniforms=function(){return H===void 0&&F(this),H};let S;this.getAttributes=function(){return S===void 0&&F(this),S};let T=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=s.getProgramParameter(w,Op)),T},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(w),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bp++,this.cacheKey=t,this.usedTimes=1,this.program=w,this.vertexShader=L,this.fragmentShader=U,this}var cm=0,ml=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new gl(t),e.set(t,n)),n}},gl=class{constructor(t){this.id=cm++,this.code=t,this.usedTimes=0}};function hm(i,t,e,n,s,r,a){let o=new gs,c=new ml,l=new Set,u=[],h=new Map,d=s.logarithmicDepthBuffer,p=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,T,B,W,X){let tt=W.fog,ot=X.geometry,Q=S.isMeshStandardMaterial?W.environment:null,nt=(S.isMeshStandardMaterial?e:t).get(S.envMap||Q),dt=nt&&nt.mapping===zs?nt.image.height:null,Et=y[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&Gt("WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let Mt=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,Rt=Mt!==void 0?Mt.length:0,Yt=0;ot.morphAttributes.position!==void 0&&(Yt=1),ot.morphAttributes.normal!==void 0&&(Yt=2),ot.morphAttributes.color!==void 0&&(Yt=3);let Vt,ce,re,x;if(Et){let At=vn[Et];Vt=At.vertexShader,ce=At.fragmentShader}else Vt=S.vertexShader,ce=S.fragmentShader,c.update(S),re=c.getVertexShaderID(S),x=c.getFragmentShaderID(S);let v=i.getRenderTarget(),b=i.state.buffers.depth.getReversed(),M=X.isInstancedMesh===!0,C=X.isBatchedMesh===!0,D=!!S.map,ft=!!S.matcap,lt=!!nt,xt=!!S.aoMap,yt=!!S.lightMap,gt=!!S.bumpMap,Ut=!!S.normalMap,N=!!S.displacementMap,Zt=!!S.emissiveMap,Wt=!!S.metalnessMap,Bt=!!S.roughnessMap,wt=S.anisotropy>0,E=S.clearcoat>0,_=S.dispersion>0,z=S.iridescence>0,et=S.sheen>0,$=S.transmission>0,j=wt&&!!S.anisotropyMap,q=E&&!!S.clearcoatMap,Y=E&&!!S.clearcoatNormalMap,pt=E&&!!S.clearcoatRoughnessMap,vt=z&&!!S.iridescenceMap,at=z&&!!S.iridescenceThicknessMap,ht=et&&!!S.sheenColorMap,Ct=et&&!!S.sheenRoughnessMap,Pt=!!S.specularMap,_t=!!S.specularColorMap,Dt=!!S.specularIntensityMap,O=$&&!!S.transmissionMap,ct=$&&!!S.thicknessMap,it=!!S.gradientMap,ut=!!S.alphaMap,st=S.alphaTest>0,rt=!!S.alphaHash,mt=!!S.extensions,R=on;S.toneMapped&&(v===null||v.isXRRenderTarget===!0)&&(R=i.toneMapping);let K={shaderID:Et,shaderType:S.type,shaderName:S.name,vertexShader:Vt,fragmentShader:ce,defines:S.defines,customVertexShaderID:re,customFragmentShaderID:x,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:C,batchingColor:C&&X._colorsTexture!==null,instancing:M,instancingColor:M&&X.instanceColor!==null,instancingMorph:M&&X.morphTexture!==null,outputColorSpace:v===null?i.outputColorSpace:v.isXRRenderTarget===!0?v.texture.colorSpace:oi,alphaToCoverage:!!S.alphaToCoverage,map:D,matcap:ft,envMap:lt,envMapMode:lt&&nt.mapping,envMapCubeUVHeight:dt,aoMap:xt,lightMap:yt,bumpMap:gt,normalMap:Ut,displacementMap:N,emissiveMap:Zt,normalMapObjectSpace:Ut&&S.normalMapType===Mc,normalMapTangentSpace:Ut&&S.normalMapType===Ko,metalnessMap:Wt,roughnessMap:Bt,anisotropy:wt,anisotropyMap:j,clearcoat:E,clearcoatMap:q,clearcoatNormalMap:Y,clearcoatRoughnessMap:pt,dispersion:_,iridescence:z,iridescenceMap:vt,iridescenceThicknessMap:at,sheen:et,sheenColorMap:ht,sheenRoughnessMap:Ct,specularMap:Pt,specularColorMap:_t,specularIntensityMap:Dt,transmission:$,transmissionMap:O,thicknessMap:ct,gradientMap:it,opaque:S.transparent===!1&&S.blending===ri&&S.alphaToCoverage===!1,alphaMap:ut,alphaTest:st,alphaHash:rt,combine:S.combine,mapUv:D&&w(S.map.channel),aoMapUv:xt&&w(S.aoMap.channel),lightMapUv:yt&&w(S.lightMap.channel),bumpMapUv:gt&&w(S.bumpMap.channel),normalMapUv:Ut&&w(S.normalMap.channel),displacementMapUv:N&&w(S.displacementMap.channel),emissiveMapUv:Zt&&w(S.emissiveMap.channel),metalnessMapUv:Wt&&w(S.metalnessMap.channel),roughnessMapUv:Bt&&w(S.roughnessMap.channel),anisotropyMapUv:j&&w(S.anisotropyMap.channel),clearcoatMapUv:q&&w(S.clearcoatMap.channel),clearcoatNormalMapUv:Y&&w(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pt&&w(S.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&w(S.iridescenceMap.channel),iridescenceThicknessMapUv:at&&w(S.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&w(S.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&w(S.sheenRoughnessMap.channel),specularMapUv:Pt&&w(S.specularMap.channel),specularColorMapUv:_t&&w(S.specularColorMap.channel),specularIntensityMapUv:Dt&&w(S.specularIntensityMap.channel),transmissionMapUv:O&&w(S.transmissionMap.channel),thicknessMapUv:ct&&w(S.thicknessMap.channel),alphaMapUv:ut&&w(S.alphaMap.channel),vertexTangents:!!ot.attributes.tangent&&(Ut||wt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!ot.attributes.uv&&(D||ut),fog:!!tt,useFog:S.fog===!0,fogExp2:!!tt&&tt.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:b,skinning:X.isSkinnedMesh===!0,morphTargets:ot.morphAttributes.position!==void 0,morphNormals:ot.morphAttributes.normal!==void 0,morphColors:ot.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:Yt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:R,decodeVideoTexture:D&&S.map.isVideoTexture===!0&&jt.getTransfer(S.map.colorSpace)===ee,decodeVideoTextureEmissive:Zt&&S.emissiveMap.isVideoTexture===!0&&jt.getTransfer(S.emissiveMap.colorSpace)===ee,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ie,flipSided:S.side===Oe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:mt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&S.extensions.multiDraw===!0||C)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return K.vertexUv1s=l.has(1),K.vertexUv2s=l.has(2),K.vertexUv3s=l.has(3),l.clear(),K}function f(S){let T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(let B in S.defines)T.push(B),T.push(S.defines[B]);return S.isRawShaderMaterial===!1&&(P(T,S),g(T,S),T.push(i.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function P(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function g(S,T){o.disableAll(),T.instancing&&o.enable(0),T.instancingColor&&o.enable(1),T.instancingMorph&&o.enable(2),T.matcap&&o.enable(3),T.envMap&&o.enable(4),T.normalMapObjectSpace&&o.enable(5),T.normalMapTangentSpace&&o.enable(6),T.clearcoat&&o.enable(7),T.iridescence&&o.enable(8),T.alphaTest&&o.enable(9),T.vertexColors&&o.enable(10),T.vertexAlphas&&o.enable(11),T.vertexUv1s&&o.enable(12),T.vertexUv2s&&o.enable(13),T.vertexUv3s&&o.enable(14),T.vertexTangents&&o.enable(15),T.anisotropy&&o.enable(16),T.alphaHash&&o.enable(17),T.batching&&o.enable(18),T.dispersion&&o.enable(19),T.batchingColor&&o.enable(20),T.gradientMap&&o.enable(21),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),S.push(o.mask)}function I(S){let T=y[S.type],B;if(T){let W=vn[T];B=Pc.clone(W.uniforms)}else B=S.uniforms;return B}function L(S,T){let B=h.get(T);return B!==void 0?++B.usedTimes:(B=new lm(i,T,S,r),u.push(B),h.set(T,B)),B}function U(S){if(--S.usedTimes===0){let T=u.indexOf(S);u[T]=u[u.length-1],u.pop(),h.delete(S.cacheKey),S.destroy()}}function F(S){c.remove(S)}function H(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:I,acquireProgram:L,releaseProgram:U,releaseShaderCache:F,programs:u,dispose:H}}function um(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function fm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Qc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function jc(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h,d,p,y,w,m){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:y,renderOrder:h.renderOrder,z:w,group:m},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=y,f.renderOrder=h.renderOrder,f.z=w,f.group=m),t++,f}function o(h,d,p,y,w,m){let f=a(h,d,p,y,w,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(h,d,p,y,w,m){let f=a(h,d,p,y,w,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(h,d){e.length>1&&e.sort(h||fm),n.length>1&&n.sort(d||Qc),s.length>1&&s.sort(d||Qc)}function u(){for(let h=t,d=i.length;h<d;h++){let p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:u,sort:l}}function dm(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new jc,i.set(n,[a])):s>=r.length?(a=new jc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function pm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Ht};break;case"SpotLight":e={position:new V,direction:new V,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new V,halfWidth:new V,halfHeight:new V};break}return i[t.id]=e,e}}}function mm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var gm=0;function xm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _m(i){let t=new pm,e=mm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new V);let s=new V,r=new oe,a=new oe;function o(l){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,y=0,w=0,m=0,f=0,P=0,g=0,I=0,L=0,U=0,F=0;l.sort(xm);for(let S=0,T=l.length;S<T;S++){let B=l[S],W=B.color,X=B.intensity,tt=B.distance,ot=null;if(B.shadow&&B.shadow.map&&(B.shadow.map.texture.format===hi?ot=B.shadow.map.texture:ot=B.shadow.map.depthTexture||B.shadow.map.texture),B.isAmbientLight)u+=W.r*X,h+=W.g*X,d+=W.b*X;else if(B.isLightProbe){for(let Q=0;Q<9;Q++)n.probe[Q].addScaledVector(B.sh.coefficients[Q],X);F++}else if(B.isDirectionalLight){let Q=t.get(B);if(Q.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let nt=B.shadow,dt=e.get(B);dt.shadowIntensity=nt.intensity,dt.shadowBias=nt.bias,dt.shadowNormalBias=nt.normalBias,dt.shadowRadius=nt.radius,dt.shadowMapSize=nt.mapSize,n.directionalShadow[p]=dt,n.directionalShadowMap[p]=ot,n.directionalShadowMatrix[p]=B.shadow.matrix,P++}n.directional[p]=Q,p++}else if(B.isSpotLight){let Q=t.get(B);Q.position.setFromMatrixPosition(B.matrixWorld),Q.color.copy(W).multiplyScalar(X),Q.distance=tt,Q.coneCos=Math.cos(B.angle),Q.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),Q.decay=B.decay,n.spot[w]=Q;let nt=B.shadow;if(B.map&&(n.spotLightMap[L]=B.map,L++,nt.updateMatrices(B),B.castShadow&&U++),n.spotLightMatrix[w]=nt.matrix,B.castShadow){let dt=e.get(B);dt.shadowIntensity=nt.intensity,dt.shadowBias=nt.bias,dt.shadowNormalBias=nt.normalBias,dt.shadowRadius=nt.radius,dt.shadowMapSize=nt.mapSize,n.spotShadow[w]=dt,n.spotShadowMap[w]=ot,I++}w++}else if(B.isRectAreaLight){let Q=t.get(B);Q.color.copy(W).multiplyScalar(X),Q.halfWidth.set(B.width*.5,0,0),Q.halfHeight.set(0,B.height*.5,0),n.rectArea[m]=Q,m++}else if(B.isPointLight){let Q=t.get(B);if(Q.color.copy(B.color).multiplyScalar(B.intensity),Q.distance=B.distance,Q.decay=B.decay,B.castShadow){let nt=B.shadow,dt=e.get(B);dt.shadowIntensity=nt.intensity,dt.shadowBias=nt.bias,dt.shadowNormalBias=nt.normalBias,dt.shadowRadius=nt.radius,dt.shadowMapSize=nt.mapSize,dt.shadowCameraNear=nt.camera.near,dt.shadowCameraFar=nt.camera.far,n.pointShadow[y]=dt,n.pointShadowMap[y]=ot,n.pointShadowMatrix[y]=B.shadow.matrix,g++}n.point[y]=Q,y++}else if(B.isHemisphereLight){let Q=t.get(B);Q.skyColor.copy(B.color).multiplyScalar(X),Q.groundColor.copy(B.groundColor).multiplyScalar(X),n.hemi[f]=Q,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let H=n.hash;(H.directionalLength!==p||H.pointLength!==y||H.spotLength!==w||H.rectAreaLength!==m||H.hemiLength!==f||H.numDirectionalShadows!==P||H.numPointShadows!==g||H.numSpotShadows!==I||H.numSpotMaps!==L||H.numLightProbes!==F)&&(n.directional.length=p,n.spot.length=w,n.rectArea.length=m,n.point.length=y,n.hemi.length=f,n.directionalShadow.length=P,n.directionalShadowMap.length=P,n.pointShadow.length=g,n.pointShadowMap.length=g,n.spotShadow.length=I,n.spotShadowMap.length=I,n.directionalShadowMatrix.length=P,n.pointShadowMatrix.length=g,n.spotLightMatrix.length=I+L-U,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=U,n.numLightProbes=F,H.directionalLength=p,H.pointLength=y,H.spotLength=w,H.rectAreaLength=m,H.hemiLength=f,H.numDirectionalShadows=P,H.numPointShadows=g,H.numSpotShadows=I,H.numSpotMaps=L,H.numLightProbes=F,n.version=gm++)}function c(l,u){let h=0,d=0,p=0,y=0,w=0,m=u.matrixWorldInverse;for(let f=0,P=l.length;f<P;f++){let g=l[f];if(g.isDirectionalLight){let I=n.directional[h];I.direction.setFromMatrixPosition(g.matrixWorld),s.setFromMatrixPosition(g.target.matrixWorld),I.direction.sub(s),I.direction.transformDirection(m),h++}else if(g.isSpotLight){let I=n.spot[p];I.position.setFromMatrixPosition(g.matrixWorld),I.position.applyMatrix4(m),I.direction.setFromMatrixPosition(g.matrixWorld),s.setFromMatrixPosition(g.target.matrixWorld),I.direction.sub(s),I.direction.transformDirection(m),p++}else if(g.isRectAreaLight){let I=n.rectArea[y];I.position.setFromMatrixPosition(g.matrixWorld),I.position.applyMatrix4(m),a.identity(),r.copy(g.matrixWorld),r.premultiply(m),a.extractRotation(r),I.halfWidth.set(g.width*.5,0,0),I.halfHeight.set(0,g.height*.5,0),I.halfWidth.applyMatrix4(a),I.halfHeight.applyMatrix4(a),y++}else if(g.isPointLight){let I=n.point[d];I.position.setFromMatrixPosition(g.matrixWorld),I.position.applyMatrix4(m),d++}else if(g.isHemisphereLight){let I=n.hemi[w];I.direction.setFromMatrixPosition(g.matrixWorld),I.direction.transformDirection(m),w++}}}return{setup:o,setupView:c,state:n}}function th(i){let t=new _m(i),e=[],n=[];function s(u){l.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function a(u){n.push(u)}function o(){t.setup(e)}function c(u){t.setupView(e,u)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function vm(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new th(i),t.set(s,[o])):r>=a.length?(o=new th(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var ym=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bm=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Sm=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],eh=new oe,qs=new V,cl=new V;function wm(i,t,e){let n=new Gi,s=new Xt,r=new Xt,a=new de,o=new Nr,c=new Fr,l={},u=e.maxTextureSize,h={[En]:Oe,[Oe]:En,[Ie]:Ie},d=new Fe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:ym,fragmentShader:Mm}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let y=new ye;y.setAttribute("position",new _e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let w=new ge(y,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Os;let f=this.type;this.render=function(U,F,H){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||U.length===0)return;U.type===Zr&&(Gt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),U.type=Os);let S=i.getRenderTarget(),T=i.getActiveCubeFace(),B=i.getActiveMipmapLevel(),W=i.state;W.setBlending(gn),W.buffers.depth.getReversed()===!0?W.buffers.color.setClear(0,0,0,0):W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);let X=f!==this.type;X&&F.traverse(function(tt){tt.material&&(Array.isArray(tt.material)?tt.material.forEach(ot=>ot.needsUpdate=!0):tt.material.needsUpdate=!0)});for(let tt=0,ot=U.length;tt<ot;tt++){let Q=U[tt],nt=Q.shadow;if(nt===void 0){Gt("WebGLShadowMap:",Q,"has no shadow.");continue}if(nt.autoUpdate===!1&&nt.needsUpdate===!1)continue;s.copy(nt.mapSize);let dt=nt.getFrameExtents();if(s.multiply(dt),r.copy(nt.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/dt.x),s.x=r.x*dt.x,nt.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/dt.y),s.y=r.y*dt.y,nt.mapSize.y=r.y)),nt.map===null||X===!0){if(nt.map!==null&&(nt.map.depthTexture!==null&&(nt.map.depthTexture.dispose(),nt.map.depthTexture=null),nt.map.dispose()),this.type===Yi){if(Q.isPointLight){Gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}nt.map=new Ye(s.x,s.y,{format:hi,type:xn,minFilter:Ae,magFilter:Ae,generateMipmaps:!1}),nt.map.texture.name=Q.name+".shadowMap",nt.map.depthTexture=new Hn(s.x,s.y,Qe),nt.map.depthTexture.name=Q.name+".shadowMapDepth",nt.map.depthTexture.format=fn,nt.map.depthTexture.compareFunction=null,nt.map.depthTexture.minFilter=fe,nt.map.depthTexture.magFilter=fe}else{Q.isPointLight?(nt.map=new Ms(s.x),nt.map.depthTexture=new Lr(s.x,ln)):(nt.map=new Ye(s.x,s.y),nt.map.depthTexture=new Hn(s.x,s.y,ln)),nt.map.depthTexture.name=Q.name+".shadowMap",nt.map.depthTexture.format=fn;let Mt=i.state.buffers.depth.getReversed();this.type===Os?(nt.map.depthTexture.compareFunction=Mt?qa:Xa,nt.map.depthTexture.minFilter=Ae,nt.map.depthTexture.magFilter=Ae):(nt.map.depthTexture.compareFunction=null,nt.map.depthTexture.minFilter=fe,nt.map.depthTexture.magFilter=fe)}nt.camera.updateProjectionMatrix()}let Et=nt.map.isWebGLCubeRenderTarget?6:1;for(let Mt=0;Mt<Et;Mt++){if(nt.map.isWebGLCubeRenderTarget)i.setRenderTarget(nt.map,Mt),i.clear();else{Mt===0&&(i.setRenderTarget(nt.map),i.clear());let Rt=nt.getViewport(Mt);a.set(r.x*Rt.x,r.y*Rt.y,r.x*Rt.z,r.y*Rt.w),W.viewport(a)}if(Q.isPointLight){let Rt=nt.camera,Yt=nt.matrix,Vt=Q.distance||Rt.far;Vt!==Rt.far&&(Rt.far=Vt,Rt.updateProjectionMatrix()),qs.setFromMatrixPosition(Q.matrixWorld),Rt.position.copy(qs),cl.copy(Rt.position),cl.add(bm[Mt]),Rt.up.copy(Sm[Mt]),Rt.lookAt(cl),Rt.updateMatrixWorld(),Yt.makeTranslation(-qs.x,-qs.y,-qs.z),eh.multiplyMatrices(Rt.projectionMatrix,Rt.matrixWorldInverse),nt._frustum.setFromProjectionMatrix(eh,Rt.coordinateSystem,Rt.reversedDepth)}else nt.updateMatrices(Q);n=nt.getFrustum(),I(F,H,nt.camera,Q,this.type)}nt.isPointLightShadow!==!0&&this.type===Yi&&P(nt,H),nt.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,T,B)};function P(U,F){let H=t.update(w);d.defines.VSM_SAMPLES!==U.blurSamples&&(d.defines.VSM_SAMPLES=U.blurSamples,p.defines.VSM_SAMPLES=U.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),U.mapPass===null&&(U.mapPass=new Ye(s.x,s.y,{format:hi,type:xn})),d.uniforms.shadow_pass.value=U.map.depthTexture,d.uniforms.resolution.value=U.mapSize,d.uniforms.radius.value=U.radius,i.setRenderTarget(U.mapPass),i.clear(),i.renderBufferDirect(F,null,H,d,w,null),p.uniforms.shadow_pass.value=U.mapPass.texture,p.uniforms.resolution.value=U.mapSize,p.uniforms.radius.value=U.radius,i.setRenderTarget(U.map),i.clear(),i.renderBufferDirect(F,null,H,p,w,null)}function g(U,F,H,S){let T=null,B=H.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(B!==void 0)T=B;else if(T=H.isPointLight===!0?c:o,i.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){let W=T.uuid,X=F.uuid,tt=l[W];tt===void 0&&(tt={},l[W]=tt);let ot=tt[X];ot===void 0&&(ot=T.clone(),tt[X]=ot,F.addEventListener("dispose",L)),T=ot}if(T.visible=F.visible,T.wireframe=F.wireframe,S===Yi?T.side=F.shadowSide!==null?F.shadowSide:F.side:T.side=F.shadowSide!==null?F.shadowSide:h[F.side],T.alphaMap=F.alphaMap,T.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,T.map=F.map,T.clipShadows=F.clipShadows,T.clippingPlanes=F.clippingPlanes,T.clipIntersection=F.clipIntersection,T.displacementMap=F.displacementMap,T.displacementScale=F.displacementScale,T.displacementBias=F.displacementBias,T.wireframeLinewidth=F.wireframeLinewidth,T.linewidth=F.linewidth,H.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let W=i.properties.get(T);W.light=H}return T}function I(U,F,H,S,T){if(U.visible===!1)return;if(U.layers.test(F.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&T===Yi)&&(!U.frustumCulled||n.intersectsObject(U))){U.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,U.matrixWorld);let X=t.update(U),tt=U.material;if(Array.isArray(tt)){let ot=X.groups;for(let Q=0,nt=ot.length;Q<nt;Q++){let dt=ot[Q],Et=tt[dt.materialIndex];if(Et&&Et.visible){let Mt=g(U,Et,S,T);U.onBeforeShadow(i,U,F,H,X,Mt,dt),i.renderBufferDirect(H,null,X,Mt,U,dt),U.onAfterShadow(i,U,F,H,X,Mt,dt)}}}else if(tt.visible){let ot=g(U,tt,S,T);U.onBeforeShadow(i,U,F,H,X,ot,null),i.renderBufferDirect(H,null,X,ot,U,null),U.onAfterShadow(i,U,F,H,X,ot,null)}}let W=U.children;for(let X=0,tt=W.length;X<tt;X++)I(W[X],F,H,S,T)}function L(U){U.target.removeEventListener("dispose",L);for(let H in l){let S=l[H],T=U.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}var Am={[Jr]:$r,[Kr]:ta,[Qr]:ea,[ai]:jr,[$r]:Jr,[ta]:Kr,[ea]:Qr,[jr]:ai};function Tm(i,t){function e(){let O=!1,ct=new de,it=null,ut=new de(0,0,0,0);return{setMask:function(st){it!==st&&!O&&(i.colorMask(st,st,st,st),it=st)},setLocked:function(st){O=st},setClear:function(st,rt,mt,R,K){K===!0&&(st*=R,rt*=R,mt*=R),ct.set(st,rt,mt,R),ut.equals(ct)===!1&&(i.clearColor(st,rt,mt,R),ut.copy(ct))},reset:function(){O=!1,it=null,ut.set(-1,0,0,0)}}}function n(){let O=!1,ct=!1,it=null,ut=null,st=null;return{setReversed:function(rt){if(ct!==rt){let mt=t.get("EXT_clip_control");rt?mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.ZERO_TO_ONE_EXT):mt.clipControlEXT(mt.LOWER_LEFT_EXT,mt.NEGATIVE_ONE_TO_ONE_EXT),ct=rt;let R=st;st=null,this.setClear(R)}},getReversed:function(){return ct},setTest:function(rt){rt?v(i.DEPTH_TEST):b(i.DEPTH_TEST)},setMask:function(rt){it!==rt&&!O&&(i.depthMask(rt),it=rt)},setFunc:function(rt){if(ct&&(rt=Am[rt]),ut!==rt){switch(rt){case Jr:i.depthFunc(i.NEVER);break;case $r:i.depthFunc(i.ALWAYS);break;case Kr:i.depthFunc(i.LESS);break;case ai:i.depthFunc(i.LEQUAL);break;case Qr:i.depthFunc(i.EQUAL);break;case jr:i.depthFunc(i.GEQUAL);break;case ta:i.depthFunc(i.GREATER);break;case ea:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=rt}},setLocked:function(rt){O=rt},setClear:function(rt){st!==rt&&(ct&&(rt=1-rt),i.clearDepth(rt),st=rt)},reset:function(){O=!1,it=null,ut=null,st=null,ct=!1}}}function s(){let O=!1,ct=null,it=null,ut=null,st=null,rt=null,mt=null,R=null,K=null;return{setTest:function(At){O||(At?v(i.STENCIL_TEST):b(i.STENCIL_TEST))},setMask:function(At){ct!==At&&!O&&(i.stencilMask(At),ct=At)},setFunc:function(At,$t,Te){(it!==At||ut!==$t||st!==Te)&&(i.stencilFunc(At,$t,Te),it=At,ut=$t,st=Te)},setOp:function(At,$t,Te){(rt!==At||mt!==$t||R!==Te)&&(i.stencilOp(At,$t,Te),rt=At,mt=$t,R=Te)},setLocked:function(At){O=At},setClear:function(At){K!==At&&(i.clearStencil(At),K=At)},reset:function(){O=!1,ct=null,it=null,ut=null,st=null,rt=null,mt=null,R=null,K=null}}}let r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap,u={},h={},d=new WeakMap,p=[],y=null,w=!1,m=null,f=null,P=null,g=null,I=null,L=null,U=null,F=new Ht(0,0,0),H=0,S=!1,T=null,B=null,W=null,X=null,tt=null,ot=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Q=!1,nt=0,dt=i.getParameter(i.VERSION);dt.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(dt)[1]),Q=nt>=1):dt.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(dt)[1]),Q=nt>=2);let Et=null,Mt={},Rt=i.getParameter(i.SCISSOR_BOX),Yt=i.getParameter(i.VIEWPORT),Vt=new de().fromArray(Rt),ce=new de().fromArray(Yt);function re(O,ct,it,ut){let st=new Uint8Array(4),rt=i.createTexture();i.bindTexture(O,rt),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let mt=0;mt<it;mt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(ct+mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return rt}let x={};x[i.TEXTURE_2D]=re(i.TEXTURE_2D,i.TEXTURE_2D,1),x[i.TEXTURE_CUBE_MAP]=re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),x[i.TEXTURE_2D_ARRAY]=re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),x[i.TEXTURE_3D]=re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),v(i.DEPTH_TEST),a.setFunc(ai),gt(!1),Ut(No),v(i.CULL_FACE),xt(gn);function v(O){u[O]!==!0&&(i.enable(O),u[O]=!0)}function b(O){u[O]!==!1&&(i.disable(O),u[O]=!1)}function M(O,ct){return h[O]!==ct?(i.bindFramebuffer(O,ct),h[O]=ct,O===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ct),O===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function C(O,ct){let it=p,ut=!1;if(O){it=d.get(ct),it===void 0&&(it=[],d.set(ct,it));let st=O.textures;if(it.length!==st.length||it[0]!==i.COLOR_ATTACHMENT0){for(let rt=0,mt=st.length;rt<mt;rt++)it[rt]=i.COLOR_ATTACHMENT0+rt;it.length=st.length,ut=!0}}else it[0]!==i.BACK&&(it[0]=i.BACK,ut=!0);ut&&i.drawBuffers(it)}function D(O){return y!==O?(i.useProgram(O),y=O,!0):!1}let ft={[kn]:i.FUNC_ADD,[tc]:i.FUNC_SUBTRACT,[ec]:i.FUNC_REVERSE_SUBTRACT};ft[nc]=i.MIN,ft[ic]=i.MAX;let lt={[sc]:i.ZERO,[rc]:i.ONE,[ac]:i.SRC_COLOR,[Mr]:i.SRC_ALPHA,[fc]:i.SRC_ALPHA_SATURATE,[hc]:i.DST_COLOR,[lc]:i.DST_ALPHA,[oc]:i.ONE_MINUS_SRC_COLOR,[br]:i.ONE_MINUS_SRC_ALPHA,[uc]:i.ONE_MINUS_DST_COLOR,[cc]:i.ONE_MINUS_DST_ALPHA,[dc]:i.CONSTANT_COLOR,[pc]:i.ONE_MINUS_CONSTANT_COLOR,[mc]:i.CONSTANT_ALPHA,[gc]:i.ONE_MINUS_CONSTANT_ALPHA};function xt(O,ct,it,ut,st,rt,mt,R,K,At){if(O===gn){w===!0&&(b(i.BLEND),w=!1);return}if(w===!1&&(v(i.BLEND),w=!0),O!==jl){if(O!==m||At!==S){if((f!==kn||I!==kn)&&(i.blendEquation(i.FUNC_ADD),f=kn,I=kn),At)switch(O){case ri:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ke:i.blendFunc(i.ONE,i.ONE);break;case Fo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:zt("WebGLState: Invalid blending: ",O);break}else switch(O){case ri:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ke:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Fo:zt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Oo:zt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:zt("WebGLState: Invalid blending: ",O);break}P=null,g=null,L=null,U=null,F.set(0,0,0),H=0,m=O,S=At}return}st=st||ct,rt=rt||it,mt=mt||ut,(ct!==f||st!==I)&&(i.blendEquationSeparate(ft[ct],ft[st]),f=ct,I=st),(it!==P||ut!==g||rt!==L||mt!==U)&&(i.blendFuncSeparate(lt[it],lt[ut],lt[rt],lt[mt]),P=it,g=ut,L=rt,U=mt),(R.equals(F)===!1||K!==H)&&(i.blendColor(R.r,R.g,R.b,K),F.copy(R),H=K),m=O,S=!1}function yt(O,ct){O.side===Ie?b(i.CULL_FACE):v(i.CULL_FACE);let it=O.side===Oe;ct&&(it=!it),gt(it),O.blending===ri&&O.transparent===!1?xt(gn):xt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let ut=O.stencilWrite;o.setTest(ut),ut&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Zt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?v(i.SAMPLE_ALPHA_TO_COVERAGE):b(i.SAMPLE_ALPHA_TO_COVERAGE)}function gt(O){T!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),T=O)}function Ut(O){O!==Kl?(v(i.CULL_FACE),O!==B&&(O===No?i.cullFace(i.BACK):O===Ql?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):b(i.CULL_FACE),B=O}function N(O){O!==W&&(Q&&i.lineWidth(O),W=O)}function Zt(O,ct,it){O?(v(i.POLYGON_OFFSET_FILL),(X!==ct||tt!==it)&&(i.polygonOffset(ct,it),X=ct,tt=it)):b(i.POLYGON_OFFSET_FILL)}function Wt(O){O?v(i.SCISSOR_TEST):b(i.SCISSOR_TEST)}function Bt(O){O===void 0&&(O=i.TEXTURE0+ot-1),Et!==O&&(i.activeTexture(O),Et=O)}function wt(O,ct,it){it===void 0&&(Et===null?it=i.TEXTURE0+ot-1:it=Et);let ut=Mt[it];ut===void 0&&(ut={type:void 0,texture:void 0},Mt[it]=ut),(ut.type!==O||ut.texture!==ct)&&(Et!==it&&(i.activeTexture(it),Et=it),i.bindTexture(O,ct||x[O]),ut.type=O,ut.texture=ct)}function E(){let O=Mt[Et];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(O){zt("WebGLState:",O)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(O){zt("WebGLState:",O)}}function et(){try{i.texSubImage2D(...arguments)}catch(O){zt("WebGLState:",O)}}function $(){try{i.texSubImage3D(...arguments)}catch(O){zt("WebGLState:",O)}}function j(){try{i.compressedTexSubImage2D(...arguments)}catch(O){zt("WebGLState:",O)}}function q(){try{i.compressedTexSubImage3D(...arguments)}catch(O){zt("WebGLState:",O)}}function Y(){try{i.texStorage2D(...arguments)}catch(O){zt("WebGLState:",O)}}function pt(){try{i.texStorage3D(...arguments)}catch(O){zt("WebGLState:",O)}}function vt(){try{i.texImage2D(...arguments)}catch(O){zt("WebGLState:",O)}}function at(){try{i.texImage3D(...arguments)}catch(O){zt("WebGLState:",O)}}function ht(O){Vt.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),Vt.copy(O))}function Ct(O){ce.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),ce.copy(O))}function Pt(O,ct){let it=l.get(ct);it===void 0&&(it=new WeakMap,l.set(ct,it));let ut=it.get(O);ut===void 0&&(ut=i.getUniformBlockIndex(ct,O.name),it.set(O,ut))}function _t(O,ct){let ut=l.get(ct).get(O);c.get(ct)!==ut&&(i.uniformBlockBinding(ct,ut,O.__bindingPointIndex),c.set(ct,ut))}function Dt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},Et=null,Mt={},h={},d=new WeakMap,p=[],y=null,w=!1,m=null,f=null,P=null,g=null,I=null,L=null,U=null,F=new Ht(0,0,0),H=0,S=!1,T=null,B=null,W=null,X=null,tt=null,Vt.set(0,0,i.canvas.width,i.canvas.height),ce.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:v,disable:b,bindFramebuffer:M,drawBuffers:C,useProgram:D,setBlending:xt,setMaterial:yt,setFlipSided:gt,setCullFace:Ut,setLineWidth:N,setPolygonOffset:Zt,setScissorTest:Wt,activeTexture:Bt,bindTexture:wt,unbindTexture:E,compressedTexImage2D:_,compressedTexImage3D:z,texImage2D:vt,texImage3D:at,updateUBOMapping:Pt,uniformBlockBinding:_t,texStorage2D:Y,texStorage3D:pt,texSubImage2D:et,texSubImage3D:$,compressedTexSubImage2D:j,compressedTexSubImage3D:q,scissor:ht,viewport:Ct,reset:Dt}}function Em(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Xt,u=new WeakMap,h,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(E,_){return p?new OffscreenCanvas(E,_):fs("canvas")}function w(E,_,z){let et=1,$=wt(E);if(($.width>z||$.height>z)&&(et=z/Math.max($.width,$.height)),et<1)if(typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&E instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&E instanceof ImageBitmap||typeof VideoFrame!="undefined"&&E instanceof VideoFrame){let j=Math.floor(et*$.width),q=Math.floor(et*$.height);h===void 0&&(h=y(j,q));let Y=_?y(j,q):h;return Y.width=j,Y.height=q,Y.getContext("2d").drawImage(E,0,0,j,q),Gt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+j+"x"+q+")."),Y}else return"data"in E&&Gt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),E;return E}function m(E){return E.generateMipmaps}function f(E){i.generateMipmap(E)}function P(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function g(E,_,z,et,$=!1){if(E!==null){if(i[E]!==void 0)return i[E];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let j=_;if(_===i.RED&&(z===i.FLOAT&&(j=i.R32F),z===i.HALF_FLOAT&&(j=i.R16F),z===i.UNSIGNED_BYTE&&(j=i.R8)),_===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.R8UI),z===i.UNSIGNED_SHORT&&(j=i.R16UI),z===i.UNSIGNED_INT&&(j=i.R32UI),z===i.BYTE&&(j=i.R8I),z===i.SHORT&&(j=i.R16I),z===i.INT&&(j=i.R32I)),_===i.RG&&(z===i.FLOAT&&(j=i.RG32F),z===i.HALF_FLOAT&&(j=i.RG16F),z===i.UNSIGNED_BYTE&&(j=i.RG8)),_===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RG8UI),z===i.UNSIGNED_SHORT&&(j=i.RG16UI),z===i.UNSIGNED_INT&&(j=i.RG32UI),z===i.BYTE&&(j=i.RG8I),z===i.SHORT&&(j=i.RG16I),z===i.INT&&(j=i.RG32I)),_===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RGB8UI),z===i.UNSIGNED_SHORT&&(j=i.RGB16UI),z===i.UNSIGNED_INT&&(j=i.RGB32UI),z===i.BYTE&&(j=i.RGB8I),z===i.SHORT&&(j=i.RGB16I),z===i.INT&&(j=i.RGB32I)),_===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),z===i.UNSIGNED_INT&&(j=i.RGBA32UI),z===i.BYTE&&(j=i.RGBA8I),z===i.SHORT&&(j=i.RGBA16I),z===i.INT&&(j=i.RGBA32I)),_===i.RGB&&(z===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),_===i.RGBA){let q=$?hs:jt.getTransfer(et);z===i.FLOAT&&(j=i.RGBA32F),z===i.HALF_FLOAT&&(j=i.RGBA16F),z===i.UNSIGNED_BYTE&&(j=q===ee?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function I(E,_){let z;return E?_===null||_===ln||_===Ji?z=i.DEPTH24_STENCIL8:_===Qe?z=i.DEPTH32F_STENCIL8:_===Zi&&(z=i.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ln||_===Ji?z=i.DEPTH_COMPONENT24:_===Qe?z=i.DEPTH_COMPONENT32F:_===Zi&&(z=i.DEPTH_COMPONENT16),z}function L(E,_){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==fe&&E.minFilter!==Ae?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function U(E){let _=E.target;_.removeEventListener("dispose",U),H(_),_.isVideoTexture&&u.delete(_)}function F(E){let _=E.target;_.removeEventListener("dispose",F),T(_)}function H(E){let _=n.get(E);if(_.__webglInit===void 0)return;let z=E.source,et=d.get(z);if(et){let $=et[_.__cacheKey];$.usedTimes--,$.usedTimes===0&&S(E),Object.keys(et).length===0&&d.delete(z)}n.remove(E)}function S(E){let _=n.get(E);i.deleteTexture(_.__webglTexture);let z=E.source,et=d.get(z);delete et[_.__cacheKey],a.memory.textures--}function T(E){let _=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(_.__webglFramebuffer[et]))for(let $=0;$<_.__webglFramebuffer[et].length;$++)i.deleteFramebuffer(_.__webglFramebuffer[et][$]);else i.deleteFramebuffer(_.__webglFramebuffer[et]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[et])}else{if(Array.isArray(_.__webglFramebuffer))for(let et=0;et<_.__webglFramebuffer.length;et++)i.deleteFramebuffer(_.__webglFramebuffer[et]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let et=0;et<_.__webglColorRenderbuffer.length;et++)_.__webglColorRenderbuffer[et]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[et]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let z=E.textures;for(let et=0,$=z.length;et<$;et++){let j=n.get(z[et]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),a.memory.textures--),n.remove(z[et])}n.remove(E)}let B=0;function W(){B=0}function X(){let E=B;return E>=s.maxTextures&&Gt("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),B+=1,E}function tt(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function ot(E,_){let z=n.get(E);if(E.isVideoTexture&&Wt(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&z.__version!==E.version){let et=E.image;if(et===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{x(z,E,_);return}}else E.isExternalTexture&&(z.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+_)}function Q(E,_){let z=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version){x(z,E,_);return}else E.isExternalTexture&&(z.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+_)}function nt(E,_){let z=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&z.__version!==E.version){x(z,E,_);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+_)}function dt(E,_){let z=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&z.__version!==E.version){v(z,E,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+_)}let Et={[Oi]:i.REPEAT,[un]:i.CLAMP_TO_EDGE,[Sr]:i.MIRRORED_REPEAT},Mt={[fe]:i.NEAREST,[vc]:i.NEAREST_MIPMAP_NEAREST,[ks]:i.NEAREST_MIPMAP_LINEAR,[Ae]:i.LINEAR,[ra]:i.LINEAR_MIPMAP_NEAREST,[Jn]:i.LINEAR_MIPMAP_LINEAR},Rt={[bc]:i.NEVER,[Ec]:i.ALWAYS,[Sc]:i.LESS,[Xa]:i.LEQUAL,[wc]:i.EQUAL,[qa]:i.GEQUAL,[Ac]:i.GREATER,[Tc]:i.NOTEQUAL};function Yt(E,_){if(_.type===Qe&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ae||_.magFilter===ra||_.magFilter===ks||_.magFilter===Jn||_.minFilter===Ae||_.minFilter===ra||_.minFilter===ks||_.minFilter===Jn)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,Et[_.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,Et[_.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,Et[_.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,Mt[_.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,Mt[_.minFilter]),_.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,Rt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===fe||_.minFilter!==ks&&_.minFilter!==Jn||_.type===Qe&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Vt(E,_){let z=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",U));let et=_.source,$=d.get(et);$===void 0&&($={},d.set(et,$));let j=tt(_);if(j!==E.__cacheKey){$[j]===void 0&&($[j]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),$[j].usedTimes++;let q=$[E.__cacheKey];q!==void 0&&($[E.__cacheKey].usedTimes--,q.usedTimes===0&&S(_)),E.__cacheKey=j,E.__webglTexture=$[j].texture}return z}function ce(E,_,z){return Math.floor(Math.floor(E/z)/_)}function re(E,_,z,et){let j=E.updateRanges;if(j.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,z,et,_.data);else{j.sort((at,ht)=>at.start-ht.start);let q=0;for(let at=1;at<j.length;at++){let ht=j[q],Ct=j[at],Pt=ht.start+ht.count,_t=ce(Ct.start,_.width,4),Dt=ce(ht.start,_.width,4);Ct.start<=Pt+1&&_t===Dt&&ce(Ct.start+Ct.count-1,_.width,4)===_t?ht.count=Math.max(ht.count,Ct.start+Ct.count-ht.start):(++q,j[q]=Ct)}j.length=q+1;let Y=i.getParameter(i.UNPACK_ROW_LENGTH),pt=i.getParameter(i.UNPACK_SKIP_PIXELS),vt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let at=0,ht=j.length;at<ht;at++){let Ct=j[at],Pt=Math.floor(Ct.start/4),_t=Math.ceil(Ct.count/4),Dt=Pt%_.width,O=Math.floor(Pt/_.width),ct=_t,it=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Dt),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),e.texSubImage2D(i.TEXTURE_2D,0,Dt,O,ct,it,z,et,_.data)}E.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Y),i.pixelStorei(i.UNPACK_SKIP_PIXELS,pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,vt)}}function x(E,_,z){let et=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(et=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(et=i.TEXTURE_3D);let $=Vt(E,_),j=_.source;e.bindTexture(et,E.__webglTexture,i.TEXTURE0+z);let q=n.get(j);if(j.version!==q.__version||$===!0){e.activeTexture(i.TEXTURE0+z);let Y=jt.getPrimaries(jt.workingColorSpace),pt=_.colorSpace===Dn?null:jt.getPrimaries(_.colorSpace),vt=_.colorSpace===Dn||Y===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let at=w(_.image,!1,s.maxTextureSize);at=Bt(_,at);let ht=r.convert(_.format,_.colorSpace),Ct=r.convert(_.type),Pt=g(_.internalFormat,ht,Ct,_.colorSpace,_.isVideoTexture);Yt(et,_);let _t,Dt=_.mipmaps,O=_.isVideoTexture!==!0,ct=q.__version===void 0||$===!0,it=j.dataReady,ut=L(_,at);if(_.isDepthTexture)Pt=I(_.format===$n,_.type),ct&&(O?e.texStorage2D(i.TEXTURE_2D,1,Pt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Pt,at.width,at.height,0,ht,Ct,null));else if(_.isDataTexture)if(Dt.length>0){O&&ct&&e.texStorage2D(i.TEXTURE_2D,ut,Pt,Dt[0].width,Dt[0].height);for(let st=0,rt=Dt.length;st<rt;st++)_t=Dt[st],O?it&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,_t.width,_t.height,ht,Ct,_t.data):e.texImage2D(i.TEXTURE_2D,st,Pt,_t.width,_t.height,0,ht,Ct,_t.data);_.generateMipmaps=!1}else O?(ct&&e.texStorage2D(i.TEXTURE_2D,ut,Pt,at.width,at.height),it&&re(_,at,ht,Ct)):e.texImage2D(i.TEXTURE_2D,0,Pt,at.width,at.height,0,ht,Ct,at.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){O&&ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,Pt,Dt[0].width,Dt[0].height,at.depth);for(let st=0,rt=Dt.length;st<rt;st++)if(_t=Dt[st],_.format!==je)if(ht!==null)if(O){if(it)if(_.layerUpdates.size>0){let mt=il(_t.width,_t.height,_.format,_.type);for(let R of _.layerUpdates){let K=_t.data.subarray(R*mt/_t.data.BYTES_PER_ELEMENT,(R+1)*mt/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,R,_t.width,_t.height,1,ht,K)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,_t.width,_t.height,at.depth,ht,_t.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,Pt,_t.width,_t.height,at.depth,0,_t.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?it&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,_t.width,_t.height,at.depth,ht,Ct,_t.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,Pt,_t.width,_t.height,at.depth,0,ht,Ct,_t.data)}else{O&&ct&&e.texStorage2D(i.TEXTURE_2D,ut,Pt,Dt[0].width,Dt[0].height);for(let st=0,rt=Dt.length;st<rt;st++)_t=Dt[st],_.format!==je?ht!==null?O?it&&e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,_t.width,_t.height,ht,_t.data):e.compressedTexImage2D(i.TEXTURE_2D,st,Pt,_t.width,_t.height,0,_t.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?it&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,_t.width,_t.height,ht,Ct,_t.data):e.texImage2D(i.TEXTURE_2D,st,Pt,_t.width,_t.height,0,ht,Ct,_t.data)}else if(_.isDataArrayTexture)if(O){if(ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,Pt,at.width,at.height,at.depth),it)if(_.layerUpdates.size>0){let st=il(at.width,at.height,_.format,_.type);for(let rt of _.layerUpdates){let mt=at.data.subarray(rt*st/at.data.BYTES_PER_ELEMENT,(rt+1)*st/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,rt,at.width,at.height,1,ht,Ct,mt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,ht,Ct,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Pt,at.width,at.height,at.depth,0,ht,Ct,at.data);else if(_.isData3DTexture)O?(ct&&e.texStorage3D(i.TEXTURE_3D,ut,Pt,at.width,at.height,at.depth),it&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,ht,Ct,at.data)):e.texImage3D(i.TEXTURE_3D,0,Pt,at.width,at.height,at.depth,0,ht,Ct,at.data);else if(_.isFramebufferTexture){if(ct)if(O)e.texStorage2D(i.TEXTURE_2D,ut,Pt,at.width,at.height);else{let st=at.width,rt=at.height;for(let mt=0;mt<ut;mt++)e.texImage2D(i.TEXTURE_2D,mt,Pt,st,rt,0,ht,Ct,null),st>>=1,rt>>=1}}else if(Dt.length>0){if(O&&ct){let st=wt(Dt[0]);e.texStorage2D(i.TEXTURE_2D,ut,Pt,st.width,st.height)}for(let st=0,rt=Dt.length;st<rt;st++)_t=Dt[st],O?it&&e.texSubImage2D(i.TEXTURE_2D,st,0,0,ht,Ct,_t):e.texImage2D(i.TEXTURE_2D,st,Pt,ht,Ct,_t);_.generateMipmaps=!1}else if(O){if(ct){let st=wt(at);e.texStorage2D(i.TEXTURE_2D,ut,Pt,st.width,st.height)}it&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ht,Ct,at)}else e.texImage2D(i.TEXTURE_2D,0,Pt,ht,Ct,at);m(_)&&f(et),q.__version=j.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function v(E,_,z){if(_.image.length!==6)return;let et=Vt(E,_),$=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+z);let j=n.get($);if($.version!==j.__version||et===!0){e.activeTexture(i.TEXTURE0+z);let q=jt.getPrimaries(jt.workingColorSpace),Y=_.colorSpace===Dn?null:jt.getPrimaries(_.colorSpace),pt=_.colorSpace===Dn||q===Y?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);let vt=_.isCompressedTexture||_.image[0].isCompressedTexture,at=_.image[0]&&_.image[0].isDataTexture,ht=[];for(let rt=0;rt<6;rt++)!vt&&!at?ht[rt]=w(_.image[rt],!0,s.maxCubemapSize):ht[rt]=at?_.image[rt].image:_.image[rt],ht[rt]=Bt(_,ht[rt]);let Ct=ht[0],Pt=r.convert(_.format,_.colorSpace),_t=r.convert(_.type),Dt=g(_.internalFormat,Pt,_t,_.colorSpace),O=_.isVideoTexture!==!0,ct=j.__version===void 0||et===!0,it=$.dataReady,ut=L(_,Ct);Yt(i.TEXTURE_CUBE_MAP,_);let st;if(vt){O&&ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Dt,Ct.width,Ct.height);for(let rt=0;rt<6;rt++){st=ht[rt].mipmaps;for(let mt=0;mt<st.length;mt++){let R=st[mt];_.format!==je?Pt!==null?O?it&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt,0,0,R.width,R.height,Pt,R.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt,Dt,R.width,R.height,0,R.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt,0,0,R.width,R.height,Pt,_t,R.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt,Dt,R.width,R.height,0,Pt,_t,R.data)}}}else{if(st=_.mipmaps,O&&ct){st.length>0&&ut++;let rt=wt(ht[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,Dt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(at){O?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,ht[rt].width,ht[rt].height,Pt,_t,ht[rt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Dt,ht[rt].width,ht[rt].height,0,Pt,_t,ht[rt].data);for(let mt=0;mt<st.length;mt++){let K=st[mt].image[rt].image;O?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt+1,0,0,K.width,K.height,Pt,_t,K.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt+1,Dt,K.width,K.height,0,Pt,_t,K.data)}}else{O?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Pt,_t,ht[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Dt,Pt,_t,ht[rt]);for(let mt=0;mt<st.length;mt++){let R=st[mt];O?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt+1,0,0,Pt,_t,R.image[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt+1,Dt,Pt,_t,R.image[rt])}}}m(_)&&f(i.TEXTURE_CUBE_MAP),j.__version=$.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function b(E,_,z,et,$,j){let q=r.convert(z.format,z.colorSpace),Y=r.convert(z.type),pt=g(z.internalFormat,q,Y,z.colorSpace),vt=n.get(_),at=n.get(z);if(at.__renderTarget=_,!vt.__hasExternalTextures){let ht=Math.max(1,_.width>>j),Ct=Math.max(1,_.height>>j);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?e.texImage3D($,j,pt,ht,Ct,_.depth,0,q,Y,null):e.texImage2D($,j,pt,ht,Ct,0,q,Y,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),Zt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,$,at.__webglTexture,0,N(_)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,et,$,at.__webglTexture,j),e.bindFramebuffer(i.FRAMEBUFFER,null)}function M(E,_,z){if(i.bindRenderbuffer(i.RENDERBUFFER,E),_.depthBuffer){let et=_.depthTexture,$=et&&et.isDepthTexture?et.type:null,j=I(_.stencilBuffer,$),q=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Zt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,N(_),j,_.width,_.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,N(_),j,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,j,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,E)}else{let et=_.textures;for(let $=0;$<et.length;$++){let j=et[$],q=r.convert(j.format,j.colorSpace),Y=r.convert(j.type),pt=g(j.internalFormat,q,Y,j.colorSpace);Zt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,N(_),pt,_.width,_.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,N(_),pt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,pt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function C(E,_,z){let et=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=n.get(_.depthTexture);if($.__renderTarget=_,(!$.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),et){if($.__webglInit===void 0&&($.__webglInit=!0,_.depthTexture.addEventListener("dispose",U)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Yt(i.TEXTURE_CUBE_MAP,_.depthTexture);let vt=r.convert(_.depthTexture.format),at=r.convert(_.depthTexture.type),ht;_.depthTexture.format===fn?ht=i.DEPTH_COMPONENT24:_.depthTexture.format===$n&&(ht=i.DEPTH24_STENCIL8);for(let Ct=0;Ct<6;Ct++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ct,0,ht,_.width,_.height,0,vt,at,null)}}else ot(_.depthTexture,0);let j=$.__webglTexture,q=N(_),Y=et?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,pt=_.depthTexture.format===$n?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===fn)Zt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pt,Y,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,pt,Y,j,0);else if(_.depthTexture.format===$n)Zt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pt,Y,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,pt,Y,j,0);else throw new Error("Unknown depthTexture format")}function D(E){let _=n.get(E),z=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let et=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),et){let $=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,et.removeEventListener("dispose",$)};et.addEventListener("dispose",$),_.__depthDisposeCallback=$}_.__boundDepthTexture=et}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(z)for(let et=0;et<6;et++)C(_.__webglFramebuffer[et],E,et);else{let et=E.texture.mipmaps;et&&et.length>0?C(_.__webglFramebuffer[0],E,0):C(_.__webglFramebuffer,E,0)}else if(z){_.__webglDepthbuffer=[];for(let et=0;et<6;et++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[et]),_.__webglDepthbuffer[et]===void 0)_.__webglDepthbuffer[et]=i.createRenderbuffer(),M(_.__webglDepthbuffer[et],E,!1);else{let $=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=_.__webglDepthbuffer[et];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,j)}}else{let et=E.texture.mipmaps;if(et&&et.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),M(_.__webglDepthbuffer,E,!1);else{let $=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,j)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(E,_,z){let et=n.get(E);_!==void 0&&b(et.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&D(E)}function lt(E){let _=E.texture,z=n.get(E),et=n.get(_);E.addEventListener("dispose",F);let $=E.textures,j=E.isWebGLCubeRenderTarget===!0,q=$.length>1;if(q||(et.__webglTexture===void 0&&(et.__webglTexture=i.createTexture()),et.__version=_.version,a.memory.textures++),j){z.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer[Y]=[];for(let pt=0;pt<_.mipmaps.length;pt++)z.__webglFramebuffer[Y][pt]=i.createFramebuffer()}else z.__webglFramebuffer[Y]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer=[];for(let Y=0;Y<_.mipmaps.length;Y++)z.__webglFramebuffer[Y]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(q)for(let Y=0,pt=$.length;Y<pt;Y++){let vt=n.get($[Y]);vt.__webglTexture===void 0&&(vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&Zt(E)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let Y=0;Y<$.length;Y++){let pt=$[Y];z.__webglColorRenderbuffer[Y]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[Y]);let vt=r.convert(pt.format,pt.colorSpace),at=r.convert(pt.type),ht=g(pt.internalFormat,vt,at,pt.colorSpace,E.isXRRenderTarget===!0),Ct=N(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,ht,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Y,i.RENDERBUFFER,z.__webglColorRenderbuffer[Y])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),M(z.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),Yt(i.TEXTURE_CUBE_MAP,_);for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)b(z.__webglFramebuffer[Y][pt],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pt);else b(z.__webglFramebuffer[Y],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(_)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(q){for(let Y=0,pt=$.length;Y<pt;Y++){let vt=$[Y],at=n.get(vt),ht=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ht=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,at.__webglTexture),Yt(ht,vt),b(z.__webglFramebuffer,E,vt,i.COLOR_ATTACHMENT0+Y,ht,0),m(vt)&&f(ht)}e.unbindTexture()}else{let Y=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(Y=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Y,et.__webglTexture),Yt(Y,_),_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)b(z.__webglFramebuffer[pt],E,_,i.COLOR_ATTACHMENT0,Y,pt);else b(z.__webglFramebuffer,E,_,i.COLOR_ATTACHMENT0,Y,0);m(_)&&f(Y),e.unbindTexture()}E.depthBuffer&&D(E)}function xt(E){let _=E.textures;for(let z=0,et=_.length;z<et;z++){let $=_[z];if(m($)){let j=P(E),q=n.get($).__webglTexture;e.bindTexture(j,q),f(j),e.unbindTexture()}}}let yt=[],gt=[];function Ut(E){if(E.samples>0){if(Zt(E)===!1){let _=E.textures,z=E.width,et=E.height,$=i.COLOR_BUFFER_BIT,j=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=n.get(E),Y=_.length>1;if(Y)for(let vt=0;vt<_.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,q.__webglMultisampledFramebuffer);let pt=E.texture.mipmaps;pt&&pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,q.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,q.__webglFramebuffer);for(let vt=0;vt<_.length;vt++){if(E.resolveDepthBuffer&&(E.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),Y){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,q.__webglColorRenderbuffer[vt]);let at=n.get(_[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,at,0)}i.blitFramebuffer(0,0,z,et,0,0,z,et,$,i.NEAREST),c===!0&&(yt.length=0,gt.length=0,yt.push(i.COLOR_ATTACHMENT0+vt),E.depthBuffer&&E.resolveDepthBuffer===!1&&(yt.push(j),gt.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,gt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,yt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Y)for(let vt=0;vt<_.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,q.__webglColorRenderbuffer[vt]);let at=n.get(_[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,at,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,q.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){let _=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function N(E){return Math.min(s.maxSamples,E.samples)}function Zt(E){let _=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Wt(E){let _=a.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function Bt(E,_){let z=E.colorSpace,et=E.format,$=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||z!==oi&&z!==Dn&&(jt.getTransfer(z)===ee?(et!==je||$!==Ge)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):zt("WebGLTextures: Unsupported texture color space:",z)),_}function wt(E){return typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame!="undefined"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=W,this.setTexture2D=ot,this.setTexture2DArray=Q,this.setTexture3D=nt,this.setTextureCube=dt,this.rebindTextures=ft,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=Ut,this.setupDepthRenderbuffer=D,this.setupFrameBufferTexture=b,this.useMultisampledRTT=Zt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Cm(i,t){function e(n,s=Dn){let r,a=jt.getTransfer(s);if(n===Ge)return i.UNSIGNED_BYTE;if(n===oa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===la)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Yo)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Zo)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Xo)return i.BYTE;if(n===qo)return i.SHORT;if(n===Zi)return i.UNSIGNED_SHORT;if(n===aa)return i.INT;if(n===ln)return i.UNSIGNED_INT;if(n===Qe)return i.FLOAT;if(n===xn)return i.HALF_FLOAT;if(n===Jo)return i.ALPHA;if(n===$o)return i.RGB;if(n===je)return i.RGBA;if(n===fn)return i.DEPTH_COMPONENT;if(n===$n)return i.DEPTH_STENCIL;if(n===ca)return i.RED;if(n===ha)return i.RED_INTEGER;if(n===hi)return i.RG;if(n===ua)return i.RG_INTEGER;if(n===fa)return i.RGBA_INTEGER;if(n===Vs||n===Gs||n===Hs||n===Ws)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Vs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Vs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ws)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===da||n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===da)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===pa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===xa||n===_a||n===va||n===ya||n===Ma||n===ba||n===Sa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===xa||n===_a)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===va)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ya)return r.COMPRESSED_R11_EAC;if(n===Ma)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ba)return r.COMPRESSED_RG11_EAC;if(n===Sa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===wa||n===Aa||n===Ta||n===Ea||n===Ca||n===Ra||n===Ia||n===Pa||n===Da||n===La||n===Ua||n===Na||n===Fa||n===Oa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Aa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ta)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ea)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ca)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ra)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ia)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Pa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Da)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===La)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ua)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Na)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Oa)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ba||n===za||n===ka)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ba)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ka)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Va||n===Ga||n===Ha||n===Wa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Va)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ga)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ha)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Rm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Im=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,xl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Cs(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Fe({vertexShader:Rm,fragmentShader:Im,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new Xn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},_l=class extends Cn{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,d=null,p=null,y=null,w=typeof XRWebGLBinding!="undefined",m=new xl,f={},P=e.getContextAttributes(),g=null,I=null,L=[],U=[],F=new Xt,H=null,S=new we;S.viewport=new de;let T=new we;T.viewport=new de;let B=[S,T],W=new Yr,X=null,tt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(x){let v=L[x];return v===void 0&&(v=new Vi,L[x]=v),v.getTargetRaySpace()},this.getControllerGrip=function(x){let v=L[x];return v===void 0&&(v=new Vi,L[x]=v),v.getGripSpace()},this.getHand=function(x){let v=L[x];return v===void 0&&(v=new Vi,L[x]=v),v.getHandSpace()};function ot(x){let v=U.indexOf(x.inputSource);if(v===-1)return;let b=L[v];b!==void 0&&(b.update(x.inputSource,x.frame,l||a),b.dispatchEvent({type:x.type,data:x.inputSource}))}function Q(){s.removeEventListener("select",ot),s.removeEventListener("selectstart",ot),s.removeEventListener("selectend",ot),s.removeEventListener("squeeze",ot),s.removeEventListener("squeezestart",ot),s.removeEventListener("squeezeend",ot),s.removeEventListener("end",Q),s.removeEventListener("inputsourceschange",nt);for(let x=0;x<L.length;x++){let v=U[x];v!==null&&(U[x]=null,L[x].disconnect(v))}X=null,tt=null,m.reset();for(let x in f)delete f[x];t.setRenderTarget(g),p=null,d=null,h=null,s=null,I=null,re.stop(),n.isPresenting=!1,t.setPixelRatio(H),t.setSize(F.width,F.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(x){r=x,n.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(x){o=x,n.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(x){l=x},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h===null&&w&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(x){if(s=x,s!==null){if(g=t.getRenderTarget(),s.addEventListener("select",ot),s.addEventListener("selectstart",ot),s.addEventListener("selectend",ot),s.addEventListener("squeeze",ot),s.addEventListener("squeezestart",ot),s.addEventListener("squeezeend",ot),s.addEventListener("end",Q),s.addEventListener("inputsourceschange",nt),P.xrCompatible!==!0&&await e.makeXRCompatible(),H=t.getPixelRatio(),t.getSize(F),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let b=null,M=null,C=null;P.depth&&(C=P.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,b=P.stencil?$n:fn,M=P.stencil?Ji:ln);let D={colorFormat:e.RGBA8,depthFormat:C,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(D),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),I=new Ye(d.textureWidth,d.textureHeight,{format:je,type:Ge,depthTexture:new Hn(d.textureWidth,d.textureHeight,M,void 0,void 0,void 0,void 0,void 0,void 0,b),stencilBuffer:P.stencil,colorSpace:t.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let b={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,b),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),I=new Ye(p.framebufferWidth,p.framebufferHeight,{format:je,type:Ge,colorSpace:t.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}I.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),re.setContext(s),re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(x){for(let v=0;v<x.removed.length;v++){let b=x.removed[v],M=U.indexOf(b);M>=0&&(U[M]=null,L[M].disconnect(b))}for(let v=0;v<x.added.length;v++){let b=x.added[v],M=U.indexOf(b);if(M===-1){for(let D=0;D<L.length;D++)if(D>=U.length){U.push(b),M=D;break}else if(U[D]===null){U[D]=b,M=D;break}if(M===-1)break}let C=L[M];C&&C.connect(b)}}let dt=new V,Et=new V;function Mt(x,v,b){dt.setFromMatrixPosition(v.matrixWorld),Et.setFromMatrixPosition(b.matrixWorld);let M=dt.distanceTo(Et),C=v.projectionMatrix.elements,D=b.projectionMatrix.elements,ft=C[14]/(C[10]-1),lt=C[14]/(C[10]+1),xt=(C[9]+1)/C[5],yt=(C[9]-1)/C[5],gt=(C[8]-1)/C[0],Ut=(D[8]+1)/D[0],N=ft*gt,Zt=ft*Ut,Wt=M/(-gt+Ut),Bt=Wt*-gt;if(v.matrixWorld.decompose(x.position,x.quaternion,x.scale),x.translateX(Bt),x.translateZ(Wt),x.matrixWorld.compose(x.position,x.quaternion,x.scale),x.matrixWorldInverse.copy(x.matrixWorld).invert(),C[10]===-1)x.projectionMatrix.copy(v.projectionMatrix),x.projectionMatrixInverse.copy(v.projectionMatrixInverse);else{let wt=ft+Wt,E=lt+Wt,_=N-Bt,z=Zt+(M-Bt),et=xt*lt/E*wt,$=yt*lt/E*wt;x.projectionMatrix.makePerspective(_,z,et,$,wt,E),x.projectionMatrixInverse.copy(x.projectionMatrix).invert()}}function Rt(x,v){v===null?x.matrixWorld.copy(x.matrix):x.matrixWorld.multiplyMatrices(v.matrixWorld,x.matrix),x.matrixWorldInverse.copy(x.matrixWorld).invert()}this.updateCamera=function(x){if(s===null)return;let v=x.near,b=x.far;m.texture!==null&&(m.depthNear>0&&(v=m.depthNear),m.depthFar>0&&(b=m.depthFar)),W.near=T.near=S.near=v,W.far=T.far=S.far=b,(X!==W.near||tt!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),X=W.near,tt=W.far),W.layers.mask=x.layers.mask|6,S.layers.mask=W.layers.mask&3,T.layers.mask=W.layers.mask&5;let M=x.parent,C=W.cameras;Rt(W,M);for(let D=0;D<C.length;D++)Rt(C[D],M);C.length===2?Mt(W,S,T):W.projectionMatrix.copy(S.projectionMatrix),Yt(x,W,M)};function Yt(x,v,b){b===null?x.matrix.copy(v.matrixWorld):(x.matrix.copy(b.matrixWorld),x.matrix.invert(),x.matrix.multiply(v.matrixWorld)),x.matrix.decompose(x.position,x.quaternion,x.scale),x.updateMatrixWorld(!0),x.projectionMatrix.copy(v.projectionMatrix),x.projectionMatrixInverse.copy(v.projectionMatrixInverse),x.isPerspectiveCamera&&(x.fov=Tr*2*Math.atan(1/x.projectionMatrix.elements[5]),x.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(x){c=x,d!==null&&(d.fixedFoveation=x),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=x)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(W)},this.getCameraTexture=function(x){return f[x]};let Vt=null;function ce(x,v){if(u=v.getViewerPose(l||a),y=v,u!==null){let b=u.views;p!==null&&(t.setRenderTargetFramebuffer(I,p.framebuffer),t.setRenderTarget(I));let M=!1;b.length!==W.cameras.length&&(W.cameras.length=0,M=!0);for(let lt=0;lt<b.length;lt++){let xt=b[lt],yt=null;if(p!==null)yt=p.getViewport(xt);else{let Ut=h.getViewSubImage(d,xt);yt=Ut.viewport,lt===0&&(t.setRenderTargetTextures(I,Ut.colorTexture,Ut.depthStencilTexture),t.setRenderTarget(I))}let gt=B[lt];gt===void 0&&(gt=new we,gt.layers.enable(lt),gt.viewport=new de,B[lt]=gt),gt.matrix.fromArray(xt.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(xt.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(yt.x,yt.y,yt.width,yt.height),lt===0&&(W.matrix.copy(gt.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),M===!0&&W.cameras.push(gt)}let C=s.enabledFeatures;if(C&&C.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&w){h=n.getBinding();let lt=h.getDepthInformation(b[0]);lt&&lt.isValid&&lt.texture&&m.init(lt,s.renderState)}if(C&&C.includes("camera-access")&&w){t.state.unbindTexture(),h=n.getBinding();for(let lt=0;lt<b.length;lt++){let xt=b[lt].camera;if(xt){let yt=f[xt];yt||(yt=new Cs,f[xt]=yt);let gt=h.getCameraImage(xt);yt.sourceTexture=gt}}}}for(let b=0;b<L.length;b++){let M=U[b],C=L[b];M!==null&&C!==void 0&&C.update(M,v,l||a)}Vt&&Vt(x,v),v.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:v}),y=null}let re=new nh;re.setAnimationLoop(ce),this.setAnimationLoop=function(x){Vt=x},this.dispose=function(){}}},pi=new rn,Pm=new oe;function Dm(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,tl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,P,g,I){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,I)):f.isMeshMatcapMaterial?(r(m,f),y(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),w(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,P,g):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Oe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Oe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let P=t.get(f),g=P.envMap,I=P.envMapRotation;g&&(m.envMap.value=g,pi.copy(I),pi.x*=-1,pi.y*=-1,pi.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(Pm.makeRotationFromEuler(pi)),m.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,P,g){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*P,m.scale.value=g*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,P){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Oe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=P.texture,m.transmissionSamplerSize.value.set(P.width,P.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function y(m,f){f.matcap&&(m.matcap.value=f.matcap)}function w(m,f){let P=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(P.matrixWorld),m.nearDistance.value=P.shadow.camera.near,m.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Lm(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(P,g){let I=g.program;n.uniformBlockBinding(P,I)}function l(P,g){let I=s[P.id];I===void 0&&(y(P),I=u(P),s[P.id]=I,P.addEventListener("dispose",m));let L=g.program;n.updateUBOMapping(P,L);let U=t.render.frame;r[P.id]!==U&&(d(P),r[P.id]=U)}function u(P){let g=h();P.__bindingPointIndex=g;let I=i.createBuffer(),L=P.__size,U=P.usage;return i.bindBuffer(i.UNIFORM_BUFFER,I),i.bufferData(i.UNIFORM_BUFFER,L,U),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,g,I),I}function h(){for(let P=0;P<o;P++)if(a.indexOf(P)===-1)return a.push(P),P;return zt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(P){let g=s[P.id],I=P.uniforms,L=P.__cache;i.bindBuffer(i.UNIFORM_BUFFER,g);for(let U=0,F=I.length;U<F;U++){let H=Array.isArray(I[U])?I[U]:[I[U]];for(let S=0,T=H.length;S<T;S++){let B=H[S];if(p(B,U,S,L)===!0){let W=B.__offset,X=Array.isArray(B.value)?B.value:[B.value],tt=0;for(let ot=0;ot<X.length;ot++){let Q=X[ot],nt=w(Q);typeof Q=="number"||typeof Q=="boolean"?(B.__data[0]=Q,i.bufferSubData(i.UNIFORM_BUFFER,W+tt,B.__data)):Q.isMatrix3?(B.__data[0]=Q.elements[0],B.__data[1]=Q.elements[1],B.__data[2]=Q.elements[2],B.__data[3]=0,B.__data[4]=Q.elements[3],B.__data[5]=Q.elements[4],B.__data[6]=Q.elements[5],B.__data[7]=0,B.__data[8]=Q.elements[6],B.__data[9]=Q.elements[7],B.__data[10]=Q.elements[8],B.__data[11]=0):(Q.toArray(B.__data,tt),tt+=nt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,B.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(P,g,I,L){let U=P.value,F=g+"_"+I;if(L[F]===void 0)return typeof U=="number"||typeof U=="boolean"?L[F]=U:L[F]=U.clone(),!0;{let H=L[F];if(typeof U=="number"||typeof U=="boolean"){if(H!==U)return L[F]=U,!0}else if(H.equals(U)===!1)return H.copy(U),!0}return!1}function y(P){let g=P.uniforms,I=0,L=16;for(let F=0,H=g.length;F<H;F++){let S=Array.isArray(g[F])?g[F]:[g[F]];for(let T=0,B=S.length;T<B;T++){let W=S[T],X=Array.isArray(W.value)?W.value:[W.value];for(let tt=0,ot=X.length;tt<ot;tt++){let Q=X[tt],nt=w(Q),dt=I%L,Et=dt%nt.boundary,Mt=dt+Et;I+=Et,Mt!==0&&L-Mt<nt.storage&&(I+=L-Mt),W.__data=new Float32Array(nt.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=I,I+=nt.storage}}}let U=I%L;return U>0&&(I+=L-U),P.__size=I,P.__cache={},this}function w(P){let g={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(g.boundary=4,g.storage=4):P.isVector2?(g.boundary=8,g.storage=8):P.isVector3||P.isColor?(g.boundary=16,g.storage=12):P.isVector4?(g.boundary=16,g.storage=16):P.isMatrix3?(g.boundary=48,g.storage=48):P.isMatrix4?(g.boundary=64,g.storage=64):P.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Gt("WebGLRenderer: Unsupported uniform value type.",P),g}function m(P){let g=P.target;g.removeEventListener("dispose",m);let I=a.indexOf(g.__bindingPointIndex);a.splice(I,1),i.deleteBuffer(s[g.id]),delete s[g.id],delete r[g.id]}function f(){for(let P in s)i.deleteBuffer(s[P]);a=[],s={},r={}}return{bind:c,update:l,dispose:f}}var Um=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),_n=null;function Nm(){return _n===null&&(_n=new As(Um,16,16,hi,xn),_n.name="DFG_LUT",_n.minFilter=Ae,_n.magFilter=Ae,_n.wrapS=un,_n.wrapT=un,_n.generateMipmaps=!1,_n.needsUpdate=!0),_n}var $a=class{constructor(t={}){let{canvas:e=Cc(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:p=Ge}=t;this.isWebGLRenderer=!0;let y;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=n.getContextAttributes().alpha}else y=a;let w=p,m=new Set([fa,ua,ha]),f=new Set([Ge,ln,Zi,Ji,oa,la]),P=new Uint32Array(4),g=new Int32Array(4),I=null,L=null,U=[],F=[],H=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=on,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let S=this,T=!1;this._outputColorSpace=Re;let B=0,W=0,X=null,tt=-1,ot=null,Q=new de,nt=new de,dt=null,Et=new Ht(0),Mt=0,Rt=e.width,Yt=e.height,Vt=1,ce=null,re=null,x=new de(0,0,Rt,Yt),v=new de(0,0,Rt,Yt),b=!1,M=new Gi,C=!1,D=!1,ft=new oe,lt=new V,xt=new de,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},gt=!1;function Ut(){return X===null?Vt:1}let N=n;function Zt(A,k){return e.getContext(A,k)}try{let A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"182"}`),e.addEventListener("webglcontextlost",R,!1),e.addEventListener("webglcontextrestored",K,!1),e.addEventListener("webglcontextcreationerror",At,!1),N===null){let k="webgl2";if(N=Zt(k,A),N===null)throw Zt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw zt("WebGLRenderer: "+A.message),A}let Wt,Bt,wt,E,_,z,et,$,j,q,Y,pt,vt,at,ht,Ct,Pt,_t,Dt,O,ct,it,ut,st;function rt(){Wt=new Gd(N),Wt.init(),it=new Cm(N,Wt),Bt=new Ld(N,Wt,t,it),wt=new Tm(N,Wt),Bt.reversedDepthBuffer&&d&&wt.buffers.depth.setReversed(!0),E=new Xd(N),_=new um,z=new Em(N,Wt,wt,_,Bt,it,E),et=new Nd(S),$=new Vd(S),j=new Zh(N),ut=new Pd(N,j),q=new Hd(N,j,E,ut),Y=new Yd(N,q,j,E),Dt=new qd(N,Bt,z),Ct=new Ud(_),pt=new hm(S,et,$,Wt,Bt,ut,Ct),vt=new Dm(S,_),at=new dm,ht=new vm(Wt),_t=new Id(S,et,$,wt,Y,y,c),Pt=new wm(S,Y,Bt),st=new Lm(N,E,Bt,wt),O=new Dd(N,Wt,E),ct=new Wd(N,Wt,E),E.programs=pt.programs,S.capabilities=Bt,S.extensions=Wt,S.properties=_,S.renderLists=at,S.shadowMap=Pt,S.state=wt,S.info=E}rt(),w!==Ge&&(H=new Jd(w,e.width,e.height,s,r));let mt=new _l(S,N);this.xr=mt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let A=Wt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Wt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Vt},this.setPixelRatio=function(A){A!==void 0&&(Vt=A,this.setSize(Rt,Yt,!1))},this.getSize=function(A){return A.set(Rt,Yt)},this.setSize=function(A,k,J=!0){if(mt.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}Rt=A,Yt=k,e.width=Math.floor(A*Vt),e.height=Math.floor(k*Vt),J===!0&&(e.style.width=A+"px",e.style.height=k+"px"),H!==null&&H.setSize(e.width,e.height),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(Rt*Vt,Yt*Vt).floor()},this.setDrawingBufferSize=function(A,k,J){Rt=A,Yt=k,Vt=J,e.width=Math.floor(A*J),e.height=Math.floor(k*J),this.setViewport(0,0,A,k)},this.setEffects=function(A){if(w===Ge){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let k=0;k<A.length;k++)if(A[k].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}H.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(Q)},this.getViewport=function(A){return A.copy(x)},this.setViewport=function(A,k,J,Z){A.isVector4?x.set(A.x,A.y,A.z,A.w):x.set(A,k,J,Z),wt.viewport(Q.copy(x).multiplyScalar(Vt).round())},this.getScissor=function(A){return A.copy(v)},this.setScissor=function(A,k,J,Z){A.isVector4?v.set(A.x,A.y,A.z,A.w):v.set(A,k,J,Z),wt.scissor(nt.copy(v).multiplyScalar(Vt).round())},this.getScissorTest=function(){return b},this.setScissorTest=function(A){wt.setScissorTest(b=A)},this.setOpaqueSort=function(A){ce=A},this.setTransparentSort=function(A){re=A},this.getClearColor=function(A){return A.copy(_t.getClearColor())},this.setClearColor=function(){_t.setClearColor(...arguments)},this.getClearAlpha=function(){return _t.getClearAlpha()},this.setClearAlpha=function(){_t.setClearAlpha(...arguments)},this.clear=function(A=!0,k=!0,J=!0){let Z=0;if(A){let G=!1;if(X!==null){let bt=X.texture.format;G=m.has(bt)}if(G){let bt=X.texture.type,It=f.has(bt),Tt=_t.getClearColor(),Lt=_t.getClearAlpha(),Nt=Tt.r,kt=Tt.g,Ft=Tt.b;It?(P[0]=Nt,P[1]=kt,P[2]=Ft,P[3]=Lt,N.clearBufferuiv(N.COLOR,0,P)):(g[0]=Nt,g[1]=kt,g[2]=Ft,g[3]=Lt,N.clearBufferiv(N.COLOR,0,g))}else Z|=N.COLOR_BUFFER_BIT}k&&(Z|=N.DEPTH_BUFFER_BIT),J&&(Z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",R,!1),e.removeEventListener("webglcontextrestored",K,!1),e.removeEventListener("webglcontextcreationerror",At,!1),_t.dispose(),at.dispose(),ht.dispose(),_.dispose(),et.dispose(),$.dispose(),Y.dispose(),ut.dispose(),st.dispose(),pt.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",vl),mt.removeEventListener("sessionend",yl),Qn.stop()};function R(A){A.preventDefault(),ds("WebGLRenderer: Context Lost."),T=!0}function K(){ds("WebGLRenderer: Context Restored."),T=!1;let A=E.autoReset,k=Pt.enabled,J=Pt.autoUpdate,Z=Pt.needsUpdate,G=Pt.type;rt(),E.autoReset=A,Pt.enabled=k,Pt.autoUpdate=J,Pt.needsUpdate=Z,Pt.type=G}function At(A){zt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function $t(A){let k=A.target;k.removeEventListener("dispose",$t),Te(k)}function Te(A){De(A),_.remove(A)}function De(A){let k=_.get(A).programs;k!==void 0&&(k.forEach(function(J){pt.releaseProgram(J)}),A.isShaderMaterial&&pt.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,J,Z,G,bt){k===null&&(k=yt);let It=G.isMesh&&G.matrixWorld.determinant()<0,Tt=lh(A,k,J,Z,G);wt.setMaterial(Z,It);let Lt=J.index,Nt=1;if(Z.wireframe===!0){if(Lt=q.getWireframeAttribute(J),Lt===void 0)return;Nt=2}let kt=J.drawRange,Ft=J.attributes.position,Kt=kt.start*Nt,ie=(kt.start+kt.count)*Nt;bt!==null&&(Kt=Math.max(Kt,bt.start*Nt),ie=Math.min(ie,(bt.start+bt.count)*Nt)),Lt!==null?(Kt=Math.max(Kt,0),ie=Math.min(ie,Lt.count)):Ft!=null&&(Kt=Math.max(Kt,0),ie=Math.min(ie,Ft.count));let pe=ie-Kt;if(pe<0||pe===1/0)return;ut.setup(G,Z,Tt,J,Lt);let me,ae=O;if(Lt!==null&&(me=j.get(Lt),ae=ct,ae.setIndex(me)),G.isMesh)Z.wireframe===!0?(wt.setLineWidth(Z.wireframeLinewidth*Ut()),ae.setMode(N.LINES)):ae.setMode(N.TRIANGLES);else if(G.isLine){let Ot=Z.linewidth;Ot===void 0&&(Ot=1),wt.setLineWidth(Ot*Ut()),G.isLineSegments?ae.setMode(N.LINES):G.isLineLoop?ae.setMode(N.LINE_LOOP):ae.setMode(N.LINE_STRIP)}else G.isPoints?ae.setMode(N.POINTS):G.isSprite&&ae.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)zi("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))ae.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Ot=G._multiDrawStarts,ne=G._multiDrawCounts,te=G._multiDrawCount,He=Lt?j.get(Lt).bytesPerElement:1,_i=_.get(Z).currentProgram.getUniforms();for(let We=0;We<te;We++)_i.setValue(N,"_gl_DrawID",We),ae.render(Ot[We]/He,ne[We])}else if(G.isInstancedMesh)ae.renderInstances(Kt,pe,G.count);else if(J.isInstancedBufferGeometry){let Ot=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,ne=Math.min(J.instanceCount,Ot);ae.renderInstances(Kt,pe,ne)}else ae.render(Kt,pe)};function gi(A,k,J){A.transparent===!0&&A.side===Ie&&A.forceSinglePass===!1?(A.side=Oe,A.needsUpdate=!0,Js(A,k,J),A.side=En,A.needsUpdate=!0,Js(A,k,J),A.side=Ie):Js(A,k,J)}this.compile=function(A,k,J=null){J===null&&(J=A),L=ht.get(J),L.init(k),F.push(L),J.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(L.pushLight(G),G.castShadow&&L.pushShadow(G))}),A!==J&&A.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(L.pushLight(G),G.castShadow&&L.pushShadow(G))}),L.setupLights();let Z=new Set;return A.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let bt=G.material;if(bt)if(Array.isArray(bt))for(let It=0;It<bt.length;It++){let Tt=bt[It];gi(Tt,J,G),Z.add(Tt)}else gi(bt,J,G),Z.add(bt)}),L=F.pop(),Z},this.compileAsync=function(A,k,J=null){let Z=this.compile(A,k,J);return new Promise(G=>{function bt(){if(Z.forEach(function(It){_.get(It).currentProgram.isReady()&&Z.delete(It)}),Z.size===0){G(A);return}setTimeout(bt,10)}Wt.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let xi=null;function oh(A){xi&&xi(A)}function vl(){Qn.stop()}function yl(){Qn.start()}let Qn=new nh;Qn.setAnimationLoop(oh),typeof self!="undefined"&&Qn.setContext(self),this.setAnimationLoop=function(A){xi=A,mt.setAnimationLoop(A),A===null?Qn.stop():Qn.start()},mt.addEventListener("sessionstart",vl),mt.addEventListener("sessionend",yl),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){zt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;let J=mt.enabled===!0&&mt.isPresenting===!0,Z=H!==null&&(X===null||J)&&H.begin(S,X);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(H===null||H.isCompositing()===!1)&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(k),k=mt.getCamera()),A.isScene===!0&&A.onBeforeRender(S,A,k,X),L=ht.get(A,F.length),L.init(k),F.push(L),ft.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),M.setFromProjectionMatrix(ft,sn,k.reversedDepth),D=this.localClippingEnabled,C=Ct.init(this.clippingPlanes,D),I=at.get(A,U.length),I.init(),U.push(I),mt.enabled===!0&&mt.isPresenting===!0){let It=S.xr.getDepthSensingMesh();It!==null&&ja(It,k,-1/0,S.sortObjects)}ja(A,k,0,S.sortObjects),I.finish(),S.sortObjects===!0&&I.sort(ce,re),gt=mt.enabled===!1||mt.isPresenting===!1||mt.hasDepthSensing()===!1,gt&&_t.addToRenderList(I,A),this.info.render.frame++,C===!0&&Ct.beginShadows();let G=L.state.shadowsArray;if(Pt.render(G,A,k),C===!0&&Ct.endShadows(),this.info.autoReset===!0&&this.info.reset(),(Z&&H.hasRenderPass())===!1){let It=I.opaque,Tt=I.transmissive;if(L.setupLights(),k.isArrayCamera){let Lt=k.cameras;if(Tt.length>0)for(let Nt=0,kt=Lt.length;Nt<kt;Nt++){let Ft=Lt[Nt];bl(It,Tt,A,Ft)}gt&&_t.render(A);for(let Nt=0,kt=Lt.length;Nt<kt;Nt++){let Ft=Lt[Nt];Ml(I,A,Ft,Ft.viewport)}}else Tt.length>0&&bl(It,Tt,A,k),gt&&_t.render(A),Ml(I,A,k)}X!==null&&W===0&&(z.updateMultisampleRenderTarget(X),z.updateRenderTargetMipmap(X)),Z&&H.end(S),A.isScene===!0&&A.onAfterRender(S,A,k),ut.resetDefaultState(),tt=-1,ot=null,F.pop(),F.length>0?(L=F[F.length-1],C===!0&&Ct.setGlobalState(S.clippingPlanes,L.state.camera)):L=null,U.pop(),U.length>0?I=U[U.length-1]:I=null};function ja(A,k,J,Z){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)J=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)L.pushLight(A),A.castShadow&&L.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||M.intersectsSprite(A)){Z&&xt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ft);let It=Y.update(A),Tt=A.material;Tt.visible&&I.push(A,It,Tt,J,xt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||M.intersectsObject(A))){let It=Y.update(A),Tt=A.material;if(Z&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),xt.copy(A.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),xt.copy(It.boundingSphere.center)),xt.applyMatrix4(A.matrixWorld).applyMatrix4(ft)),Array.isArray(Tt)){let Lt=It.groups;for(let Nt=0,kt=Lt.length;Nt<kt;Nt++){let Ft=Lt[Nt],Kt=Tt[Ft.materialIndex];Kt&&Kt.visible&&I.push(A,It,Kt,J,xt.z,Ft)}}else Tt.visible&&I.push(A,It,Tt,J,xt.z,null)}}let bt=A.children;for(let It=0,Tt=bt.length;It<Tt;It++)ja(bt[It],k,J,Z)}function Ml(A,k,J,Z){let{opaque:G,transmissive:bt,transparent:It}=A;L.setupLightsView(J),C===!0&&Ct.setGlobalState(S.clippingPlanes,J),Z&&wt.viewport(Q.copy(Z)),G.length>0&&Zs(G,k,J),bt.length>0&&Zs(bt,k,J),It.length>0&&Zs(It,k,J),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function bl(A,k,J,Z){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(L.state.transmissionRenderTarget[Z.id]===void 0){let Kt=Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float");L.state.transmissionRenderTarget[Z.id]=new Ye(1,1,{generateMipmaps:!0,type:Kt?xn:Ge,minFilter:Jn,samples:Bt.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace})}let bt=L.state.transmissionRenderTarget[Z.id],It=Z.viewport||Q;bt.setSize(It.z*S.transmissionResolutionScale,It.w*S.transmissionResolutionScale);let Tt=S.getRenderTarget(),Lt=S.getActiveCubeFace(),Nt=S.getActiveMipmapLevel();S.setRenderTarget(bt),S.getClearColor(Et),Mt=S.getClearAlpha(),Mt<1&&S.setClearColor(16777215,.5),S.clear(),gt&&_t.render(J);let kt=S.toneMapping;S.toneMapping=on;let Ft=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),L.setupLightsView(Z),C===!0&&Ct.setGlobalState(S.clippingPlanes,Z),Zs(A,J,Z),z.updateMultisampleRenderTarget(bt),z.updateRenderTargetMipmap(bt),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let ie=0,pe=k.length;ie<pe;ie++){let me=k[ie],{object:ae,geometry:Ot,material:ne,group:te}=me;if(ne.side===Ie&&ae.layers.test(Z.layers)){let He=ne.side;ne.side=Oe,ne.needsUpdate=!0,Sl(ae,J,Z,Ot,ne,te),ne.side=He,ne.needsUpdate=!0,Kt=!0}}Kt===!0&&(z.updateMultisampleRenderTarget(bt),z.updateRenderTargetMipmap(bt))}S.setRenderTarget(Tt,Lt,Nt),S.setClearColor(Et,Mt),Ft!==void 0&&(Z.viewport=Ft),S.toneMapping=kt}function Zs(A,k,J){let Z=k.isScene===!0?k.overrideMaterial:null;for(let G=0,bt=A.length;G<bt;G++){let It=A[G],{object:Tt,geometry:Lt,group:Nt}=It,kt=It.material;kt.allowOverride===!0&&Z!==null&&(kt=Z),Tt.layers.test(J.layers)&&Sl(Tt,k,J,Lt,kt,Nt)}}function Sl(A,k,J,Z,G,bt){A.onBeforeRender(S,k,J,Z,G,bt),A.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(S,k,J,Z,A,bt),G.transparent===!0&&G.side===Ie&&G.forceSinglePass===!1?(G.side=Oe,G.needsUpdate=!0,S.renderBufferDirect(J,k,Z,G,A,bt),G.side=En,G.needsUpdate=!0,S.renderBufferDirect(J,k,Z,G,A,bt),G.side=Ie):S.renderBufferDirect(J,k,Z,G,A,bt),A.onAfterRender(S,k,J,Z,G,bt)}function Js(A,k,J){k.isScene!==!0&&(k=yt);let Z=_.get(A),G=L.state.lights,bt=L.state.shadowsArray,It=G.state.version,Tt=pt.getParameters(A,G.state,bt,k,J),Lt=pt.getProgramCacheKey(Tt),Nt=Z.programs;Z.environment=A.isMeshStandardMaterial?k.environment:null,Z.fog=k.fog,Z.envMap=(A.isMeshStandardMaterial?$:et).get(A.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,Nt===void 0&&(A.addEventListener("dispose",$t),Nt=new Map,Z.programs=Nt);let kt=Nt.get(Lt);if(kt!==void 0){if(Z.currentProgram===kt&&Z.lightsStateVersion===It)return Al(A,Tt),kt}else Tt.uniforms=pt.getUniforms(A),A.onBeforeCompile(Tt,S),kt=pt.acquireProgram(Tt,Lt),Nt.set(Lt,kt),Z.uniforms=Tt.uniforms;let Ft=Z.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ft.clippingPlanes=Ct.uniform),Al(A,Tt),Z.needsLights=hh(A),Z.lightsStateVersion=It,Z.needsLights&&(Ft.ambientLightColor.value=G.state.ambient,Ft.lightProbe.value=G.state.probe,Ft.directionalLights.value=G.state.directional,Ft.directionalLightShadows.value=G.state.directionalShadow,Ft.spotLights.value=G.state.spot,Ft.spotLightShadows.value=G.state.spotShadow,Ft.rectAreaLights.value=G.state.rectArea,Ft.ltc_1.value=G.state.rectAreaLTC1,Ft.ltc_2.value=G.state.rectAreaLTC2,Ft.pointLights.value=G.state.point,Ft.pointLightShadows.value=G.state.pointShadow,Ft.hemisphereLights.value=G.state.hemi,Ft.directionalShadowMap.value=G.state.directionalShadowMap,Ft.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ft.spotShadowMap.value=G.state.spotShadowMap,Ft.spotLightMatrix.value=G.state.spotLightMatrix,Ft.spotLightMap.value=G.state.spotLightMap,Ft.pointShadowMap.value=G.state.pointShadowMap,Ft.pointShadowMatrix.value=G.state.pointShadowMatrix),Z.currentProgram=kt,Z.uniformsList=null,kt}function wl(A){if(A.uniformsList===null){let k=A.currentProgram.getUniforms();A.uniformsList=Ki.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function Al(A,k){let J=_.get(A);J.outputColorSpace=k.outputColorSpace,J.batching=k.batching,J.batchingColor=k.batchingColor,J.instancing=k.instancing,J.instancingColor=k.instancingColor,J.instancingMorph=k.instancingMorph,J.skinning=k.skinning,J.morphTargets=k.morphTargets,J.morphNormals=k.morphNormals,J.morphColors=k.morphColors,J.morphTargetsCount=k.morphTargetsCount,J.numClippingPlanes=k.numClippingPlanes,J.numIntersection=k.numClipIntersection,J.vertexAlphas=k.vertexAlphas,J.vertexTangents=k.vertexTangents,J.toneMapping=k.toneMapping}function lh(A,k,J,Z,G){k.isScene!==!0&&(k=yt),z.resetTextureUnits();let bt=k.fog,It=Z.isMeshStandardMaterial?k.environment:null,Tt=X===null?S.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:oi,Lt=(Z.isMeshStandardMaterial?$:et).get(Z.envMap||It),Nt=Z.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,kt=!!J.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ft=!!J.morphAttributes.position,Kt=!!J.morphAttributes.normal,ie=!!J.morphAttributes.color,pe=on;Z.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(pe=S.toneMapping);let me=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ae=me!==void 0?me.length:0,Ot=_.get(Z),ne=L.state.lights;if(C===!0&&(D===!0||A!==ot)){let Le=A===ot&&Z.id===tt;Ct.setState(Z,A,Le)}let te=!1;Z.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==ne.state.version||Ot.outputColorSpace!==Tt||G.isBatchedMesh&&Ot.batching===!1||!G.isBatchedMesh&&Ot.batching===!0||G.isBatchedMesh&&Ot.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ot.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ot.instancing===!1||!G.isInstancedMesh&&Ot.instancing===!0||G.isSkinnedMesh&&Ot.skinning===!1||!G.isSkinnedMesh&&Ot.skinning===!0||G.isInstancedMesh&&Ot.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ot.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ot.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ot.instancingMorph===!1&&G.morphTexture!==null||Ot.envMap!==Lt||Z.fog===!0&&Ot.fog!==bt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==Ct.numPlanes||Ot.numIntersection!==Ct.numIntersection)||Ot.vertexAlphas!==Nt||Ot.vertexTangents!==kt||Ot.morphTargets!==Ft||Ot.morphNormals!==Kt||Ot.morphColors!==ie||Ot.toneMapping!==pe||Ot.morphTargetsCount!==ae)&&(te=!0):(te=!0,Ot.__version=Z.version);let He=Ot.currentProgram;te===!0&&(He=Js(Z,k,G));let _i=!1,We=!1,ji=!1,he=He.getUniforms(),Be=Ot.uniforms;if(wt.useProgram(He.program)&&(_i=!0,We=!0,ji=!0),Z.id!==tt&&(tt=Z.id,We=!0),_i||ot!==A){wt.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),he.setValue(N,"projectionMatrix",A.projectionMatrix),he.setValue(N,"viewMatrix",A.matrixWorldInverse);let ze=he.map.cameraPosition;ze!==void 0&&ze.setValue(N,lt.setFromMatrixPosition(A.matrixWorld)),Bt.logarithmicDepthBuffer&&he.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&he.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),ot!==A&&(ot=A,We=!0,ji=!0)}if(Ot.needsLights&&(ne.state.directionalShadowMap.length>0&&he.setValue(N,"directionalShadowMap",ne.state.directionalShadowMap,z),ne.state.spotShadowMap.length>0&&he.setValue(N,"spotShadowMap",ne.state.spotShadowMap,z),ne.state.pointShadowMap.length>0&&he.setValue(N,"pointShadowMap",ne.state.pointShadowMap,z)),G.isSkinnedMesh){he.setOptional(N,G,"bindMatrix"),he.setOptional(N,G,"bindMatrixInverse");let Le=G.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),he.setValue(N,"boneTexture",Le.boneTexture,z))}G.isBatchedMesh&&(he.setOptional(N,G,"batchingTexture"),he.setValue(N,"batchingTexture",G._matricesTexture,z),he.setOptional(N,G,"batchingIdTexture"),he.setValue(N,"batchingIdTexture",G._indirectTexture,z),he.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&he.setValue(N,"batchingColorTexture",G._colorsTexture,z));let Je=J.morphAttributes;if((Je.position!==void 0||Je.normal!==void 0||Je.color!==void 0)&&Dt.update(G,J,He),(We||Ot.receiveShadow!==G.receiveShadow)&&(Ot.receiveShadow=G.receiveShadow,he.setValue(N,"receiveShadow",G.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(Be.envMap.value=Lt,Be.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&k.environment!==null&&(Be.envMapIntensity.value=k.environmentIntensity),Be.dfgLUT!==void 0&&(Be.dfgLUT.value=Nm()),We&&(he.setValue(N,"toneMappingExposure",S.toneMappingExposure),Ot.needsLights&&ch(Be,ji),bt&&Z.fog===!0&&vt.refreshFogUniforms(Be,bt),vt.refreshMaterialUniforms(Be,Z,Vt,Yt,L.state.transmissionRenderTarget[A.id]),Ki.upload(N,wl(Ot),Be,z)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Ki.upload(N,wl(Ot),Be,z),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&he.setValue(N,"center",G.center),he.setValue(N,"modelViewMatrix",G.modelViewMatrix),he.setValue(N,"normalMatrix",G.normalMatrix),he.setValue(N,"modelMatrix",G.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){let Le=Z.uniformsGroups;for(let ze=0,to=Le.length;ze<to;ze++){let jn=Le[ze];st.update(jn,He),st.bind(jn,He)}}return He}function ch(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function hh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(A,k,J){let Z=_.get(A);Z.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),_.get(A.texture).__webglTexture=k,_.get(A.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:J,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,k){let J=_.get(A);J.__webglFramebuffer=k,J.__useDefaultFramebuffer=k===void 0};let uh=N.createFramebuffer();this.setRenderTarget=function(A,k=0,J=0){X=A,B=k,W=J;let Z=null,G=!1,bt=!1;if(A){let Tt=_.get(A);if(Tt.__useDefaultFramebuffer!==void 0){wt.bindFramebuffer(N.FRAMEBUFFER,Tt.__webglFramebuffer),Q.copy(A.viewport),nt.copy(A.scissor),dt=A.scissorTest,wt.viewport(Q),wt.scissor(nt),wt.setScissorTest(dt),tt=-1;return}else if(Tt.__webglFramebuffer===void 0)z.setupRenderTarget(A);else if(Tt.__hasExternalTextures)z.rebindTextures(A,_.get(A.texture).__webglTexture,_.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let kt=A.depthTexture;if(Tt.__boundDepthTexture!==kt){if(kt!==null&&_.has(kt)&&(A.width!==kt.image.width||A.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");z.setupDepthRenderbuffer(A)}}let Lt=A.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(bt=!0);let Nt=_.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Nt[k])?Z=Nt[k][J]:Z=Nt[k],G=!0):A.samples>0&&z.useMultisampledRTT(A)===!1?Z=_.get(A).__webglMultisampledFramebuffer:Array.isArray(Nt)?Z=Nt[J]:Z=Nt,Q.copy(A.viewport),nt.copy(A.scissor),dt=A.scissorTest}else Q.copy(x).multiplyScalar(Vt).floor(),nt.copy(v).multiplyScalar(Vt).floor(),dt=b;if(J!==0&&(Z=uh),wt.bindFramebuffer(N.FRAMEBUFFER,Z)&&wt.drawBuffers(A,Z),wt.viewport(Q),wt.scissor(nt),wt.setScissorTest(dt),G){let Tt=_.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+k,Tt.__webglTexture,J)}else if(bt){let Tt=k;for(let Lt=0;Lt<A.textures.length;Lt++){let Nt=_.get(A.textures[Lt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Lt,Nt.__webglTexture,J,Tt)}}else if(A!==null&&J!==0){let Tt=_.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Tt.__webglTexture,J)}tt=-1},this.readRenderTargetPixels=function(A,k,J,Z,G,bt,It,Tt=0){if(!(A&&A.isWebGLRenderTarget)){zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=_.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&It!==void 0&&(Lt=Lt[It]),Lt){wt.bindFramebuffer(N.FRAMEBUFFER,Lt);try{let Nt=A.textures[Tt],kt=Nt.format,Ft=Nt.type;if(!Bt.textureFormatReadable(kt)){zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Bt.textureTypeReadable(Ft)){zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-Z&&J>=0&&J<=A.height-G&&(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Tt),N.readPixels(k,J,Z,G,it.convert(kt),it.convert(Ft),bt))}finally{let Nt=X!==null?_.get(X).__webglFramebuffer:null;wt.bindFramebuffer(N.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(A,k,J,Z,G,bt,It,Tt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=_.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&It!==void 0&&(Lt=Lt[It]),Lt)if(k>=0&&k<=A.width-Z&&J>=0&&J<=A.height-G){wt.bindFramebuffer(N.FRAMEBUFFER,Lt);let Nt=A.textures[Tt],kt=Nt.format,Ft=Nt.type;if(!Bt.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Bt.textureTypeReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Kt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Kt),N.bufferData(N.PIXEL_PACK_BUFFER,bt.byteLength,N.STREAM_READ),A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Tt),N.readPixels(k,J,Z,G,it.convert(kt),it.convert(Ft),0);let ie=X!==null?_.get(X).__webglFramebuffer:null;wt.bindFramebuffer(N.FRAMEBUFFER,ie);let pe=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Rc(N,pe,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Kt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,bt),N.deleteBuffer(Kt),N.deleteSync(pe),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,k=null,J=0){let Z=Math.pow(2,-J),G=Math.floor(A.image.width*Z),bt=Math.floor(A.image.height*Z),It=k!==null?k.x:0,Tt=k!==null?k.y:0;z.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,It,Tt,G,bt),wt.unbindTexture()};let fh=N.createFramebuffer(),dh=N.createFramebuffer();this.copyTextureToTexture=function(A,k,J=null,Z=null,G=0,bt=null){bt===null&&(G!==0?(zi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),bt=G,G=0):bt=0);let It,Tt,Lt,Nt,kt,Ft,Kt,ie,pe,me=A.isCompressedTexture?A.mipmaps[bt]:A.image;if(J!==null)It=J.max.x-J.min.x,Tt=J.max.y-J.min.y,Lt=J.isBox3?J.max.z-J.min.z:1,Nt=J.min.x,kt=J.min.y,Ft=J.isBox3?J.min.z:0;else{let Je=Math.pow(2,-G);It=Math.floor(me.width*Je),Tt=Math.floor(me.height*Je),A.isDataArrayTexture?Lt=me.depth:A.isData3DTexture?Lt=Math.floor(me.depth*Je):Lt=1,Nt=0,kt=0,Ft=0}Z!==null?(Kt=Z.x,ie=Z.y,pe=Z.z):(Kt=0,ie=0,pe=0);let ae=it.convert(k.format),Ot=it.convert(k.type),ne;k.isData3DTexture?(z.setTexture3D(k,0),ne=N.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(z.setTexture2DArray(k,0),ne=N.TEXTURE_2D_ARRAY):(z.setTexture2D(k,0),ne=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);let te=N.getParameter(N.UNPACK_ROW_LENGTH),He=N.getParameter(N.UNPACK_IMAGE_HEIGHT),_i=N.getParameter(N.UNPACK_SKIP_PIXELS),We=N.getParameter(N.UNPACK_SKIP_ROWS),ji=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,me.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,me.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Nt),N.pixelStorei(N.UNPACK_SKIP_ROWS,kt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ft);let he=A.isDataArrayTexture||A.isData3DTexture,Be=k.isDataArrayTexture||k.isData3DTexture;if(A.isDepthTexture){let Je=_.get(A),Le=_.get(k),ze=_.get(Je.__renderTarget),to=_.get(Le.__renderTarget);wt.bindFramebuffer(N.READ_FRAMEBUFFER,ze.__webglFramebuffer),wt.bindFramebuffer(N.DRAW_FRAMEBUFFER,to.__webglFramebuffer);for(let jn=0;jn<Lt;jn++)he&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_.get(A).__webglTexture,G,Ft+jn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,_.get(k).__webglTexture,bt,pe+jn)),N.blitFramebuffer(Nt,kt,It,Tt,Kt,ie,It,Tt,N.DEPTH_BUFFER_BIT,N.NEAREST);wt.bindFramebuffer(N.READ_FRAMEBUFFER,null),wt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||A.isRenderTargetTexture||_.has(A)){let Je=_.get(A),Le=_.get(k);wt.bindFramebuffer(N.READ_FRAMEBUFFER,fh),wt.bindFramebuffer(N.DRAW_FRAMEBUFFER,dh);for(let ze=0;ze<Lt;ze++)he?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Je.__webglTexture,G,Ft+ze):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Je.__webglTexture,G),Be?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Le.__webglTexture,bt,pe+ze):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Le.__webglTexture,bt),G!==0?N.blitFramebuffer(Nt,kt,It,Tt,Kt,ie,It,Tt,N.COLOR_BUFFER_BIT,N.NEAREST):Be?N.copyTexSubImage3D(ne,bt,Kt,ie,pe+ze,Nt,kt,It,Tt):N.copyTexSubImage2D(ne,bt,Kt,ie,Nt,kt,It,Tt);wt.bindFramebuffer(N.READ_FRAMEBUFFER,null),wt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Be?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(ne,bt,Kt,ie,pe,It,Tt,Lt,ae,Ot,me.data):k.isCompressedArrayTexture?N.compressedTexSubImage3D(ne,bt,Kt,ie,pe,It,Tt,Lt,ae,me.data):N.texSubImage3D(ne,bt,Kt,ie,pe,It,Tt,Lt,ae,Ot,me):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,bt,Kt,ie,It,Tt,ae,Ot,me.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,bt,Kt,ie,me.width,me.height,ae,me.data):N.texSubImage2D(N.TEXTURE_2D,bt,Kt,ie,It,Tt,ae,Ot,me);N.pixelStorei(N.UNPACK_ROW_LENGTH,te),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,He),N.pixelStorei(N.UNPACK_SKIP_PIXELS,_i),N.pixelStorei(N.UNPACK_SKIP_ROWS,We),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ji),bt===0&&k.generateMipmaps&&N.generateMipmap(ne),wt.unbindTexture()},this.initRenderTarget=function(A){_.get(A).__webglFramebuffer===void 0&&z.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?z.setTextureCube(A,0):A.isData3DTexture?z.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?z.setTexture2DArray(A,0):z.setTexture2D(A,0),wt.unbindTexture()},this.resetState=function(){B=0,W=0,X=null,wt.reset(),ut.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}};(function(){let i=window.A=window.A||{},t=32,e=1/t,n=Math.PI*2,s=(x,v,b)=>Math.max(v,Math.min(b,x)),r=(x,v,b)=>{let M=Math.imul(x|0,374761393)+Math.imul(v|0,668265263)+Math.imul(b|0,1442695041)|0;return M=Math.imul(M^M>>>13,1274126177),((M^M>>>16)>>>0)/4294967296},a=new ve,o=new V,c={},l=x=>c[x]||(c[x]=new Ht(x)),u={};function h(x,v){let b=x+"|"+v;if(u[b])return u[b];let M=new Ht(x);return M.r=s(M.r*v,0,1),M.g=s(M.g*v,0,1),M.b=s(M.b*v,0,1),u[b]=M}let d={box:new an(1,1,1),sph:new Ps(.5,12,10),cyl:new Wn(.5,.5,1,12),cone:new Is(.5,1,10),plane:new Xn(1,1),circ:new Rs(.5,20),ring:new Wi(.84,1,32),arc:new Wi(.8,1,24,1,0,2.6),tor:new Ds(.5,.045,6,16,Math.PI)};function p(x,v,b){let M=document.createElement("canvas");M.width=M.height=x;let C=M.getContext("2d");v(C,x);let D=new Hi(M);return D.colorSpace=Re,D.wrapS=D.wrapT=Oi,b&&(D.magFilter=fe,D.minFilter=fe),D}let y={};function w(x){if(y[x])return y[x];let v;return x==="stone"?v=p(64,(b,M)=>{b.fillStyle="#9aa0b8",b.fillRect(0,0,M,M);for(let C=0;C<900;C++){let D=150+Math.floor(r(C,3,1)*60);b.fillStyle=`rgb(${D},${D+4},${D+14})`,b.fillRect(Math.floor(r(C,1,2)*M),Math.floor(r(C,2,3)*M),2,2)}b.strokeStyle="rgba(40,40,60,0.35)",b.lineWidth=1.5;for(let C=0;C<4;C++){b.beginPath();let D=r(C,5,7)*M,ft=r(C,6,8)*M;b.moveTo(D,ft);for(let lt=0;lt<5;lt++)D+=(r(C,lt,9)-.5)*18,ft+=(r(C,lt,10)-.5)*18,b.lineTo(D,ft);b.stroke()}b.fillStyle="rgba(255,255,255,0.08)",b.fillRect(0,0,M,2),b.fillRect(0,0,2,M),b.fillStyle="rgba(0,0,0,0.18)",b.fillRect(0,M-2,M,2),b.fillRect(M-2,0,2,M)}):x==="brick"?v=p(64,(b,M)=>{b.fillStyle="#4e5878",b.fillRect(0,0,M,M);let C=4,D=M/C;for(let ft=0;ft<C;ft++){let lt=ft&1?M/4:0;for(let xt=-1;xt<3;xt++){let yt=xt*(M/2)+lt,gt=150+Math.floor(r(ft,xt,4)*50);b.fillStyle=`rgb(${gt-20},${gt-10},${gt+20})`,b.fillRect(yt+2,ft*D+2,M/2-4,D-4),b.fillStyle="rgba(255,255,255,0.12)",b.fillRect(yt+2,ft*D+2,M/2-4,2),b.fillStyle="rgba(0,0,0,0.2)",b.fillRect(yt+2,ft*D+D-4,M/2-4,2)}}for(let ft=0;ft<300;ft++)b.fillStyle=`rgba(0,0,0,${r(ft,7,5)*.25})`,b.fillRect(Math.floor(r(ft,8,6)*M),Math.floor(r(ft,9,7)*M),2,1)}):x==="cap"?v=p(32,(b,M)=>{b.fillStyle="#6a7290",b.fillRect(0,0,M,M);for(let C=0;C<300;C++){let D=90+Math.floor(r(C,11,1)*60);b.fillStyle=`rgb(${D},${D},${D+12})`,b.fillRect(Math.floor(r(C,12,2)*M),Math.floor(r(C,13,3)*M),2,2)}}):x==="flame"?v=p(64,(b,M)=>{let C=b.createRadialGradient(M/2,M/2,0,M/2,M/2,M/2);C.addColorStop(0,"rgba(255,255,230,1)"),C.addColorStop(.25,"rgba(255,200,80,0.95)"),C.addColorStop(.6,"rgba(255,110,30,0.45)"),C.addColorStop(1,"rgba(255,60,0,0)"),b.fillStyle=C,b.fillRect(0,0,M,M)}):x==="glow"?v=p(64,(b,M)=>{let C=b.createRadialGradient(M/2,M/2,0,M/2,M/2,M/2);C.addColorStop(0,"rgba(255,255,255,1)"),C.addColorStop(.4,"rgba(255,255,255,0.35)"),C.addColorStop(1,"rgba(255,255,255,0)"),b.fillStyle=C,b.fillRect(0,0,M,M)}):x==="wood"&&(v=p(32,(b,M)=>{b.fillStyle="#8a5a3a",b.fillRect(0,0,M,M);for(let C=0;C<12;C++)b.fillStyle=`rgba(60,30,15,${.2+r(C,1,9)*.3})`,b.fillRect(0,Math.floor(r(C,2,9)*M),M,1+Math.floor(r(C,3,9)*2))})),y[x]=v}let m={};function f(x){if(m[x])return m[x];let v=i.Art.sprite(x);if(!v)return null;let b=new Hi(v.img);return b.colorSpace=Re,b.magFilter=fe,b.minFilter=fe,m[x]=b}function P(x,v){let b=new Ve(Object.assign({color:l(x)},v||{}));return b.userData.e=b.emissive.clone(),b.userData.ei=b.emissiveIntensity,b.userData.a=b.opacity,b}function g(x,v,b,M,C,D){D=D||{};let ft=D.mat||P(b,D.m),lt=new ge(d[v]||d.box,ft);if(lt.scale.set(M[0],M[1],M[2]),lt.castShadow=D.shadow!==!1,lt.receiveShadow=!1,D.rot&&lt.rotation.set(D.rot[0],D.rot[1],D.rot[2]),D.pivot){let xt=new ke;return xt.position.set(C[0],C[1],C[2]),lt.position.set(0,D.pivot==="top"?-M[1]/2:M[1]/2,0),xt.add(lt),x.add(xt),I(x,ft),xt.userData.mesh=lt,xt}return lt.position.set(C[0],C[1],C[2]),x.add(lt),I(x,ft),lt}function I(x,v){let b=x;for(;b&&!(b.userData&&b.userData.mats);)b=b.parent;b&&b.userData.mats.push(v)}function L(){let x=new ke;return x.userData.mats=[],x.userData.parts={},x}function U(x,v,b,M,C,D,ft){let lt=ft?{m:{emissive:l(v),emissiveIntensity:1.2}}:null;for(let xt of[-1,1])g(x,"box",v,[D,D,D*.6],[xt*b,M,C],Object.assign({shadow:!1},lt||{}))}function F(x,v,b,M,C){let D=g(x,"box",v,b,M,{pivot:"top"});return C&&(x.userData.parts[C]=D),D}function H(x,v){for(let b of x.userData.mats){let M=b.userData.e;M.r+M.g+M.b>0||(b.emissive.copy(b.color).multiplyScalar(v),b.userData.e.copy(b.emissive),b.emissiveIntensity=b.userData.ei=1)}}function S(x,v,b){for(let M of x.userData.mats)v?(M.emissive.set(b||"#ffffff"),M.emissiveIntensity=1):(M.emissive.copy(M.userData.e),M.emissiveIntensity=M.userData.ei)}function T(x,v,b){for(let M of x.userData.mats)M.emissive.copy(M.userData.e).lerp(l(v),b),M.emissiveIntensity=Math.max(M.userData.ei,b)}function B(x,v){for(let b of x.userData.mats){let M=v*b.userData.a;b.opacity!==M&&(b.opacity=M,b.transparent=M<1,b.needsUpdate=!1)}}function W(x,v,b,M){let C=new Vn(new Pn({map:w("flame"),color:l(M||"#ffffff"),blending:Ke,depthWrite:!1,transparent:!0}));return C.scale.set(v,v*1.35,1),C.position.set(b[0],b[1],b[2]),x.add(C),C}function X(x,v){let b=i.Art.RACE_SKIN[x]||i.Art.RACE_SKIN.mensch,M=i.Art.CLASS_CLOTH[v]||i.Art.CLASS_CLOTH.klinge,C=L(),D=C.userData.parts,ft={mensch:"#3e2731",fels:"#3a4466",schatten:"#262b44",pilz:"#3e8948",kobold:"#8b9bb4"}[x]||"#3e2731";F(C,"#3e2731",[.16,.3,.18],[-.1,.3,0],"legL"),F(C,"#3e2731",[.16,.3,.18],[.1,.3,0],"legR"),g(C,"box","#733e39",[.17,.08,.2],[-.1,.05,.02]),g(C,"box","#733e39",[.17,.08,.2],[.1,.05,.02]),D.body=g(C,"box",M[1],[.42,.38,.26],[0,.5,0]),g(C,"box",M[0],[.44,.07,.28],[0,.34,0]),g(C,"box",M[2],[.12,.3,.02],[0,.52,.135],{shadow:!1}),D.head=g(C,"box",b[0],[.34,.3,.3],[0,.86,0]),U(C,"#181425",.07,.87,.155,.05),v==="rufer"?(g(C,"box",M[1],[.42,.38,.3],[0,.9,-.06]),g(C,"cone",M[1],[.3,.32,.3],[0,1.22,-.08]),g(C,"box","#c0cbdc",[.09,.09,.03],[0,.6,.14],{shadow:!1})):v==="brau"?(g(C,"cyl",M[0],[.62,.04,.62],[0,1.03,0]),g(C,"cyl",M[1],[.34,.2,.34],[0,1.14,0]),g(C,"cyl",M[2],[.35,.04,.35],[0,1.07,0]),g(C,"box","#733e39",[.3,.12,.06],[0,.74,.15]),g(C,"box","#ead4aa",[.3,.3,.03],[0,.46,.145])):x==="pilz"?g(C,"sph","#e43b44",[.5,.2,.5],[0,1.02,0]):x==="kobold"?g(C,"cyl","#8b9bb4",[.36,.14,.36],[0,1.05,0]):g(C,"box",ft,[.37,.1,.33],[0,1.04,-.01]),x==="fels"&&g(C,"box",b[1],[.1,.1,.1],[-.15,.95,.12]),D.armL=F(C,M[0],[.13,.32,.13],[-.28,.68,0],"armL"),D.armR=F(C,M[0],[.13,.32,.13],[.28,.68,0],"armR"),g(D.armL,"box",b[0],[.12,.1,.12],[0,-.33,0]),g(D.armR,"box",b[0],[.12,.1,.12],[0,-.33,0]);let lt=v==="schuetze"?"bow":v==="brau"?"flask":v==="weber"||v==="rufer"?"staff":"sword";if(lt==="sword"){g(D.armR,"box","#c0cbdc",[.05,.03,.55],[0,-.34,.32]),g(D.armR,"box","#8b9bb4",[.16,.035,.04],[0,-.34,.07]),g(D.armR,"box","#733e39",[.04,.045,.12],[0,-.34,-.03]);let xt=g(D.armL,"cyl","#733e39",[.42,.05,.42],[-.07,-.2,.12],{rot:[Math.PI/2,0,0]});g(xt,"cyl","#8b9bb4",[1.04,.3,1.04],[0,0,0]),g(D.armL,"sph","#c0cbdc",[.1,.1,.1],[-.07,-.2,.16])}else if(lt==="bow")D.bow=g(D.armL,"tor","#733e39",[.7,.7,.7],[0,-.34,.15],{rot:[0,Math.PI/2,0]}),g(D.armL,"box","#ead4aa",[.012,.68,.012],[0,-.34,.15]),g(D.armR,"box","#ead4aa",[.02,.02,.4],[0,-.34,.15]),g(D.armR,"box","#e43b44",[.05,.05,.08],[0,-.34,-.03]);else if(lt==="flask")D.flask=g(D.armR,"sph","#feae34",[.17,.2,.17],[0,-.42,.06],{m:{emissive:l("#feae34"),emissiveIntensity:.6}}),g(D.flask,"cyl","#c0cbdc",[.35,.5,.35],[0,.65,0],{shadow:!1});else if(g(D.armR,"cyl","#733e39",[.06,1.05,.06],[.02,-.1,.06]),v==="rufer"){D.orb=g(D.armR,"box","#c0cbdc",[.17,.16,.16],[.02,.48,.06],{m:{emissive:l("#b55088"),emissiveIntensity:.5}});for(let xt of[-1,1])g(D.orb,"box","#e0a4ff",[.25,.25,.1],[xt*.22,.05,.5],{shadow:!1,m:{emissive:l("#e0a4ff"),emissiveIntensity:1.3}})}else D.orb=g(D.armR,"sph",M[2],[.17,.17,.17],[.02,.46,.06],{m:{emissive:l(M[2]),emissiveIntensity:.9}});return D.shield=g(C,"sph","#2ce8f5",[1.25,1.35,1.25],[0,.6,0],{shadow:!1,m:{transparent:!0,opacity:.18,emissive:l("#2ce8f5"),emissiveIntensity:.6,depthWrite:!1}}),D.shield.visible=!1,C.userData.h=1.15,C.userData.w=lt,C.scale.setScalar(1.15),H(C,.2),C}function tt(x,v,b,M){let C=x.userData.parts,D=v.moving,ft=x.userData.w,lt=i.World.W?i.World.W.t:0,xt=Math.sin(b*11),yt=v.swing>0?1-v.swing/.2:0,gt=1-Math.pow(1-yt,3),Ut=v.giantUntil-lt;if(x.scale.setScalar(1.15*(Ut>0?1+.35*s(Math.min(8-Ut,Ut)/.3,0,1):1)),x.rotation.y=Math.atan2(v.fx,v.fy),C.legL.rotation.x=D?xt*.75:0,C.legR.rotation.x=D?-xt*.75:0,x.position.y=D?Math.abs(xt)*.04:0,C.body.scale.y=.38*(1+Math.sin(b*2.5)*.02),ft==="sword"?(C.armL.rotation.x=D?xt*.4:-.2,C.armR.rotation.x=v.swing>0?-2.3+gt*3.4:D?-xt*.4:.15,C.armR.rotation.z=v.swing>0?-.3:0):ft==="flask"?(C.flask.visible=lt-(v.thrownT==null?-9:v.thrownT)>.22,C.armR.rotation.x=v.swing>0?-2.4+gt*2.9:D?-xt*.4:-.35,C.armL.rotation.x=D?xt*.4:-.1):ft==="bow"?(C.armL.rotation.x=-1.35,C.armR.rotation.x=v.swing>0?-1.2+gt*.5:-1.1,C.armR.position.z=v.swing>0?-.08:0):(C.armR.rotation.x=v.swing>0?-1.9+gt*1.2:-.1,C.armL.rotation.x=D?xt*.4:-.1,C.orb.material.emissiveIntensity=.7+(v.swing>0?1.2*(1-gt):0)+Math.sin(b*5)*.15),v.alive?x.rotation.x=0:(x.rotation.x=-1.45,x.position.y=.12),C.shield.visible=v.shield>0,v.shield>0){let N=1+Math.sin(b*6)*.03;C.shield.scale.set(1.25*N,1.35*N,1.25*N)}}let ot={blob(x,v){let b=x.userData.parts;b.body=g(x,"sph",v,[.8,.6,.8],[0,.3,0],{m:{emissive:h(v,.25),emissiveIntensity:.6}}),g(x,"sph",h(v,1.5).getStyle(),[.2,.14,.16],[-.18,.48,.2],{shadow:!1}),U(x,"#181425",.12,.34,.33,.06),g(x,"box","#181425",[.18,.03,.03],[0,.24,.37],{shadow:!1}),x.userData.h=.62},rat(x,v){let b=x.userData.parts;g(x,"box",v,[.46,.24,.26],[0,.2,-.06]),g(x,"box",h(v,1.2).getStyle(),[.26,.2,.24],[0,.26,.26]);for(let M of[-1,1])g(x,"box","#f6757a",[.1,.1,.03],[M*.1,.42,.22],{shadow:!1});g(x,"box","#181425",[.06,.05,.05],[0,.24,.4],{shadow:!1}),U(x,"#e43b44",.08,.31,.37,.045,!0),b.tail=g(x,"box",h(v,.9).getStyle(),[.04,.03,.4],[0,.14,-.3],{pivot:"top"}),b.tail.rotation.x=Math.PI/2;for(let[M,C]of[[-.15,.1],[.15,.1],[-.15,-.2],[.15,-.2]])F(x,h(v,.8).getStyle(),[.08,.12,.08],[M,.12,C],"l"+M+C);x.userData.h=.5},bat(x,v){let b=x.userData.parts;g(x,"box",v,[.26,.24,.22],[0,.6,0]);for(let M of[-1,1])g(x,"cone",v,[.1,.16,.08],[M*.08,.78,0]);U(x,"#fee761",.06,.63,.12,.05,!0);for(let M of[-1,1])g(x,"box","#ffffff",[.03,.05,.02],[M*.04,.52,.11],{shadow:!1});b.wingL=g(x,"box",h(v,.85).getStyle(),[.46,.03,.26],[-.13,.64,0],{pivot:"side"}),b.wingL.userData.mesh.position.set(-.23,0,0),b.wingR=g(x,"box",h(v,.85).getStyle(),[.46,.03,.26],[.13,.64,0],{pivot:"side"}),b.wingR.userData.mesh.position.set(.23,0,0),x.userData.h=.85,x.userData.fly=!0},mushroom(x,v){let b=x.userData.parts;g(x,"cyl","#ead4aa",[.3,.5,.3],[0,.25,0]),b.cap=g(x,"sph",v,[.82,.42,.82],[0,.56,0]);for(let[M,C]of[[-.2,.1],[.15,-.15],[.05,.25]])g(x,"sph","#ead4aa",[.12,.08,.12],[M,.7,C],{shadow:!1});U(x,"#181425",.07,.32,.16,.05),F(x,"#ead4aa",[.09,.26,.09],[-.2,.42,0],"armL"),F(x,"#ead4aa",[.09,.26,.09],[.2,.42,0],"armR"),F(x,"#c28569",[.1,.14,.1],[-.08,.14,0],"legL"),F(x,"#c28569",[.1,.14,.1],[.08,.14,0],"legR"),x.userData.h=.8},skeleton(x,v){let b="#ead4aa";F(x,b,[.1,.3,.1],[-.09,.3,0],"legL"),F(x,b,[.1,.3,.1],[.09,.3,0],"legR"),g(x,"box",b,[.3,.08,.14],[0,.33,0]),g(x,"box",b,[.08,.3,.08],[0,.5,0]);for(let M of[.42,.5,.58])g(x,"box",b,[.34,.04,.18],[0,M,0]);F(x,b,[.09,.34,.09],[-.22,.68,0],"armL"),F(x,b,[.09,.34,.09],[.22,.68,0],"armR"),g(x,"box",b,[.26,.26,.24],[0,.82,0]),U(x,"#181425",.06,.85,.125,.07),g(x,"box","#181425",[.14,.03,.03],[0,.73,.125],{shadow:!1}),x.userData.h=.98},moth(x,v){let b=x.userData.parts;g(x,"box",v,[.22,.22,.3],[0,.6,0],{m:{emissive:l(v),emissiveIntensity:.5}});for(let M of[-1,1])g(x,"box","#3e2731",[.02,.14,.02],[M*.06,.78,.1],{rot:[.5,0,M*.4],shadow:!1});U(x,"#fee761",.06,.64,.15,.05,!0),b.wingL=g(x,"box",h(v,1.2).getStyle(),[.5,.02,.36],[-.11,.64,0],{pivot:"side",m:{emissive:l(v),emissiveIntensity:.6}}),b.wingL.userData.mesh.position.set(-.25,0,0),b.wingR=g(x,"box",h(v,1.2).getStyle(),[.5,.02,.36],[.11,.64,0],{pivot:"side",m:{emissive:l(v),emissiveIntensity:.6}}),b.wingR.userData.mesh.position.set(.25,0,0),x.userData.h=.85,x.userData.fly=!0},spider(x,v){let b=x.userData.parts;g(x,"sph",v,[.5,.36,.5],[0,.28,.05]),g(x,"sph",h(v,.8).getStyle(),[.6,.46,.6],[0,.32,-.42]),U(x,"#e43b44",.08,.34,.27,.05,!0),U(x,"#e43b44",.16,.3,.24,.04,!0),b.legs=[];for(let M=0;M<4;M++)for(let C of[-1,1]){let D=g(x,"box",h(v,.7).getStyle(),[.5,.04,.05],[C*.2,.3,.18-M*.12],{pivot:"side"});D.userData.mesh.position.set(C*.25,0,0),D.rotation.y=C*(.6-M*.4),D.rotation.z=-C*.55,D.userData.s=C,D.userData.i=M,b.legs.push(D)}x.userData.h=.6},golem(x,v){F(x,h(v,.8).getStyle(),[.3,.34,.32],[-.22,.34,0],"legL"),F(x,h(v,.8).getStyle(),[.3,.34,.32],[.22,.34,0],"legR"),g(x,"box",v,[.8,.72,.52],[0,.72,0]),g(x,"box",h(v,1.15).getStyle(),[.94,.2,.56],[0,1.08,0]),g(x,"box",h(v,.9).getStyle(),[.32,.28,.32],[0,1.26,.1]),U(x,"#f77622",.07,1.28,.27,.06,!0),F(x,h(v,.85).getStyle(),[.28,.66,.28],[-.6,1.08,0],"armL"),F(x,h(v,.85).getStyle(),[.28,.66,.28],[.6,1.08,0],"armR"),g(x,"box","#fee761",[.2,.05,.05],[.1,.8,.27],{rot:[0,0,.5],shadow:!1,m:{emissive:l("#f77622"),emissiveIntensity:.8}}),x.userData.h=1.45,x.userData.slow=!0},ghost(x,v){let b={transparent:!0,opacity:.72,emissive:h(v,.35),emissiveIntensity:.8,depthWrite:!1};g(x,"cone",v,[.6,-.7,.6],[0,.55,0],{m:b}),g(x,"sph",v,[.42,.42,.42],[0,.95,0],{m:b}),U(x,"#fee761",.08,.97,.19,.06,!0);let M=F(x,v,[.1,.3,.1],[-.3,.82,.05],"armL"),C=F(x,v,[.1,.3,.1],[.3,.82,.05],"armR");M.userData.mesh.material=C.userData.mesh.material=x.userData.mats[0],M.rotation.x=C.rotation.x=-1,x.userData.h=1.15,x.userData.hover=!0;for(let D of x.userData.mats)D.userData.a=D.opacity},worm(x,v){let b=x.userData.parts;b.segs=[];let M=[.3,.28,.25,.22,.18],C=0;for(let D=0;D<5;D++){let ft=g(x,"sph",D?h(v,1-D*.07).getStyle():v,[M[D]*2,M[D]*1.8,M[D]*2],[0,M[D]*.9+.02,C]);b.segs.push(ft),C-=M[D]+(M[D+1]||0)-.05}g(x,"box","#3e2731",[.3,.14,.12],[0,.22,.26],{shadow:!1});for(let D of[-1,1])g(x,"cone","#ffffff",[.05,.08,.05],[D*.09,.3,.3],{rot:[Math.PI,0,0],shadow:!1});U(x,"#fee761",.12,.42,.22,.05,!0),x.userData.h=.62,x.userData.slow=!0},kobold(x,v){let b=x.userData.parts;F(x,"#3e2731",[.12,.22,.12],[-.08,.22,0],"legL"),F(x,"#3e2731",[.12,.22,.12],[.08,.22,0],"legR"),g(x,"box","#733e39",[.32,.3,.2],[0,.37,0]),g(x,"box",v,[.28,.24,.26],[0,.66,0]),g(x,"cone","#3e2731",[.34,.26,.34],[0,.88,-.02]),U(x,"#fee761",.06,.67,.135,.045,!0);for(let M of[-1,1])g(x,"cone",v,[.08,.14,.06],[M*.17,.72,0],{rot:[0,0,M*-1.2]});b.armL=F(x,v,[.1,.26,.1],[-.2,.52,0],"armL"),b.armR=F(x,v,[.1,.26,.1],[.2,.52,0],"armR"),g(b.armR,"box","#c0cbdc",[.03,.02,.26],[0,-.26,.14]),g(x,"sph","#b86f50",[.26,.26,.2],[0,.5,-.17]),x.userData.h=1}};function Q(x){let v=L(),b=ot[x.shape]?x.shape:"blob";ot[b](v,x.color||"#8b9bb4");let M=(x.boss?2:x.elite?1.25:1)*1.15;if(v.scale.setScalar(M),v.userData.sc=M,v.userData.shape=b,H(v,.16),x.boss){let C=v.userData.h;for(let D=0;D<4;D++)g(v,"box","#feae34",[.07,.14,.07],[Math.cos(D/4*n)*.14,C+.08,Math.sin(D/4*n)*.14],{shadow:!1,m:{emissive:l("#feae34"),emissiveIntensity:.5}})}return v}function nt(x,v,b){let M=x.userData.parts,C=x.userData.shape,D=v.state!=="windup"&&!(v.spawn>0)&&v.alive,ft=v.x*.1,lt=Math.sin(b*(x.userData.slow?6:10)+ft);x.rotation.y=Math.atan2(v.fx,v.fy);let xt=0;if(C==="blob"){let yt=Math.sin(b*7+ft);x.scale.set(x.userData.sc*(1+yt*.08),x.userData.sc*(1-yt*.1),x.userData.sc*(1+yt*.08))}if(x.userData.fly){xt=.05+Math.sin(b*5+ft)*.08;let yt=Math.sin(b*15+ft)*.75;M.wingL.rotation.z=yt,M.wingR.rotation.z=-yt}if(x.userData.hover&&(xt=.15+Math.sin(b*3+ft)*.1),M.legL&&(M.legL.rotation.x=D?lt*.7:0,M.legR.rotation.x=D?-lt*.7:0),M.armL&&C!=="ghost"&&(M.armL.rotation.x=D?-lt*.5:0,M.armR.rotation.x=D?lt*.5:0),C==="rat"){M.tail.rotation.y=Math.sin(b*8+ft)*.5;for(let yt of Object.keys(M))yt[0]==="l"&&(M[yt].rotation.x=D?Math.sin(b*14+ft+yt.length%3)*.6:0)}if(C==="spider")for(let yt of M.legs)yt.rotation.z=-yt.userData.s*.55+(D?Math.sin(b*16+yt.userData.i*1.3+(yt.userData.s>0?Math.PI:0))*.25:0);C==="mushroom"&&(M.cap.rotation.z=Math.sin(b*4+ft)*.08),C==="worm"&&M.segs.forEach((yt,gt)=>{yt.position.y=yt.userData.y0==null?yt.userData.y0=yt.position.y:yt.userData.y0+Math.sin(b*6-gt*.9+ft)*.05*(D?1:.3),yt.position.x=Math.sin(b*6-gt*.9+ft)*.06*gt}),v.state==="windup"?(xt+=Math.sin(b*60)*.015,x.rotation.x=-.12):x.rotation.x=0,v.spawn>0&&(xt-=(1-s(1-v.spawn/.5,0,1))*.5),x.position.y=xt}function dt(x){let v=x.look==="geist"?"ghost":x.look==="skel"?"skeleton":"rat",b=L();ot[v](b,x.look==="geist"?"#e0a4ff":x.look==="skel"?"#d9c8f0":x.shadow?"#b55088":"#7fe8ff");let M=x.minion?.95:1.1;return b.scale.setScalar(M),b.userData.sc=M,b.userData.shape=v,H(b,.3),b}function Et(x,v,b,M){nt(x,{x:v.x,fx:v.fx,fy:v.fy,alive:!0,spawn:v.spawn>0?v.spawn*1.25:0,state:"chase"},b);let C=v.until?v.until-M.t:9;B(x,v.spawn>0?s(1-v.spawn/.4,0,1):C<1.5?.5+Math.sin(b*20)*.3:1),T(x,v.rallyUntil>M.t?"#f6757a":v.minion||v.shadow?"#b55088":"#2ce8f5",.35)}function Mt(){let x=L(),v=x.userData.parts;g(x,"cyl","#b86f50",[.36,.44,.36],[0,.22,0]);for(let b of[.1,.34])g(x,"cyl","#3a4466",[.38,.04,.38],[0,b,0]);return g(x,"box","#3e2731",[.03,.12,.03],[.05,.5,0],{rot:[0,0,-.4]}),v.spark=g(x,"sph","#fee761",[.08,.08,.08],[.09,.57,0],{shadow:!1,m:{emissive:l("#feae34"),emissiveIntensity:1.5}}),H(x,.15),x}function Rt(x){let v=L(),b=v.userData.parts;switch(x.kind){case"chest":{g(v,"box","#8a5a3a",[.9,.46,.6],[0,.23,0],{m:{map:w("wood")}});for(let M of[-.3,.3])g(v,"box","#3a4466",[.08,.5,.64],[M,.25,0]);b.lid=new ke,b.lid.position.set(0,.46,-.3),v.add(b.lid),g(b.lid,"box","#a0683f",[.9,.26,.6],[0,.13,.3],{m:{map:w("wood")}});for(let M of[-.3,.3])g(b.lid,"box","#3a4466",[.08,.3,.64],[M,.14,.3]);g(v,"box","#feae34",[.14,.16,.06],[0,.42,.32],{shadow:!1}),b.glow=g(v,"box","#fee761",[.8,.03,.04],[0,.46,.31],{shadow:!1,m:{emissive:l("#fee761"),emissiveIntensity:1.5}}),g(v,"cyl","#fee761",[.3,.06,.3],[.1,.5,.05],{shadow:!1,m:{emissive:l("#feae34"),emissiveIntensity:.4}}),v.userData.h=.8;break}case"fire":{for(let M of[.3,1.4,2.5])g(v,"cyl","#733e39",[.12,.7,.12],[0,.07,0],{rot:[0,M,Math.PI/2]});for(let M=0;M<6;M++)g(v,"box","#3a4466",[.14,.1,.14],[Math.cos(M/6*n)*.45,.05,Math.sin(M/6*n)*.45]);b.flame=W(v,1,[0,.45,0]),b.flame2=W(v,.5,[0,.3,0],"#fff2b0"),v.userData.h=.9;break}case"merchant":{g(v,"box","#3e2731",[1.6,.12,.6],[0,.56,.45]);for(let M of[-.7,.7])g(v,"box","#3e2731",[.1,.56,.5],[M,.28,.45]);g(v,"box","#68386c",[.5,.6,.36],[0,.4,0]),g(v,"sph","#e8b796",[.34,.34,.34],[0,.82,0]),g(v,"cone","#68386c",[.5,.5,.5],[0,1.1,-.02]),g(v,"box","#68386c",[.56,.2,.4],[0,.9,-.05]),U(v,"#fee761",.07,.84,.16,.05,!0),g(v,"box","#8a5a3a",[.2,.3,.2],[-.5,.77,.45],{m:{map:w("wood")}}),g(v,"cyl","#e43b44",[.14,.2,.14],[.4,.72,.4]),g(v,"cyl","#feae34",[.22,.05,.22],[.05,.65,.5],{m:{emissive:l("#feae34"),emissiveIntensity:.5}}),b.lamp=W(v,.45,[.7,1,.45],"#ffd080"),v.userData.h=1.3;break}case"statue":{g(v,"box","#3a4466",[1,.3,1],[0,.15,0]),g(v,"box","#5a6988",[.8,.12,.8],[0,.36,0]),g(v,"box","#8b9bb4",[.44,.7,.3],[0,.77,0]),g(v,"box","#8b9bb4",[.3,.3,.28],[0,1.27,0]),g(v,"cone","#8b9bb4",[.4,.3,.4],[0,1.52,0]);let M=F(v,"#8b9bb4",[.14,.5,.14],[.3,1.05,0],"arm");M.rotation.x=-1.5,g(M,"box","#8b9bb4",[.2,.06,.2],[0,-.5,0]),g(v,"box","#b55088",[.1,.1,.1],[.3,1,.56],{shadow:!1,m:{emissive:l("#b55088"),emissiveIntensity:1}}),v.userData.h=1.7;break}case"stairs":{g(v,"box","#0d0b14",[2,.08,1.5],[0,0,0],{shadow:!1,m:{emissive:l("#0d0b14"),emissiveIntensity:0}}),g(v,"box","#3a4466",[2.2,.1,.12],[0,.03,-.8]),g(v,"box","#3a4466",[2.2,.1,.12],[0,.03,.8]),g(v,"box","#3a4466",[.12,.1,1.6],[-1.1,.03,0]),g(v,"box","#3a4466",[.12,.1,1.6],[1.1,.03,0]);for(let M=0;M<5;M++)g(v,"box",["#5a6988","#4a5578","#3a4466","#262b44","#181425"][M],[1.8-M*.1,.1,.26],[0,-.05-M*.14,-.6+M*.3],{shadow:!1});v.userData.h=.1;break}case"shrine":{g(v,"box","#3a4466",[.8,.16,.8],[0,.08,0]),g(v,"box","#5a6988",[.36,.7,.36],[0,.5,0]),g(v,"box","#8b9bb4",[.6,.12,.6],[0,.9,0]),b.orb=g(v,"sph","#2ce8f5",[.34,.34,.34],[0,1.25,0],{shadow:!1,m:{emissive:l("#2ce8f5"),emissiveIntensity:1.4}}),v.userData.h=1.45;break}case"forge":{g(v,"box","#3a4466",[.8,.62,.7],[-1.05,.31,0]),g(v,"box","#5a6988",[.86,.08,.76],[-1.05,.64,0]),b.coal=g(v,"box","#f77622",[.6,.05,.5],[-1.05,.69,0],{shadow:!1,m:{emissive:l("#f77622"),emissiveIntensity:1.3}}),g(v,"box","#fee761",[.36,.2,.04],[-1.05,.3,.36],{shadow:!1,m:{emissive:l("#feae34"),emissiveIntensity:1.5}}),b.fl=W(v,.55,[-1.05,.95,0]),g(v,"box","#3a4466",[.2,.32,.2],[.75,.16,.1]),g(v,"box","#5a6988",[.56,.14,.26],[.75,.38,.1]),g(v,"cone","#5a6988",[.12,.2,.12],[1.1,.38,.1],{rot:[0,0,-Math.PI/2]}),F(v,"#262b44",[.14,.3,.16],[-.12,.3,0],"legL"),F(v,"#262b44",[.14,.3,.16],[.08,.3,0],"legR"),g(v,"box","#3a4466",[.42,.38,.28],[-.02,.52,0]),g(v,"box","#733e39",[.36,.42,.04],[0,.48,.15]),g(v,"box","#e8b796",[.3,.28,.28],[-.02,.86,0]),g(v,"box","#be4a2f",[.3,.2,.08],[-.02,.72,.15]),U(v,"#181425",.07,.9,.145,.04),b.arm=F(v,"#e8b796",[.11,.34,.11],[.24,.66,.02],"arm"),g(b.arm,"box","#733e39",[.05,.36,.05],[0,-.36,.12],{rot:[Math.PI/2,0,0]}),g(b.arm,"box","#8b9bb4",[.2,.14,.14],[0,-.36,.3]),v.userData.h=1.1;break}case"sign":{g(v,"box","#733e39",[.08,.9,.08],[0,.45,0]),g(v,"box","#b86f50",[.9,.42,.08],[0,.95,.02],{m:{map:w("wood")}}),v.userData.h=1.25;break}}return b.arrow=g(v,"cone","#fee761",[.25,.32,.25],[0,v.userData.h+.35,0],{rot:[Math.PI,0,0],shadow:!1,m:{emissive:l("#feae34"),emissiveIntensity:.9}}),b.arrow.visible=!1,v}function Yt(x){let v=L();if(x==="barrel"){g(v,"cyl","#8a5a3a",[.62,.72,.62],[0,.36,0],{m:{map:w("wood")}});for(let b of[.16,.56])g(v,"cyl","#3a4466",[.66,.06,.66],[0,b,0])}else x==="crate"?(g(v,"box","#8a5a3a",[.72,.62,.72],[0,.31,0],{m:{map:w("wood")}}),g(v,"box","#5a3a22",[.76,.08,.76],[0,.31,0]),g(v,"box","#5a3a22",[.08,.66,.76],[0,.31,0])):(g(v,"cyl","#b86f50",[.46,.5,.46],[0,.25,0]),g(v,"cyl","#733e39",[.54,.08,.54],[0,.5,0]),g(v,"cyl","#3e2731",[.36,.04,.36],[0,.55,0],{shadow:!1}));return v}let Vt=520;function ce(x){let v=new ye,b=new Float32Array(Vt*3),M=new Float32Array(Vt*3),C=new Float32Array(Vt),D=new Float32Array(Vt);v.setAttribute("position",new _e(b,3).setUsage(ui)),v.setAttribute("aColor",new _e(M,3).setUsage(ui)),v.setAttribute("aSize",new _e(C,1).setUsage(ui)),v.setAttribute("aAlpha",new _e(D,1).setUsage(ui)),v.setDrawRange(0,0);let ft=new Fe({uniforms:{uScale:{value:300}},vertexShader:`attribute vec3 aColor; attribute float aSize; attribute float aAlpha; varying vec3 vC; varying float vA; uniform float uScale;
void main(){ vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec3 vC; varying float vA;
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard; float a = (1.0 - smoothstep(0.45, 1.0, r)) * vA; gl_FragColor = vec4(vC, a);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`,transparent:!0,depthWrite:!1,blending:x?Ke:void 0}),lt=new Es(v,ft);return lt.frustumCulled=!1,lt}i.Draw3=class{constructor(x,v){this.cv=x,this.flat=v,this.t=0,this.cam=null,this.levelW=null,this.topPad=60,this.botPad=0,this._quality="hi",this.r=new $a({canvas:x,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.r.shadowMap.enabled=!0,this.r.shadowMap.type=Zr,this.r.toneMapping=Bs,this.r.toneMappingExposure=1.25,this.scene=new Ss,this.scene.background=new Ht("#0d0b14"),this.scene.fog=new bs(new Ht("#0d0b14"),.012),this.camera=new we(38,1,.5,120),this.pitch=.9,this.hemi=new Us(new Ht("#55608f"),new Ht("#1a1424"),3.2),this.scene.add(this.hemi),this.sun=new Fs(new Ht("#8fa3d8"),2.6),this.sun.castShadow=!0,this.sun.shadow.bias=-.0015,this.sun.shadow.normalBias=.03,this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=60,this.scene.add(this.sun),this.scene.add(this.sun.target),this.pl=[];for(let b=0;b<8;b++){let M=new Ns(16777215,0,9,2);M.visible=!1,this.scene.add(M),this.pl.push(M)}this.lvl=null,this.dyn=new ke,this.scene.add(this.dyn),this.figs=new Map,this.ptsN=ce(!1),this.ptsA=ce(!0),this.scene.add(this.ptsN),this.scene.add(this.ptsA),this.rings=[];for(let b=0;b<24;b++){let M=new ge(d.ring,new mn({color:16777215,transparent:!0,opacity:0,blending:Ke,depthWrite:!1,side:Ie}));M.rotation.x=-Math.PI/2,M.visible=!1,this.scene.add(M),this.rings.push(M)}this.arcs=[];for(let b=0;b<4;b++){let M=new ge(d.arc,new mn({color:16777215,transparent:!0,opacity:0,blending:Ke,depthWrite:!1,side:Ie}));M.rotation.x=-Math.PI/2,M.visible=!1,this.scene.add(M),this.arcs.push(M)}this.decMax=400,this.decN=0,this.dec=new Gn(d.plane,new Ve({color:16777215,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.decMax),this.dec.instanceMatrix.setUsage(ui),this.dec.frustumCulled=!1,this.dec.receiveShadow=!0,a.scale.setScalar(0),a.position.set(0,-5,0),a.updateMatrix();for(let b=0;b<this.decMax;b++)this.dec.setMatrixAt(b,a.matrix),this.dec.setColorAt(b,l("#000000"));this.scene.add(this.dec),this.shotPool=new Map,this.pickPool=new Map,this.nLights=8,this.frameTimes=[],this.litAt={},this.levelAge=0,this.resize(),new ResizeObserver(()=>this.resize()).observe(x)}get quality(){return this._quality}set quality(x){this._quality=x;let v=x==="hi";this.r.shadowMap.enabled=v,this.scene.traverse(b=>{b.material&&(b.material.needsUpdate=!0)}),this.nLights=v?8:4,this.resize()}resize(){let x=this.cv.getBoundingClientRect(),v=Math.min(this._quality==="hi"?2:1,window.devicePixelRatio||1);this.W=Math.max(2,x.width),this.H=Math.max(2,x.height),this.dpr=v,this.r.setPixelRatio(v),this.r.setSize(this.W,this.H,!1),this.camera.aspect=this.W/this.H;let b=Math.max(this.W,this.H)*v>1500;this.sun.shadow.mapSize.set(b?2048:1024,b?2048:1024),this.sun.shadow.map&&(this.sun.shadow.map.dispose(),this.sun.shadow.map=null),this.ptsN.material.uniforms.uScale.value=this.ptsA.material.uniforms.uScale.value=this.H*v/2/Math.tan(this.camera.fov/2*Math.PI/180)}buildLevel(x){if(this.lvl){let q=Object.values(d);this.scene.remove(this.lvl),this.lvl.traverse(Y=>{Y.geometry&&!q.includes(Y.geometry)&&Y.geometry.dispose(),Y.material&&!Y.isSprite&&(Array.isArray(Y.material)?Y.material:[Y.material]).forEach(pt=>pt.dispose())})}for(let q of this.figs.values())this.dyn.remove(q);this.figs.clear(),this.decN=0,a.scale.setScalar(0),a.position.set(0,-5,0),a.updateMatrix();for(let q=0;q<this.decMax;q++)this.dec.setMatrixAt(q,a.matrix);this.dec.instanceMatrix.needsUpdate=!0;let v=i.World.MW,b=i.World.MH,M=i.Draw.THEMES[i.Draw.themeOf(x.floor)];this.theme=M,this.themeKey=i.Draw.themeOf(x.floor);let C=new ke;this.lvl=C,this.scene.add(C);let D=(x.seed>>>0)%1e5,ft=(q,Y)=>q<0||Y<0||q>=v||Y>=b?0:x.tiles[Y][q],lt=(q,Y)=>ft(q,Y)!==0,xt=(q,Y,pt)=>{for(let vt=-pt;vt<=pt;vt++)for(let at=-pt;at<=pt;at++)if(lt(q+at,Y+vt))return!0;return!1},yt=[],gt=[],Ut=[],N=7;for(let q=-N;q<b+N;q++)for(let Y=-N;Y<v+N;Y++)lt(Y,q)?yt.push([Y,q]):xt(Y,q,1)?gt.push([Y,q]):Ut.push([Y,q]);let Zt=M.floor,Wt=w("stone"),Bt=new Gn(new an(.96,.16,.96),new Ve({color:16777215,map:Wt}),yt.length);Bt.receiveShadow=!0,Bt.frustumCulled=!1,yt.forEach(([q,Y],pt)=>{a.position.set(q+.5,-.08+(r(q,Y,D+5)-.5)*.02,Y+.5),a.rotation.set(0,Math.floor(r(q,Y,D+6)*4)*Math.PI/2,0),a.scale.setScalar(1),a.updateMatrix(),Bt.setMatrixAt(pt,a.matrix);let vt=ft(q,Y),at=vt===4&&M.pit,ht=vt===5&&M.haz;at&&(a.position.y=-.3,a.updateMatrix(),Bt.setMatrixAt(pt,a.matrix));let Ct=at?r(q,Y,D+9)<.2?M.pit.mid:M.pit.base:ht?r(q,Y,D+9)<.3?M.haz.mid:M.haz.base:Zt[Math.floor(r(q,Y,D+7)*Zt.length)],Pt=h(Ct,(at&&(M.pit.lava||M.pit.void)?1.6:1.25)+(r(q,Y,D+8)-.5)*.3);Bt.setColorAt(pt,Pt)}),Bt.instanceColor.needsUpdate=!0,C.add(Bt);let wt=new ge(new Xn(v+6,b+6),P(M.mortar));wt.rotation.x=-Math.PI/2,wt.position.set(v/2,-.18,b/2),wt.receiveShadow=!0,C.add(wt);let E=w("brick"),_=w("cap"),z=[new Ve({color:16777215,map:E}),new Ve({color:16777215,map:E}),new Ve({color:16777215,map:_}),new Ve({color:0}),new Ve({color:16777215,map:E}),new Ve({color:16777215,map:E})],et=new Gn(new an(1,1.3,1),z,gt.length);if(et.castShadow=!0,et.receiveShadow=!0,et.frustumCulled=!1,gt.forEach(([q,Y],pt)=>{a.position.set(q+.5,.65,Y+.5),a.rotation.set(0,0,0),a.scale.setScalar(1),a.updateMatrix(),et.setMatrixAt(pt,a.matrix),et.setColorAt(pt,h(M.brick[Math.floor(r(q,Y,D+21)*M.brick.length)],1.2+(r(q,Y,D+22)-.5)*.25))}),et.instanceColor.needsUpdate=!0,C.add(et),Ut.length){let q=new Gn(new an(1,1.4,1),new Ve({color:16777215,map:_}),Ut.length);q.frustumCulled=!1,q.receiveShadow=!0,Ut.forEach(([Y,pt],vt)=>{a.position.set(Y+.5,.7,pt+.5),a.rotation.set(0,0,0),a.scale.setScalar(1),a.updateMatrix(),q.setMatrixAt(vt,a.matrix),q.setColorAt(vt,h(M.cap,1.1+(r(Y,pt,D+23)-.5)*.3))}),q.instanceColor.needsUpdate=!0,C.add(q)}this.gates=[];for(let q of x.rooms)for(let[Y,pt]of q.doors){if(this.gates.some(at=>at.x===Y&&at.y===pt))continue;let vt=new ke;vt.position.set(Y+.5,0,pt+.5),vt.userData.mats=[];for(let at=0;at<3;at++)g(vt,"box","#8b9bb4",[.07,1.25,.07],[-.3+at*.3,.62,0]);g(vt,"box","#5a6988",[.96,.08,.1],[0,.4,0]),g(vt,"box","#5a6988",[.96,.08,.1],[0,1.1,0]),C.add(vt),this.gates.push({x:Y,y:pt,g:vt})}this.lights=[],this.torches=[],this.flames=[],this.propG=new Map;let $=new i.RNG((x.seed^1540483477)>>>0||7),j=(q,Y,pt,vt,at)=>{let ht=W(C,vt,[q,Y,pt],at);return ht.userData.ph=$.next()*10,ht.userData.s0=vt,this.flames.push(ht),ht};for(let q of x.rooms){let Y=q.x,pt=q.y,vt=q.w,at=q.h,ht=q.y,Ct=!lt(q.x+2,q.y-1)&&lt(q.x+2,q.y);for(let ct of[2,q.w-3]){if(!Ct)continue;let it=q.x+ct+.5;g(C,"box","#262b44",[.14,.26,.12],[it,.78,ht+.06]),g(C,"cyl","#3a4466",[.16,.12,.16],[it,.93,ht+.1]),j(it,1.1,ht+.16,.62).userData.room=q.i,this.torches.push({x:it,y:1.05,z:ht+.4,room:q.i,ph:$.next()*10})}if($.chance(q.type==="boss"?1:.55)&&Ct)for(let ct of[4,q.w-5]){let it=q.x+ct+.5;g(C,"box",M.banner[1],[.5,.8,.03],[it,.72,ht+.02]),g(C,"box",M.banner[0],[.5,.2,.035],[it,.38,ht+.02]),g(C,"box",M.banner[2],[.14,.14,.04],[it,.8,ht+.03],{shadow:!1}),g(C,"box","#3a4466",[.6,.04,.06],[it,1.13,ht+.03])}for(let[ct,it]of[[Y,1],[Y+vt,-1]])$.chance(.5);let Pt=q.type==="start"?0:$.int(1,4);for(let ct=0;ct<Pt;ct++){let it=$.chance(.4),ut=Y+.75+$.next()*(vt-1.5),st=pt+.9+$.next()*(at-1.5);it?(g(C,"box","#ead4aa",[.2,.17,.2],[ut,.085,st]),g(C,"box","#181425",[.05,.05,.03],[ut-.05,.1,st+.1],{shadow:!1}),g(C,"box","#181425",[.05,.05,.03],[ut+.05,.1,st+.1],{shadow:!1})):(g(C,"box","#ead4aa",[.34,.05,.05],[ut,.03,st],{rot:[0,.5,0]}),g(C,"box","#ead4aa",[.3,.05,.05],[ut+.1,.03,st+.1],{rot:[0,-.9,0]}))}let _t=M.moss;for(let ct=0;ct<(this.themeKey==="grotto"?6:2);ct++){let it=Y+$.next()*vt,ut=$.chance(.5)?pt+.15+$.next()*.4:pt+at-.3-$.next()*.4;for(let st=0;st<3;st++)g(C,"box",_t[st%_t.length],[.3+$.next()*.3,.02,.2+$.next()*.2],[it+($.next()-.5)*.8,.005,ut+($.next()-.5)*.4],{shadow:!1})}if($.chance(this.themeKey==="grotto"?.8:.35)){let ct=Y+1.5+$.next()*(vt-3),it=pt+1.5+$.next()*(at-3),ut=.5+$.next()*.6,st=.2+$.next()*.2,rt=this.themeKey==="grotto",mt=this.themeKey==="rust",R=rt?"#4fa84d":mt?"#f77622":"#2a3d70";g(C,"circ",R,[ut*2,st*2,1],[ct,.012,it],{rot:[-Math.PI/2,0,0],shadow:!1,m:{transparent:!0,opacity:rt||mt?.85:.6,emissive:l(R),emissiveIntensity:rt||mt?.9:.25}}),(rt||mt)&&this.lights.push({x:ct,y:.3,z:it,color:rt?"#63c74d":"#f77622",i:2.5,d:4,fl:mt?2:.6})}if(this.themeKey==="grotto")for(let ct=0;ct<$.int(1,3);ct++){let it=Y+.5+$.next()*(vt-1),ut=pt+($.chance(.5)?.6:at-.3);g(C,"cone","#2ce8f5",[.22,.3,.22],[it,.15,ut],{m:{emissive:l("#2ce8f5"),emissiveIntensity:1.2}}),g(C,"cone","#2ce8f5",[.14,.2,.14],[it+.18,.1,ut+.1],{m:{emissive:l("#2ce8f5"),emissiveIntensity:1.2}}),this.lights.push({x:it,y:.4,z:ut,color:"#2ce8f5",i:3,d:4.5,fl:.4})}if(this.themeKey==="rust")for(let ct=0;ct<$.int(1,2);ct++){let it=Y+.6+$.next()*(vt-1.2),ut=pt+.6+$.next()*(at-1.2);g(C,"box","#f77622",[.9,.02,.12],[it,.01,ut],{rot:[0,$.next()*3,0],shadow:!1,m:{emissive:l("#f77622"),emissiveIntensity:1.5}}),this.lights.push({x:it,y:.3,z:ut,color:"#f77622",i:3,d:4,fl:2})}let Dt=Y+vt/2,O=pt+at/2;if(q.type==="boss"||q.type==="event"){let ct=q.type==="boss"?"#a22633":"#68386c",it=q.type==="boss"?2.1:1.4;g(C,"ring",ct,[it*2,it*2,1],[Dt,.01,O],{rot:[-Math.PI/2,0,0],shadow:!1,m:{emissive:l(ct),emissiveIntensity:.6,side:Ie}});for(let ut=0;ut<8;ut++){let st=ut/8*n;g(C,"box",ct,[.14,.03,.14],[Dt+Math.cos(st)*it*.92,.015,O+Math.sin(st)*it*.92],{shadow:!1,m:{emissive:l(ct),emissiveIntensity:.6}})}if(q.type==="event")for(let ut=0;ut<4;ut++){let st=ut/4*n+.78,rt=Dt+Math.cos(st)*1.6,mt=O+Math.sin(st)*1.1+.25;g(C,"cyl","#ead4aa",[.1,.22,.1],[rt,.11,mt]),j(rt,.3,mt,.2,"#ffe0a0"),this.lights.push({x:rt,y:.4,z:mt,color:"#feae34",i:2.2,d:3,fl:1.5,room:q.i})}if(q.type==="boss")for(let[ut,st]of[[Y+1.1,pt+1.4],[Y+vt-1.1,pt+1.4],[Y+1.1,pt+at-.8],[Y+vt-1.1,pt+at-.8]])g(C,"cyl","#262b44",[.7,.5,.7],[ut,.25,st]),g(C,"cyl","#3a4466",[.8,.1,.8],[ut,.5,st]),j(ut,.78,st,.75).userData.room=q.i,this.torches.push({x:ut,y:.9,z:st,room:q.i,ph:$.next()*10,big:!0})}if(q.type==="shop"||q.type==="rest"){let ut=O+(q.type==="shop"?-.25:.12);if(g(C,"box",q.type==="shop"?"#68386c":"#733e39",[2.75,.03,1.6],[Dt,.012,ut],{shadow:!1}),g(C,"box",q.type==="shop"?"#b55088":"#b86f50",[2.75-.3,.035,1.6-.3],[Dt,.013,ut],{shadow:!1}),g(C,"box",q.type==="shop"?"#68386c":"#733e39",[2.75-.6,.04,1.6-.6],[Dt,.014,ut],{shadow:!1}),q.type==="shop")for(let[st,rt,mt]of[["crate",-1.6,-.4],["barrel",1.6,-.5],["pot",1.25,.4]]){let R=Yt(st);R.position.set(Dt+rt,0,O+mt),C.add(R)}}if(q.type==="start"){let ct=new ge(new Wn(.3,.7,5,16,1,!0),new mn({color:l("#a8c8ff"),transparent:!0,opacity:.045,blending:Ke,depthWrite:!1,side:Ie}));ct.position.set(Dt,2.5,O-.4),C.add(ct),this.lights.push({x:Dt,y:1.2,z:O-.4,color:"#a8c8ff",i:2.5,d:5,fl:.2}),g(C,"cyl","#b86f50",[.045,5.5,.045],[Dt+.9,2.75,O-.1])}if(q.furn)for(let ct of q.furn){let it=Yt(ct.kind);it.position.set(ct.tx+.5,0,ct.ty+.5),it.rotation.y=$.next()*.6-.3,C.add(it)}for(let ct of q.props){let it=Rt(ct);it.position.set(ct.x*e,0,ct.y*e),C.add(it),this.propG.set(ct,it)}}this.levelW=x,this.litAt={},this.cam=null,this.levelAge=0}buildPick(x){let v=L();if(x.kind==="gold")g(v,"cyl","#feae34",[.3,.06,.3],[0,.16,0],{rot:[Math.PI/2,0,0],m:{emissive:l("#feae34"),emissiveIntensity:.35}}),g(v,"cyl","#fee761",[.18,.07,.18],[0,.16,0],{rot:[Math.PI/2,0,0],shadow:!1});else if(x.kind==="potion")g(v,"sph","#e43b44",[.28,.3,.28],[0,.16,0],{m:{emissive:l("#a22633"),emissiveIntensity:.5}}),g(v,"cyl","#c0cbdc",[.1,.12,.1],[0,.34,0]),g(v,"cyl","#b86f50",[.12,.06,.12],[0,.42,0]);else{let b=x.it,M=i.RARITY[b.rarity].color,C=i.Art.sprite(i.Art.itemIcon(b.base)),D=b.rarity!=="common"&&b.rarity!=="good",ft=f(i.Art.itemIcon(b.base)),lt=new Vn(new Pn({map:ft,transparent:!0,alphaTest:.2})),xt=.8/Math.max(C.w,C.h);if(lt.scale.set(C.w*xt,C.h*xt,1),lt.position.set(0,.42,0),v.add(lt),v.userData.parts.icon=lt,g(v,"circ",M,[.9,.5,1],[0,.006,0],{rot:[-Math.PI/2,0,0],shadow:!1,m:{transparent:!0,opacity:.55,emissive:l(M),emissiveIntensity:.9}}),D){let yt=new ge(new Wn(.16,.26,3.2,10,1,!0),new mn({color:l(M),transparent:!0,opacity:.16,blending:Ke,depthWrite:!1,side:Ie}));yt.position.y=1.6,v.add(yt),v.userData.parts.beam=yt}}return v}buildShot(x){let v=L();if(x.opts.lob){let b=g(v,"sph",x.color,[.2,.24,.2],[0,0,0],{shadow:!1,m:{emissive:l(x.color),emissiveIntensity:.9}});g(b,"cyl","#c0cbdc",[.35,.5,.35],[0,.65,0],{shadow:!1});let M=new Vn(new Pn({map:w("glow"),color:l(x.color),blending:Ke,depthWrite:!1,transparent:!0,opacity:.6}));M.scale.set(.55,.55,1),v.add(M)}else if(x.side==="hero"&&x.opts.kind!=="magic")g(v,"box","#8b7355",[.03,.03,.55],[0,0,0],{shadow:!1}),g(v,"cone","#c0cbdc",[.07,.12,.07],[0,0,.3],{rot:[Math.PI/2,0,0],shadow:!1}),g(v,"box","#e43b44",[.08,.02,.1],[0,0,-.24],{shadow:!1});else{let b=x.side==="hero",M=b?x.color:x.opts.kind==="magic"?"#b55088":"#e43b44";g(v,"sph",M,[.24,.24,.24],[0,0,0],{shadow:!1,m:{emissive:l(M),emissiveIntensity:1.3}});let C=new Vn(new Pn({map:w("glow"),color:l(M),blending:Ke,depthWrite:!1,transparent:!0,opacity:.8}));C.scale.set(.7,.7,1),v.add(C)}return v}project(x,v,b){o.set(x,v,b).project(this.camera);let M=this.flat;return[(o.x+1)/2*M.dw,(1-o.y)/2*M.dh]}draw(x,v){if(this.t+=v,!x)return;this.levelW!==x&&this.buildLevel(x);let b=x.hero,M=this.t,C=i.World.MW,D=i.World.MH,ft=i.Game.run;this.levelAge+=v;for(let R of x.rooms)R.visited&&this.litAt[R.i]==null&&(this.litAt[R.i]=this.levelAge>.5?M:M-5,this.levelAge>.5&&i.FX&&i.FX.ev("ignite"));let lt=b.x*e+(b.moving?b.fx*.75:0),xt=b.y*e+(b.moving?b.fy*.5:0);this.cam||(this.cam={x:lt,z:xt});let yt=1-Math.exp(-v*7);this.cam.x+=(lt-this.cam.x)*yt,this.cam.z+=(xt-this.cam.z)*yt;let gt=this.camera.aspect,Ut=Math.tan(this.camera.fov/2*Math.PI/180),N=Math.sin(this.pitch),Zt=Math.cos(this.pitch),Wt=Math.max(10*N/(2*Ut),7.5/(2*Ut*gt)),Bt=Wt*Ut*gt,wt=Wt*Ut/N,E=C>2*Bt?s(this.cam.x,Bt,C-Bt):C/2,_=D>2*wt?s(this.cam.z,wt,D-wt):D/2,z=i.FX?i.FX.trauma:0,et=z*z*.45;E+=et*(Math.sin(M*61)+Math.sin(M*37))*.5,_+=et*(Math.sin(M*53+1)+Math.sin(M*29))*.5,this.camera.position.set(E,Wt*N,_+Wt*Zt),this.camera.lookAt(E,.3,_);let $=Math.round(this.W*this.dpr),j=Math.round(this.H*this.dpr),q=Math.round((this.topPad-(this.botPad||0))/2*this.dpr);this.camera.setViewOffset($,j,0,-q,$,j),this.camera.updateProjectionMatrix(),this.sun.position.set(E-5,12,_+3),this.sun.target.position.set(E,0,_);let Y=this.sun.shadow.camera;Y.left=-Bt-2,Y.right=Bt+2,Y.top=wt+3,Y.bottom=-wt-3,Y.updateProjectionMatrix();let pt=[],vt=b.x*e,at=b.y*e,ht=(R,K,At,$t,Te,De,gi)=>{Te<=.01||pt.push({x:R,y:K,z:At,color:$t,i:Te,d:De,s:(gi||0)-Math.hypot(R-vt,At-at)})},Ct=(R,K)=>.86+Math.sin(M*9*(K||1)+R)*.07+Math.sin(M*23+R*2)*.05;ht(vt,1.2,at+.3,"#ffcf94",14,9,100);for(let R of this.torches){let K=this.litAt[R.room];if(K==null)continue;let At=s((M-K)/.6,0,1);ht(R.x,R.y,R.z,"#ff9a3a",(R.big?20:15)*Ct(R.ph)*At,R.big?9:8,10)}for(let R of this.lights)R.room!=null&&this.litAt[R.room]==null||ht(R.x,R.y,R.z,R.color,R.i*1.6*(R.fl?.85+Math.sin(M*3*R.fl+R.x)*.15:1),R.d,0);for(let R of x.rooms)for(let K of R.props){if(K.hidden)continue;let At=K.x*e,$t=K.y*e;K.kind==="fire"?ht(At,.7,$t,"#ff8a30",(K.used?7:16)*Ct(K.x,1.2),8,20):K.kind==="stairs"?ht(At,.5,$t,"#b55088",7+Math.sin(M*2)*1,5,5):K.kind==="merchant"?ht(At+.7,1.1,$t+.45,"#feae34",7,5,5):K.kind==="statue"?ht(At+.3,1.2,$t+.6,"#b55088",2.5,3.5,2):K.kind==="chest"&&!K.used?ht(At,.6,$t+.3,"#feae34",1.5,3,2):K.kind==="shrine"?ht(At,1.3,$t,"#2ce8f5",K.used?1.5:5,4,4):K.kind==="forge"&&ht(At-1.05,.9,$t+.2,"#ff8a30",9*Ct(K.x,1.3),6,12)}for(let R of x.picks)R.kind==="item"&&ht(R.x*e,.5,R.y*e,i.RARITY[R.it.rarity].color,2.5,3,3);for(let R of x.shots)(R.opts.kind==="magic"||R.side!=="hero")&&ht(R.x*e,.4,R.y*e,R.side==="hero"?R.color:R.opts.kind==="magic"?"#b55088":"#e43b44",2.5,3,4);for(let R of x.mons){if(!R.alive)continue;let K=R.x*e,At=R.y*e;R.mid==="glutmotte"?ht(K,.8,At,"#ff8a30",3*Ct(R.x,2),4,3):R.mid==="spiegelgeist"?ht(K,.8,At,"#9fd8ff",2,4,3):R.boss&&ht(K,1.5,At,"#e43b44",3,6,6),R.state==="windup"&&ht(K,.6,At,"#e43b44",3,3,8)}if(ft&&(ft.cls==="weber"||ft.cls==="rufer")&&b.alive&&ht(vt+b.fx*.3,1.3,at+b.fy*.3,ft.cls==="rufer"?"#e0a4ff":"#2ce8f5",2.5+(b.swing>0?2:0),3.5,9),i.FX)for(let R of i.FX.flashes)ht(R.x*e,.6,R.y*e,R.color,R.r*e*2.2*(R.life/R.max),R.r*e*2+2,50);pt.sort((R,K)=>K.s-R.s);for(let R=0;R<this.pl.length;R++){let K=this.pl[R],At=R<this.nLights?pt[R]:null;if(K.visible=!0,!At){K.intensity=0;continue}K.position.set(At.x,At.y,At.z),K.color.set(At.color),K.intensity=At.i,K.distance=At.d}for(let R of this.flames){let K=R.userData.room!=null?this.litAt[R.userData.room]==null?0:s((M-this.litAt[R.userData.room])/.6,0,1):1;R.visible=K>0;let At=R.userData.s0*K*(.9+Math.sin(M*12+R.userData.ph)*.1+Math.sin(M*31+R.userData.ph)*.05);R.scale.set(At,At*1.35,1),R.userData.room!=null&&K>0&&Math.random()<.05&&i.FX&&i.FX.part({kind:"px",add:!0,x:R.position.x*t+(Math.random()-.5)*6,y:R.position.z*t,z:R.position.y*t,vx:(Math.random()-.5)*12,vy:0,vz:30+Math.random()*30,life:.7,color:"#feae34",drag:.4})}x.active&&(x.active.lockT==null||x.active.lockT>M)&&(x.active.lockT=M);let Pt=x.active?s((M-x.active.lockT)/.18,0,1):1;for(let R of this.gates){let K=x.tiles[R.y][R.x]===2;R.g.visible=K,K&&(R.g.position.y=(1-Pt)*1.4)}this.flat.signAt=null;for(let[R,K]of this.propG){if(K.visible=!R.hidden,R.hidden)continue;let At=x.near===R,$t=K.userData.parts;if(R.kind==="chest")$t.lid.rotation.x=R.used?-1.7:0,$t.glow.visible=!R.used;else if(R.kind==="fire"){let De=R.used?.5:1;$t.flame.scale.set(De*(.95+Math.sin(M*13)*.08),De*1.35*(.95+Math.sin(M*9)*.1),1),$t.flame2.scale.set(De*.5,De*.7,1),Math.random()<.25&&i.FX&&i.FX.part({kind:"px",add:!0,x:R.x+(Math.random()-.5)*16,y:R.y,z:12,vx:(Math.random()-.5)*20,vy:0,vz:40+Math.random()*40,life:.8,color:Math.random()<.5?"#feae34":"#f77622",drag:.5})}else if(R.kind==="stairs")Math.random()<.2&&i.FX&&i.FX.part({kind:"px",add:!0,x:R.x+(Math.random()-.5)*40,y:R.y+(Math.random()-.5)*30,z:0,vz:25+Math.random()*25,life:1,color:"#b55088",drag:.3});else if(R.kind==="merchant")$t.lamp.scale.set(.45*(.95+Math.sin(M*11)*.07),.6,1);else if(R.kind==="shrine")$t.orb.position.y=1.25+Math.sin(M*2)*.06,$t.orb.visible=!R.used;else if(R.kind==="forge"){let De=(M*.85+R.x*.001)%1,gi=De>.72&&De<.9;$t.arm.rotation.x=gi?.5:-2.4+De*.4,$t.fl.scale.set(.55*(.95+Math.sin(M*13)*.08),.75*(.95+Math.sin(M*9)*.1),1);let xi=Math.floor(M*.85+R.x*.001+.28);$t.beat!==xi&&($t.beat=xi,i.FX&&i.FX.burst(R.x+26,R.y+4,6,{color:["#fee761","#feae34","#ffffff"],smin:40,smax:120,life:.35,add:!0,kind:"spark",drag:3,z:14,vz:90,g:300}))}else if(R.kind==="sign"&&x.room&&x.room.type==="start"){let De=this.project(R.x*e,1.05,R.y*e);this.flat.signAt={sx:De[0],sy:De[1],text:R.text}}let Te=At&&(!R.used||R.kind==="merchant"||R.kind==="forge"||R.kind==="stairs");$t.arrow.visible=Te,Te&&($t.arrow.position.y=K.userData.h+.4+Math.sin(M*6)*.08),R.kind!=="stairs"&&R.kind!=="fire"&&R.kind!=="forge"&&T(K,"#fee761",Te?.3+Math.sin(M*6)*.1:0)}let _t=ft?ft.race+ft.cls:"",Dt=this.figs.get(b);(!Dt||Dt.userData.key!==_t)&&(Dt&&this.dyn.remove(Dt),Dt=X(ft?ft.race:"mensch",ft?ft.cls:"klinge"),Dt.userData.key=_t,this.dyn.add(Dt),this.figs.set(b,Dt)),Dt.position.set(vt,0,at),tt(Dt,b,M,ft);let O=b.inv>0&&Math.floor(M*20)%2;B(Dt,O?.45:b.alive?1:.5),S(Dt,b.flash>0);let ct=new Set([b]);for(let R of x.mons){ct.add(R);let K=this.figs.get(R);if(K||(K=Q(R),this.dyn.add(K),this.figs.set(R,K)),K.position.set(R.x*e,0,R.y*e),!R.alive){K.visible=R.alpha>.82,K.visible&&S(K,!0);continue}K.visible=!0,nt(K,R,M),B(K,R.spawn>0?s(1-R.spawn/.5,0,1):1),R.flash>0?S(K,!0):R.state==="windup"&&Math.floor(M*16)%2===0?S(K,!0,"#ff9090"):R.frozenUntil>x.t?T(K,"#9be8ff",.65):R.boss?T(K,Math.sin(M*4)>0?"#e43b44":"#a22633",.35):R.elite&&!(R.spawn>0)?T(K,re[R.eliteKind]||"#fee761",.3):S(K,!1)}for(let R of x.allies||[]){ct.add(R);let K=this.figs.get(R);K||(K=dt(R),this.dyn.add(K),this.figs.set(R,K)),K.position.set(R.x*e,0,R.y*e),Et(K,R,M,x)}for(let R of x.marks||[]){if(R.kind!=="barrel")continue;ct.add(R);let K=this.figs.get(R);K||(K=Mt(),this.dyn.add(K),this.figs.set(R,K));let At=s((x.t-R.t0)/.3,0,1),$t=s((x.t-R.t0)/(R.at-R.t0),0,1);K.position.set((R.sx+(R.x-R.sx)*At)*e,Math.sin(At*Math.PI)*.5,(R.sy+(R.y-R.sy)*At)*e),K.rotation.z=At<1?At*6:Math.sin(M*(20+$t*40))*$t*.12,K.userData.parts.spark.scale.setScalar(.06+Math.random()*.05),S(K,$t>.85&&Math.floor(M*20)%2===0)}for(let[R,K]of this.figs)ct.has(R)||(this.dyn.remove(K),this.figs.delete(R));let it=new Set;for(let R of x.picks){it.add(R);let K=this.pickPool.get(R);K||(K=this.buildPick(R),this.dyn.add(K),this.pickPool.set(R,K));let At=(R.z||0)*e;K.position.set(R.x*e,At,R.y*e),R.kind==="gold"?K.rotation.y=M*4+R.x:R.kind==="potion"?K.position.y+=.08+Math.sin(M*4+R.x)*.05:(K.position.y+=.08+Math.sin(M*3+R.x)*.06,K.userData.parts.beam&&(K.userData.parts.beam.material.opacity=.12+Math.sin(M*5)*.05))}for(let[R,K]of this.pickPool)it.has(R)||(this.dyn.remove(K),this.pickPool.delete(R));let ut=new Set;for(let R of x.shots){ut.add(R);let K=this.shotPool.get(R);if(K||(K=this.buildShot(R),this.dyn.add(K),this.shotPool.set(R,K)),R.opts.lob){let At=s(1-R.life/R.life0,0,1);K.position.set(R.x*e,.3+4*R.peak*At*(1-At)*e,R.y*e),K.rotation.x=R.spin*(R.life0-R.life)}else K.position.set(R.x*e,.45,R.y*e),K.rotation.y=Math.atan2(R.vx,R.vy);!(R.side==="hero"&&R.opts.kind!=="magic")&&i.FX&&Math.random()<.5&&i.FX.part({kind:"px",add:!0,x:R.x,y:R.y,z:12,vx:-R.vx*.1,vy:-R.vy*.1,life:.25,color:R.side==="hero"?R.color:R.opts.kind==="magic"?"#b55088":"#e43b44"})}for(let[R,K]of this.shotPool)ut.has(R)||(this.dyn.remove(K),this.shotPool.delete(R));this.particles(x),this.decals(),this.r.render(this.scene,this.camera);let st=this.flat;st.t=this.t,st.levelAge=this.levelAge;let rt=st.ctx;rt.setTransform(1,0,0,1,0,0),rt.globalCompositeOperation="source-over",rt.globalAlpha=1,rt.clearRect(0,0,st.dw,st.dh);let mt=(R,K,At)=>this.project(R*e,(At||0)*e,K*e);this.overlay3(x,mt),st.overlayCore(x,mt)}particles(x){let v=this.t;if(i.FX){let D=0,ft=0,lt=this.ptsN.geometry,xt=this.ptsA.geometry,yt=(gt,Ut,N,Zt,Wt)=>{let Bt=gt.attributes.position.array,wt=gt.attributes.aColor.array;Bt[Ut*3]=N.x*e,Bt[Ut*3+1]=(N.z||0)*e+.06,Bt[Ut*3+2]=N.y*e;let E=l(N.color);wt[Ut*3]=E.r,wt[Ut*3+1]=E.g,wt[Ut*3+2]=E.b,gt.attributes.aSize.array[Ut]=Zt,gt.attributes.aAlpha.array[Ut]=Wt};for(let gt of i.FX.P){if(gt.kind==="ring"||gt.kind==="rune")continue;let Ut=s(gt.life/gt.max,0,1);gt.kind==="smoke"?D<Vt&&yt(lt,D++,gt,gt.size*.1,Ut*.4):gt.kind==="px"&&!gt.add?D<Vt&&yt(lt,D++,gt,gt.size*.11,s(Ut*1.5,0,1)):ft<Vt&&yt(xt,ft++,gt,gt.kind==="spark"?.1:gt.kind==="plus"?.13:gt.size*.11,s(Ut*1.4,0,1))}lt.setDrawRange(0,D),xt.setDrawRange(0,ft);for(let gt of[lt,xt])for(let Ut of["position","aColor","aSize","aAlpha"])gt.attributes[Ut].needsUpdate=!0}let b=0,M=(D,ft,lt,xt,yt,gt)=>{if(b>=this.rings.length||lt<=0)return;let Ut=this.rings[b++];Ut.visible=!0,Ut.position.set(D,gt||.05,ft),Ut.scale.set(lt,lt,1),Ut.material.color.set(xt),Ut.material.opacity=s(yt,0,1)};if(i.FX)for(let D of i.FX.P){let ft=1-D.life/D.max;D.kind==="ring"?M(D.x*e,D.y*e,D.size*e*(.2+ft),D.color,D.life/D.max):D.kind==="rune"&&M(D.x*e,D.y*e,D.size*e*(.6+ft*.4)*.6,D.color,D.life/D.max)}for(let D of x.fx)D.kind==="ring"&&M(D.x*e,D.y*e,D.r*(1.2-D.life)*e,D.color,s(D.life/.4,0,1));for(let D of x.zones||[])D.trail||M(D.x*e,D.y*e,D.r*e,D.col,.55*s((D.until-x.t)/.5,0,1)*s((x.t-D.t0)/.25,0,1));for(let D of x.marks||[])if(D.kind==="meteor"||D.kind==="barrel"){let ft=s((x.t-D.t0)/(D.at-D.t0),0,1),lt=D.kind==="barrel"?"#feae34":"#ff0044";M(D.x*e,D.y*e,D.r*e,lt,.7),M(D.x*e,D.y*e,D.r*e*ft,lt,.35)}for(let D=b;D<this.rings.length;D++)this.rings[D].visible=!1;let C=0;for(let D of x.fx){if(D.kind!=="slash"||C>=this.arcs.length)continue;let ft=this.arcs[C++],lt=Math.atan2(D.fy,D.fx),xt=1-D.life/.18,yt=(D.r-6)*e*(.7+.3*Math.min(1,xt*2.2));ft.visible=!0,ft.position.set(D.x*e,.45,D.y*e),ft.scale.set(yt,yt,1),ft.rotation.z=-lt-1.3,ft.material.color.set(D.color==="#fff"?"#ffffff":D.color),ft.material.opacity=.7-xt*.6}for(let D=C;D<this.arcs.length;D++)this.arcs[D].visible=!1}decals(){if(!i.FX)return;let x=i.FX.takeDecals();if(x.length){for(let v of x){let b=this.decN++%this.decMax,M,C,D=v.color;v.kind==="drop"?M=C=.08*(v.r>1?1.6:1):v.kind==="splat"?(M=v.r*.14,C=v.r*.08):(M=.5,C=.3,D="#ead4aa"),a.position.set(v.x*e,.004+b%40*4e-4,v.y*e),a.rotation.set(-Math.PI/2,0,r(b,1,2)*n),a.scale.set(M,C,1),a.updateMatrix(),this.dec.setMatrixAt(b,a.matrix),this.dec.setColorAt(b,h(D,.75))}this.dec.instanceMatrix.needsUpdate=!0,this.dec.instanceColor.needsUpdate=!0}}overlay3(x,v){let b=this.flat,M=b.ctx,C=b.dpr,D=this.t;for(let lt of x.mons){if(!lt.alive||lt.spawn>0)continue;let xt=this.figs.get(lt),yt=xt?xt.userData.h*xt.userData.sc:1,[gt,Ut]=v(lt.x,lt.y,yt*t+6);if(lt.state==="windup"){let N=i.Art.sprite("u_alert"),Zt=2.2*C;M.imageSmoothingEnabled=!1,M.drawImage(N.img,Math.round(gt-N.w*Zt/2),Math.round(Ut-N.h*Zt-10*C+Math.sin(D*20)*2*C),N.w*Zt,N.h*Zt)}if(lt.stun>0){M.fillStyle="#fee761";for(let N=0;N<3;N++){let Zt=D*6+N*2.1;M.fillRect(Math.round(gt+Math.cos(Zt)*12*C),Math.round(Ut-6*C+Math.sin(Zt)*4*C),3*C,3*C)}}if(!lt.boss&&(lt.hp<lt.maxHp||lt.elite)){let N=(lt.elite?40:32)*C,Zt=Math.round(gt-N/2),Wt=Math.round(Ut-2*C),Bt=5*C;M.fillStyle="#181425",M.fillRect(Zt-2*C,Wt-2*C,N+4*C,Bt+4*C),M.fillStyle="#3e2731",M.fillRect(Zt,Wt,N,Bt),M.fillStyle=lt.elite?"#feae34":"#e43b44",M.fillRect(Zt,Wt,Math.max(1,Math.round(N*lt.hp/lt.maxHp)),Bt),lt.shield>0&&(M.fillStyle="#2ce8f5",M.fillRect(Zt,Wt+Bt,Math.round(N*Math.min(1,lt.shield/lt.maxHp)),2*C))}lt.effects&&lt.effects.length&&Math.floor(D*4)%2&&(M.fillStyle=lt.effects[0].kind==="poison"?"#63c74d":"#f77622",M.fillRect(Math.round(gt-2*C),Math.round(Ut-12*C),4*C,4*C))}let ft=x.hero;if(ft.stun>0){let[lt,xt]=v(ft.x,ft.y,1.35*t);M.fillStyle="#fee761";for(let yt=0;yt<3;yt++){let gt=D*6+yt*2.1;M.fillRect(Math.round(lt+Math.cos(gt)*12*C),Math.round(xt+Math.sin(gt)*4*C),3*C,3*C)}}}};let re={giftig:"#63c74d",gepanzert:"#8b9bb4",schnell:"#fee761"}})();})();
