exports.get_form = function(req, res)
{
	res.render('index');
};

exports.post_form = function(req, res, ibmdb)
{               
	var gid = req.body.gid;  
	var from = req.body.from;
	var to = req.body.to;
	var creator = req.body.creator;
	var frequency = "";
	var number_of_seats = req.body.number_of_seats;
	var time = req.body.time;
	
	//res.write( gid + " " + creator + " " + number_of_seats + " " + from + " " + to + " " + frequency + " " + time);
	//res.end();
	
	var table = [];
	
	ibmdb.open(dsnString, function(err, conn) 
	{
		 if (err) 
		 {
			res.write("error: ", err.message + "<br>\n");
			res.end();
		 } 
		 else 
		 {
			var InsertStatement = "Insert into CARPOOL.GROUPS values (" + gid + ",'" + creator + "'," + number_of_seats + ",'" + from + "','" + to + "','" + frequency + "','" + time +  "')";
		      
			conn.query(InsertStatement, function (err,tables,moreResultSets) 
			{
				if (err) 
				{
				  res.write("SQL Error: " + err + "<br>\n");
				  conn.close();
				  res.end();
				}
				else
				{
					res.write("Success!");
					conn.close();			
					res.end();
				}				
			 });
		 }		
	 });
};
