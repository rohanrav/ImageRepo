module.exports = getTimeDiffAndPrettyText = (oDatePublished) => {
  var oResult = {};
  var oToday = new Date();
  var nDiff = oToday.getTime() - oDatePublished.getTime();

  oResult.days = Math.floor(nDiff / 1000 / 60 / 60 / 24);
  nDiff -= oResult.days * 1000 * 60 * 60 * 24;

  oResult.hours = Math.floor(nDiff / 1000 / 60 / 60);
  nDiff -= oResult.hours * 1000 * 60 * 60;

  oResult.minutes = Math.floor(nDiff / 1000 / 60);
  nDiff -= oResult.minutes * 1000 * 60;

  oResult.seconds = Math.floor(nDiff / 1000);

  var sDays = "00";
  if (oResult.days > 0) {
    sDays = String(oResult.days);
  }
  if (sDays.length === 1) {
    sDays = "0" + sDays;
  }

  var sHour = "00";
  if (oResult.hours > 0) {
    sHour = String(oResult.hours);
  }
  if (sHour.length === 1) {
    sHour = "0" + sHour;
  }

  var sMins = "00";
  if (oResult.minutes > 0) {
    sMins = String(oResult.minutes);
  }
  if (sMins.length === 1) {
    sMins = "0" + sMins;
  }

  var sSecs = "00";
  if (oResult.seconds > 0) {
    sSecs = String(oResult.seconds);
  }
  if (sSecs.length === 1) {
    sSecs = "0" + sSecs;
  }

  var sDuration = sDays + ":" + sHour + ":" + sMins + ":" + sSecs;
  oResult.duration = sDuration;

  if (oResult.days === 0) {
    if (oResult.hours === 0) {
      if (oResult.minutes === 0) {
        var sSecHolder = oResult.seconds > 1 ? "seconds" : "second";
        oResult.friendlyNiceText = oResult.seconds + " " + sSecHolder + " ago";
      } else {
        var sMinutesHolder = oResult.minutes > 1 ? "minutes" : "minute";
        oResult.friendlyNiceText = oResult.minutes + " " + sMinutesHolder + " ago";
      }
    } else {
      var sHourHolder = oResult.hours > 1 ? "hours" : "hour";
      oResult.friendlyNiceText = oResult.hours + " " + sHourHolder + " ago";
    }
  } else {
    var sDayHolder = oResult.days > 1 ? "days" : "day";
    oResult.friendlyNiceText = oResult.days + " " + sDayHolder + " ago";
  }

  return oResult;
};
