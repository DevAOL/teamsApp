const moment = require("moment/moment");
require('moment/locale/da.js');
const formatDate = (date:string, format:string) => {
    return moment(date).format(format);
};

export default formatDate;