const fs = require('fs'),
  es = require('event-stream'),
  RegisterSchema = require('./models/register'),
  CampaingSchema = require('./models/campaing');

let campiansave = new CampaingSchema({code:2, name: "the campain system"});
campiansave.save();

const write = async (line, fields, campaing, separator) => {
  let lineSplit = line.split(separator);
  
  let register = RegisterSchema({
    campaing,
    firstName: lineSplit[fields.firstName],
    lastName: lineSplit[fields.lastName],
    phone: lineSplit[fields.phone],
    address: lineSplit[fields.address],
  });
  await register.save();
}

const readFile = (file, fields, campaing, separator) => {
  let lineNr = 0;

  return new Promise(
    function(resolve, reject){
      let s = fs.createReadStream(file)
      .pipe(es.split())
      .pipe(es.mapSync(async function(line){

          // pause the readstream
          s.pause();

          lineNr += 1;
          if( lineNr > 1 ){
            await write(line, fields, campaing, separator);
          }
          // process line here and call s.resume() when rdy
          // function below was for logging memory usage
          // logMemoryUsage(lineNr);

          // resume the readstream, possibly from a callback
          s.resume();
        })
        .on('error', function(err){
          console.log('Error while reading file.', err);
          resolve(false);
        })
        .on('end', function(){
          console.log('Read entire file.')
          reject(true);
        })
      );
    }
  );
}

module.exports = async function upload(req, res) {
  const { body: { fields, separator }, file } = req;
  const campaing = await CampaingSchema.findOne().sort({ _id: -1 });
  try {
    await readFile(file.path, JSON.parse(fields), campaing._id, separator);
  } catch (error) {
    console.log(error);
  }

  res.send({success:true});
}