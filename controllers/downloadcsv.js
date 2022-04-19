const User = require("../models/user");
const CsvParser = require("json2csv").Parser;
exports.downloadcsv = (req, res, next) => {
    User.find({}).then((objs) => {
        let data = [];
    
        objs.forEach((obj) => {
          const { id, name, email, phone , role , createdAt } = obj;
          data.push({ id, name, email, phone , role , createdAt });
        });
    
        const csvFields = ["Id", "Name", "Email", "Phone , Role , CreatedAt"];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(data);
    
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=info.csv");
    
        res.status(200).end(csvData);
      });
}