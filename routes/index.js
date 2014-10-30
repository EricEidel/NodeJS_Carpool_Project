exports.get_form = function(req, res)
{
	res.render('index');
};

exports.post_form = function(req, res)
{
	var gid = req.body.gid;
	var creator = req.body.creator;
	var number_of_seats = req.body.number_of_seats;
	var from = req.body.from;
	var to = req.body.to;
	var frequency = req.body.frequency;
	var time = req.body.time;
	
	res.write( gid + " " + creator + " " + number_of_seats + " " + from + " " + to + " " + frequency + " " + time);
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
			var InsertStatement = "Insert into CARPOOLS values (" + gid + ",'" + creator + "'," + number_of_seats + ",'" + from + "','" + to + "','" + frequency + "','" + time +  "')";
		      
			conn.query(InsertStatement, function (err,tables,moreResultSets) 
			{
				if (err) 
				{
				  res.write("SQL Error: " + err + "<br>\n");
				  conn.close();
				  res.end();
				} 
			 });
				
			var sqlStatement = "SELECT * FROM ERIC.SUBMISSIONS"; 
			conn.query(sqlStatement, function (err,tables,moreResultSets) 
			{
				if (err) 
				{
				  res.write("SQL Error: " + err + "<br>\n");
				  conn.close();
				  res.end();
				} 
				else 
				{
					  // Loop through the tables list returned from the select query and print the name, creator and type   
					  for (var i=0;i<tables.length;i++) 
					  {
						var row = [];
						row.push(tables[i].ID);
						row.push(tables[i].NAME);
						
						table.push(row);
					  }
					  
					  //res.render('form_result_submission', {fname: data.fname, lname: data.lname, table: table});
				 }
			 });	
			 
			 conn.close();
		 }		
	 });
};
