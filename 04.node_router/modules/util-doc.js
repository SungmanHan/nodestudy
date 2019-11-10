const zp = n => n < 10 ? "0" + n : n

const isoDate = (d,t) => {
    /*
    type : 1 => 2019-11-03 11:11:11
    type : 2 => 19-11-03
    type : 3 => 2019년 11월 03일
    */
   let type = t? t:1;
   let year = d.getFullYear();
   let month = zp(d.getMonth() + 1);
   let day = zp(d.getDate());
   let hour = zp(d.getHours());
   let min = zp(d.getMinutes());
   let sec = zp(d.getSeconds());

   let result = "";
   switch (type) {
       case 1:
           result = year+"-"+month+"-"+day+" -"+hour+":"+min+":"+sec;
           break;
       case 2:
           result = year+"-"+month+"-"+day;
        break;
       case 3:
           result = year+"년 "+month+"월 "+day+"일";
           break;
       default:
            result = year+month+day+" "+hour+min+sec;
           break;
   }

   return result;
}


const jsToiso = (obj,field) =>{
	return obj.map((item) => {
        item[field] = isoDate(item[field]);
        return item;
	})
}

module.exports = {zp,isoDate,jsToiso}