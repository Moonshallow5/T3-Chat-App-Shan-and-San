import moment from "moment-timezone";

export const convertDateTime = (datetime, format = "YYYY-MM-DD hh:mm a") => {
  return moment(datetime).format(format);
};
export const timeAgo = (timestamp) => {
  const now = moment();
  const inputTime = moment(timestamp);
  const secondsAgo = now.diff(inputTime, "seconds");
  const minutesAgo = now.diff(inputTime, "minutes");
  const hoursAgo = now.diff(inputTime, "hours");
  const daysAgo = now.diff(inputTime, "days");

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hours ago`;
  } else {
    return `${daysAgo} days ago`;
  }
};
