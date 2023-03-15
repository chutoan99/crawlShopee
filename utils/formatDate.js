const formatDate = (time) => {
  const date = new Date(time * 1000);
  return date.toLocaleString();
};
module.exports = formatDate;
