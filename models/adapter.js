module.exports.get_home = function get_home(req, res)
{
	var file_name = path.join(__dirname, '../views/home.ejs');
	req.session.userName = 'omg';
	res.render(file_name);
}