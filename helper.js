function dataToBind (data, databindings) {
  for (const prop in databindings) {
    if (databindings.hasOwnProperty(prop)) {
      data = data.split(`\${${prop}}`).join(databindings[prop]);
    }
  }
  return data;
};

module.exports = {
    dataToBind
};