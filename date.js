//jshint esversion:6
module.exports = getDate;
// module.exports.getDate = getDate;
function getDate() {
  //   const currentDay = today.getDay();
  // const day ="";
  // if(currentDay === 6 || currentDay === 0){
    //     day="Weekend";
    //     res.sendFile(__dirname + "/weekend.html");
    // }
    // else{
      //     day="Weekday";
      //     res.sendFile(__dirname + "/weekday.html");
      // }
      
      const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const day = today.toLocaleDateString("en-US", options);
  return day;
}