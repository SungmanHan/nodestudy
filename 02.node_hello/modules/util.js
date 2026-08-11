const zp = n => n < 10 ? `0${n}` : n

const isoDate = d => {
    if(!d) d = new Date();

    const year = d.getFullYear();
    const month = zp(d.getMonth() + 1);
    const day = zp(d.getDate());
    const hour = zp(d.getHours());
    const min = zp(d.getMinutes());
    const sec = zp(d.getSeconds());

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

module.exports = {zp,isoDate}