rand = {
  int(a,b){
    return Math.round( Math.random() * Math.abs(a-b) )      + Math.min(a,b);
  },
  num(a,b,c=1){
    c = (1/c);
    return this.int( a*c, b*c ) /c;
  },
  arr(...array){//spread so i dont rely on the first argument being an array
    if(array.length == 0) throw 0;
    return array[  this.int( 0, array.length -1 )  ];
  },
  str(outLen, useChars){
    var ret = ""
    while(outLen-- > 0){
      ret += this.arr(...useChars);
    }
    return ret;
  }
}
