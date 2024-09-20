export default getDate = (dateHour) => {
    function formatDate(difference) {
        //Arrange the difference of date in days, hours, minutes, and seconds format
        let months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        let result = minutes < 1 ? '< 1 min ago' : `${minutes} min ago` ;
        result = hours >= 1 ? `${hours} hr ago` : result ;
        result = days >= 1 ? `${days} days ago` : result ;
        result = months >= 1 ? `${months} mo ago` : result ;
        return result;
    }
    let date = dateHour.split('T')[0];
    let hour = dateHour.split('T')[1].split(':')[0];
    let minute = dateHour.split('T')[1].split(':')[1];
    let start = new Date(`${date} ${hour}:${minute}:00`);
    let end = new Date();
    let difference = end - start;
    return formatDate(difference);
}
