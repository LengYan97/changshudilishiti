let a = 6378137.0; // 长半轴
let f = 1.0 / 298.257222101; // 扁平率
let b = a * (1 - f); // 短半轴
let e = Math.sqrt(a * a - b * b) / a; // 椭球第一偏心率
let e2 = Math.sqrt(a * a - b * b) / b; // 椭球第二偏心率
let ipi = Math.PI / 180; // 角度华为弧度的单位
let L0 = 120.7833333333333 * ipi;// 投影带的中央子午线

const TransformUtils = {
    wgs84ToSZ2000(lon,lat){
        let coodinateValue = [];

		lat = lat * ipi;
		lon = lon * ipi;

		let t = Math.tan(lat);//
		let N = a / Math.sqrt(1 - e * e * Math.pow(Math.sin(lat), 2)); // 子午圈曲率半径
		let g = e2 * Math.cos(lat);
		let l = lon - L0;// 距离中央子午线的经差

		let m2 = Math.pow(e, 2);
		let m4 = Math.pow(e, 4);
		let m6 = Math.pow(e, 6);
		let m8 = Math.pow(e, 8);
		let m10 = Math.pow(e, 10);

		let A0 = a * (1 - e * e) * (1 + (3.0 / 4) * m2 + (45.0 / 64) * m4 + (175.0 / 256) * m6
				+ (11025.0 / 16384) * m8 + (43659.0 / 65536) * m10);
		let B0 = a * (1 - e * e) * ((3.0 / 4) * m2 + (15.0 / 16) * m4 + (525.0 / 512) * m6 + (2205.0 / 2048) * m8
				+ (72765.0 / 65536.0) * m10);
                let C0 = a * (1 - e * e)
				* ((15.0 / 64) * m4 + (105.0 / 256) * m6 + (2205.0 / 4096) * m8 + (10395.0 / 16384) * m10);
                let D0 = a * (1 - e * e) * ((35.0 / 512) * m6 + (315.0 / 2048) * m8 + (31185.0 / 131072) * m10);
                let E0 = a * (1 - e * e) * ((315.0 / 16384) * m8 + (3465.0 / 65536.0) * m10);
                let F0 = a * (1 - e * e) * ((693.0 / 131072) * m10);
		// 计算Fx(B)函数
		let FxB = (-1.0 / 2) * B0 * Math.sin(2 * lat) + (1.0 / 4) * C0 * Math.sin(4 * lat)
				+ (-1.0 / 6) * D0 * Math.sin(6 * lat) + (1.0 / 8) * E0 * Math.sin(8 * lat)
				+ (-1.0 / 10) * F0 * Math.sin(10 * lat);
		// 计算Fx(B，L)
		let FxBL = (1.0 / 2) * N * Math.sin(lat) * Math.cos(lat) * l * l
				+ (1.0 / 24) * N * Math.sin(lat) * Math.pow(Math.cos(lat), 3) * (5 - t * t + 9 * g * g + 4 * Math.pow(g, 4))
						* Math.pow(l, 4)
				+ (1.0 / 720) * N * Math.sin(lat) * Math.pow(Math.cos(lat), 5) * (61 - 58 * t * t + Math.pow(t, 4))
						* Math.pow(l, 6);
		// 计算Fy(B,L)
		let FyBL = (1.0 / 6) * Math.pow(Math.cos(lat), 3) * (1 - t * t + g * g) * Math.pow(l, 3)
				+ (1.0 / 120) * N * Math.pow(Math.cos(lat), 5)
						* (5 - 18 * t * t + Math.pow(t, 4) + 14 * g * g - 58 * g * g * t * t) * Math.pow(l, 5);
		// 计算x的值
		let x = A0 * lat + FxB + FxBL;
		// 计算y的值
		let y = N * Math.cos(lat) * l + FyBL;
		coodinateValue.push(y + 350000.0);// 东偏
		coodinateValue.push(x - 2800000.0);// 北偏
		return coodinateValue;
    },
    sz2000ToWGS84(lon,lat)
    {
		lat = lat+2800000.0;
		lon = lon-350000.0;
        let outputValue=[];
        let b=a*(1-f);    //短半轴
        let e=Math.sqrt(a*a-b*b)/a;   //椭球第一偏心率
        let e2=Math.sqrt(a*a-b*b)/b;  //椭球第二偏心率

        //计算公式各类参数
        let m0=a*(1-e*e);
        let m2=3.0/2 *e*e*m0;
        let m4=5.0/4 *e*e*m2;
        let m6=7.0/6 *e*e*m4;
        let m8=9.0/8 *e*e*m6;

        let a0=m0+m2/2+3.0/8*m4+5.0/16*m6+35.0/128*m8;
        let a2=m2/2+m4/2+15.0/32*m6+7.0/16*m8;
        let a4=m4/8+3.0/16*m6+7.0/32*m8;
        let a6=m6/32+m8/16;
        let a8=m8/128;

        //迭代计算Bf，Bf为底点纬度，直到Bf(i+1)-Bfi<c;
        let bf;
        let Bf1=lat/a0;   //初始化Bf
        //按子午线弧长公式迭代计算
        let Bfi0=Bf1;
        let Bfi1;
        let FBfi0;
        while (true)
        {
            FBfi0=-a2*Math.sin(2*Bfi0)/2+a4*Math.sin(4*Bfi0)/4-a6*Math.sin(6*Bfi0)/6+a8*Math.sin(8*Bfi0)/8;
            Bfi1=(lat-FBfi0)/a0;
            if(Math.abs(Bfi1-Bfi0)<Math.PI*Math.pow(10,-8)/(36*18))
                break;
            Bfi0=Bfi1;
        }
        bf=Bfi1;
        //根据公式计算B，L
        let Nf=a*Math.pow(1-e*e*Math.pow(Math.sin(bf),2),-1.0/2);
        let Mf=a*(1-e*e)*Math.pow(1-e*e*Math.pow(Math.sin(bf),2),-3.0/2);
        let tf=Math.tan(bf);
        let qf2=e2*e2*Math.cos(bf);

        let B=bf-tf*lon*lon/(2*Mf*Nf)+tf*(5+3*tf*tf+qf2-9*qf2*tf*tf)*Math.pow(lon,4)/(24*Mf*Math.pow(Nf,3))
                -tf*(61+90*tf*tf+45*Math.pow(tf,4))*Math.pow(lon,6)/(720*Mf*Math.pow(Nf,5));
                let l=lon/(Nf*Math.cos(bf))-lon*lon*lon*(1+2*tf*tf+qf2)/(6*Nf*Nf*Nf*Math.cos(bf))
                +Math.pow(lon,5)*(5+28*tf*tf+24*Math.pow(tf,4)+6*qf2+8*qf2*tf*tf)/(120*Math.pow(Nf,5)*Math.cos(bf));
        //B,l结果为弧度,需要转换
        let L=L0/ipi+l/ipi;
        outputValue.push(L);
        outputValue.push(B/ipi);
		return outputValue;
    }
}
export default TransformUtils